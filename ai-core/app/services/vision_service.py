from __future__ import annotations

import base64
from io import BytesIO
from pathlib import Path
from typing import Optional

import numpy as np
import torch
from PIL import Image
from torch import nn

from app.core.config import settings
from app.schemas import AnalyzeRequest


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


class VisionService:
    def __init__(self) -> None:
        self._model: Optional[PoultryCNN] = None
        self._classes: Optional[list[str]] = None
        self._image_size = 64
        self._device = "cuda" if torch.cuda.is_available() else "cpu"

    def _resolve_model_path(self) -> Path:
        configured = Path(settings.vision_model_path)
        if configured.is_absolute():
            return configured
        return (Path(__file__).resolve().parent.parent.parent / configured).resolve()

    def _ensure_model(self) -> bool:
        if self._model is not None and self._classes is not None:
            return True

        model_path = self._resolve_model_path()
        if not model_path.exists():
            return False

        checkpoint = torch.load(model_path, map_location=self._device)
        classes = checkpoint["classes"]
        model = PoultryCNN(len(classes))
        model.load_state_dict(checkpoint["state_dict"])
        model.to(self._device)
        model.eval()

        self._classes = classes
        self._model = model
        self._image_size = int(checkpoint.get("image_size", 64))
        return True

    def _decode_image(self, media_base64: str) -> Image.Image:
        image_bytes = base64.b64decode(media_base64)
        return Image.open(BytesIO(image_bytes)).convert("RGB")

    def _preprocess(self, image: Image.Image) -> torch.Tensor:
        resized = image.resize((self._image_size, self._image_size))
        array = np.asarray(resized, dtype=np.float32)
        tensor = torch.from_numpy(array).permute(2, 0, 1) / 255.0
        tensor = (tensor - 0.5) / 0.5
        return tensor.unsqueeze(0).to(self._device)

    def _fallback_prediction(self, request: AnalyzeRequest) -> dict:
        text = request.symptoms.lower()
        if request.mediaBase64 and "bloody" in text:
            return {"label": "Coccidiosis", "confidence": 0.84, "source": "symptom-fallback"}
        if request.mediaBase64 and "breathing" in text:
            return {"label": "Newcastle_Disease", "confidence": 0.73, "source": "symptom-fallback"}
        if request.mediaBase64:
            return {"label": "Healthy", "confidence": 0.61, "source": "symptom-fallback"}
        return {"label": "Image not provided", "confidence": 0.0, "source": "no-image"}

    async def predict(self, request: AnalyzeRequest) -> dict:
        if not request.mediaBase64:
            return self._fallback_prediction(request)

        if not self._ensure_model():
            return self._fallback_prediction(request)

        image = self._decode_image(request.mediaBase64)
        inputs = self._preprocess(image)

        assert self._model is not None
        assert self._classes is not None

        with torch.no_grad():
            outputs = self._model(inputs)
            probabilities = torch.softmax(outputs, dim=1)
            confidence, prediction = torch.max(probabilities, dim=1)

        label = self._classes[int(prediction.item())]
        return {
            "label": label,
            "confidence": float(confidence.item()),
            "source": "cnn-model",
        }
