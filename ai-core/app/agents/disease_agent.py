from __future__ import annotations

from app.schemas import AgentInsight


class DiseaseAgent:
    async def run(self, vision_result: dict, disease_data: dict, symptom_summary: str) -> AgentInsight:
        match = disease_data.get("match") or {}
        label = match.get("disease", vision_result.get("label", "Unknown"))
        confidence = max(float(vision_result.get("confidence", 0.0)), 0.55 if match else 0.35)

        return AgentInsight(
            agent="disease",
            summary=(
                f"The most likely condition identified is {label}. This assessment is based on a visual match "
                f"and reported symptoms. {symptom_summary} The detection highlights common pathological "
                f"markers associated with this specific poultry disease. [SAFETY: Verify with clinical tests.]"
            ),
            confidence=min(confidence, 0.97),
            payload={
                "prediction": label,
                "verified_record": match,
            },
        )
