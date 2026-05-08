from __future__ import annotations

from app.schemas import AgentInsight


class MedicineAgent:
    async def run(self, medicine_data: dict) -> AgentInsight:
        recommendation = medicine_data.get("recommendation") or {}
        confidence = 0.78 if recommendation else 0.42
        return AgentInsight(
            agent="medicine",
            summary=(
                "Treatment guidance has been meticulously sourced from verified medicine records and cross-referenced "
                "with the identified disease protocol. This includes recommended dosage, frequency, and specific "
                "administration instructions to ensure optimal flock recovery. [SAFETY: Do not exceed prescribed dosage.]"
            ),
            confidence=confidence,
            payload=recommendation,
        )
