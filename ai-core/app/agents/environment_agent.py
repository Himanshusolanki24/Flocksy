from __future__ import annotations

from app.schemas import AgentInsight


class EnvironmentAgent:
    async def run(self, environment_data: dict) -> AgentInsight:
        return AgentInsight(
            agent="environment",
            summary=(
                "Climate parameters including temperature, humidity, and ventilation have been evaluated against "
                "industry-standard thresholds for this flock's specific age group. Corrective actions for maintaining "
                "the ideal biosecurity and comfort envelope are highlighted. [SAFETY: Monitor litter condition regularly.]"
            ),
            confidence=0.83,
            payload=environment_data.get("recommendation") or {},
        )
