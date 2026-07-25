from __future__ import annotations

from app.schemas import AgentFinding, AnalyzeRequest


class EnvironmentAgent:
    async def run(self, request: AnalyzeRequest, environment_data: dict) -> AgentFinding:
        recommendation = environment_data.get("recommendation") or {}
        evidence = []
        if request.context.temperatureC is not None:
            evidence.append(f"Observed temperature: {request.context.temperatureC}C.")
        if request.context.humidityPercent is not None:
            evidence.append(f"Observed humidity: {request.context.humidityPercent}%.")
        if recommendation.get("warnings"):
            evidence.extend(recommendation["warnings"])

        return AgentFinding(
            agent="environment_analysis",
            claim="House conditions may be increasing flock stress or disease pressure.",
            score=0.78 if recommendation.get("warnings") else 0.52,
            evidence=evidence,
            counter_evidence=[] if evidence else ["No environment telemetry was provided."],
            payload=recommendation,
        )
