from __future__ import annotations

from app.schemas import AgentFinding, AnalyzeRequest


class FeedAgent:
    async def run(self, request: AnalyzeRequest, feed_data: dict) -> AgentFinding:
        plan = feed_data.get("recommendation") or {}
        evidence = []
        if request.context.ageInDays is not None:
            evidence.append(f"Feed profile selected for age {request.context.ageInDays} days.")
        if plan.get("protein"):
            evidence.append(f"Protein target: {plan['protein']}.")
        if plan.get("energy"):
            evidence.append(f"Energy target: {plan['energy']}.")

        return AgentFinding(
            agent="feed_optimization",
            claim="Feed guidance supports recovery and age-appropriate flock performance.",
            score=0.8 if plan else 0.35,
            evidence=evidence,
            counter_evidence=[] if plan else ["No feed recommendation record was found."],
            payload={
                "ageInDays": request.context.ageInDays,
                "plan": plan,
            },
        )
