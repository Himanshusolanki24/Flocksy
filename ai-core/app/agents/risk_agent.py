from __future__ import annotations

from app.schemas import AgentFinding


class RiskAgent:
    async def run(self, top_candidate: dict, environment_data: dict, memory_data: dict) -> AgentFinding:
        evidence: list[str] = []
        counter_evidence: list[str] = []
        score = float(top_candidate.get("confidence", 0.0))

        disease = top_candidate.get("disease", "Unknown")
        spread = top_candidate.get("spread_rate")
        mortality = top_candidate.get("mortality_rate")

        if spread:
            evidence.append(f"Recorded spread profile: {spread}")
        if mortality:
            evidence.append(f"Recorded mortality profile: {mortality}")

        environment_warning_count = len((environment_data.get("recommendation") or {}).get("warnings", []))
        if environment_warning_count:
            evidence.append(f"Environment raised {environment_warning_count} warning signals.")
            score = min(score + 0.08, 0.95)

        if memory_data.get("last_incident"):
            evidence.append("Farm memory shows a prior incident that increases recurrence concern.")

        if not evidence:
            counter_evidence.append("Risk is based on limited structured evidence.")

        return AgentFinding(
            agent="risk_analysis",
            claim=f"Operational risk is elevated for {disease} and needs fast flock-level action.",
            score=max(score, 0.3),
            evidence=evidence,
            counter_evidence=counter_evidence,
            payload={
                "disease": disease,
                "spread_rate": spread,
                "mortality_rate": mortality,
            },
        )
