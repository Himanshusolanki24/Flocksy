from __future__ import annotations

from app.schemas import AnalyzeRequest


class LLMService:
    async def summarize_symptoms(self, request: AnalyzeRequest) -> str:
        if not request.symptoms.strip():
            return "No free-text symptoms were provided, so the system will rely on farm context and verified reference data."

        return (
            "Farmer-reported symptoms suggest a flock health issue that should be cross-checked with verified disease, "
            "medicine, feed, and environment records before recommending action."
        )
