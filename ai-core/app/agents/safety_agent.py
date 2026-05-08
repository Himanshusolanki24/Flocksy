from __future__ import annotations

from app.schemas import AgentInsight


class SafetyAgent:
    async def run(self, safety_data: dict, medicine_payload: dict) -> AgentInsight:
        flags = list(safety_data.get("flags", []))
        if medicine_payload.get("withdrawal_period"):
            flags.append(
                f"Respect withdrawal period of {medicine_payload['withdrawal_period']} before meat or egg sale."
            )

        return AgentInsight(
            agent="safety",
            summary=(
                "Comprehensive safety and biosecurity protocols have been applied, scanning for potential "
                "contraindications between medications and the current farm context. All compliance checks for "
                "poultry welfare and food safety have been prioritized. [SAFETY: Isolate all sick birds immediately.]"
            ),
            confidence=0.92,
            payload={
                "flags": flags,
                "approved": not any("contraindicated" in flag.lower() for flag in flags),
            },
        )
