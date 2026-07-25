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
from app.schemas import AnalyzeRequest, VisionCandidate, VisionResult


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

    def _image_quality(self, image: Image.Image) -> str:
        width, height = image.size
        if width < 160 or height < 160:
            return "low"
        if width < 300 or height < 300:
            return "medium"
        return "good"

    def _fallback_prediction(self, request: AnalyzeRequest) -> VisionResult:
        text = request.symptoms.lower()
        if request.mediaBase64 and "bloody" in text:
            label = "Coccidiosis"
            confidence = 0.84
        elif request.mediaBase64 and ("breathing" in text or "twisted neck" in text):
            label = "Newcastle_Disease"
            confidence = 0.73
        elif request.mediaBase64:
            label = "Healthy"
            confidence = 0.61
        else:
            label = "Image not provided"
            confidence = 0.0

        return VisionResult(
            primary_label=label,
            primary_confidence=confidence,
            source="symptom-fallback" if request.mediaBase64 else "no-image",
            top_matches=[VisionCandidate(label=label, confidence=confidence)],
            heatmap_url=None,
            lesion_regions=[],
            image_quality="unknown" if not request.mediaBase64 else "medium",
        )

    async def predict(self, request: AnalyzeRequest) -> VisionResult:
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
            probabilities = torch.softmax(outputs, dim=1).squeeze(0)

        top_k = min(3, len(self._classes))
        confidence_values, prediction_indices = torch.topk(probabilities, k=top_k)

        top_matches = [
            VisionCandidate(
                label=self._classes[int(index.item())],
                confidence=float(confidence.item()),
            )
            for confidence, index in zip(confidence_values, prediction_indices)
        ]
        top_match = top_matches[0]

        return VisionResult(
            primary_label=top_match.label,
            primary_confidence=top_match.confidence,
            source="cnn-model",
            top_matches=top_matches,
            heatmap_url=None,
            lesion_regions=[],
            image_quality=self._image_quality(image),
        )
