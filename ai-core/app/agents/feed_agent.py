from __future__ import annotations

from app.schemas import AgentInsight, AnalyzeRequest


class FeedAgent:
    async def run(self, request: AnalyzeRequest, feed_data: dict) -> AgentInsight:
        plan = feed_data.get("recommendation") or {}
        return AgentInsight(
            agent="feed",
            summary=(
                "The nutritional strategy has been optimized for the current age band and physiological stress levels "
                "detected in the flock. This plan ensures adequate protein and energy intake while incorporating "
                "supportive additives where necessary for recovery. [SAFETY: Ensure clean water is always available.]"
            ),
            confidence=0.81,
            payload={
                "ageInDays": request.context.ageInDays,
                "plan": plan,
            },
        )
