from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import torch
from PIL import Image
from torch import nn
from torch.optim import Adam
from torch.utils.data import DataLoader, Dataset


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


class PoultryImageDataset(Dataset):
    def __init__(self, root: Path, image_size: int, sample_limit: int | None = None) -> None:
        self.root = root
        self.image_size = image_size
        self.classes = sorted([path.name for path in root.iterdir() if path.is_dir()])
        self.class_to_idx = {label: index for index, label in enumerate(self.classes)}
        self.samples: list[tuple[Path, int]] = []
        per_class_samples: dict[str, list[tuple[Path, int]]] = {}

        for label in self.classes:
            class_dir = root / label
            current_samples: list[tuple[Path, int]] = []
            for path in sorted(class_dir.iterdir()):
                if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS:
                    current_samples.append((path, self.class_to_idx[label]))
                    self.samples.append((path, self.class_to_idx[label]))
            per_class_samples[label] = current_samples

        if sample_limit is not None:
            self.samples = self._balanced_subset(per_class_samples, sample_limit)

    def _balanced_subset(
        self,
        per_class_samples: dict[str, list[tuple[Path, int]]],
        sample_limit: int,
    ) -> list[tuple[Path, int]]:
        subset: list[tuple[Path, int]] = []
        indices = {label: 0 for label in self.classes}

        while len(subset) < sample_limit:
            progressed = False
            for label in self.classes:
                label_samples = per_class_samples[label]
                index = indices[label]
                if index < len(label_samples) and len(subset) < sample_limit:
                    subset.append(label_samples[index])
                    indices[label] += 1
                    progressed = True
            if not progressed:
                break

        return subset

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, index: int) -> tuple[torch.Tensor, torch.Tensor]:
        path, label = self.samples[index]
        image = Image.open(path).convert("RGB")
        image = image.resize((self.image_size, self.image_size))
        tensor = torch.from_numpy(np.asarray(image, dtype=np.float32)).permute(2, 0, 1) / 255.0
        tensor = (tensor - 0.5) / 0.5
        return tensor, torch.tensor(label, dtype=torch.long)


class PoultryCNN(nn.Module):
    def __init__(self, num_classes: int) -> None:
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((1, 1)),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes),
        )

    def forward(self, inputs: torch.Tensor) -> torch.Tensor:
        return self.classifier(self.features(inputs))


def evaluate(model: nn.Module, loader: DataLoader, device: str) -> tuple[float, float]:
    model.eval()
    total_loss = 0.0
    correct = 0
    total = 0
    criterion = nn.CrossEntropyLoss()

    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            total_loss += loss.item()
            preds = outputs.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

    accuracy = correct / total if total else 0.0
    average_loss = total_loss / max(len(loader), 1)
    return average_loss, accuracy


def train(args: argparse.Namespace) -> None:
    data_dir = Path(args.data_dir)
    artifact_dir = Path(args.output_dir)
    artifact_dir.mkdir(parents=True, exist_ok=True)

    train_dataset = PoultryImageDataset(data_dir / "train", args.image_size, args.limit_train_samples)
    val_dataset = PoultryImageDataset(data_dir / "val", args.image_size, args.limit_val_samples)
    test_dataset = PoultryImageDataset(data_dir / "test", args.image_size, args.limit_test_samples)

    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, num_workers=0)
    test_loader = DataLoader(test_dataset, batch_size=args.batch_size, num_workers=0)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = PoultryCNN(len(train_dataset.classes)).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = Adam(model.parameters(), lr=args.learning_rate)

    history: list[dict[str, float]] = []
    best_val_acc = 0.0
    best_model_path = artifact_dir / "best_poultry_disease_cnn.pt"

    for epoch in range(args.epochs):
        model.train()
        train_loss = 0.0
        train_correct = 0
        train_total = 0

        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            train_loss += loss.item()
            train_correct += (outputs.argmax(dim=1) == labels).sum().item()
            train_total += labels.size(0)

        avg_train_loss = train_loss / max(len(train_loader), 1)
        train_acc = train_correct / train_total if train_total else 0.0
        val_loss, val_acc = evaluate(model, val_loader, device)

        history.append(
            {
                "epoch": epoch + 1,
                "train_loss": avg_train_loss,
                "train_accuracy": train_acc,
                "val_loss": val_loss,
                "val_accuracy": val_acc,
            }
        )

        print(
            f"epoch={epoch + 1} "
            f"train_loss={avg_train_loss:.4f} train_acc={train_acc:.4f} "
            f"val_loss={val_loss:.4f} val_acc={val_acc:.4f}"
        )

        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            torch.save(
                {
                    "state_dict": model.state_dict(),
                    "classes": train_dataset.classes,
                    "image_size": args.image_size,
                },
                best_model_path,
            )

    checkpoint = torch.load(best_model_path, map_location=device)
    model.load_state_dict(checkpoint["state_dict"])
    test_loss, test_acc = evaluate(model, test_loader, device)

    metadata = {
        "classes": train_dataset.classes,
        "image_size": args.image_size,
        "epochs": args.epochs,
        "batch_size": args.batch_size,
        "learning_rate": args.learning_rate,
        "best_val_accuracy": best_val_acc,
        "test_accuracy": test_acc,
        "test_loss": test_loss,
        "train_samples": len(train_dataset),
        "val_samples": len(val_dataset),
        "test_samples": len(test_dataset),
        "history": history,
    }

    (artifact_dir / "metrics.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(f"test_loss={test_loss:.4f} test_acc={test_acc:.4f}")
    print(f"saved_model={best_model_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", required=True)
    parser.add_argument("--output-dir", default="artifacts")
    parser.add_argument("--epochs", type=int, default=12)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--learning-rate", type=float, default=1e-3)
    parser.add_argument("--image-size", type=int, default=128)
    parser.add_argument("--limit-train-samples", type=int)
    parser.add_argument("--limit-val-samples", type=int)
    parser.add_argument("--limit-test-samples", type=int)
    train(parser.parse_args())
