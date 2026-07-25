from __future__ import annotations

from app.localization.rural_hindi_formatter import RuralHindiFormatter
from app.schemas import DecisionResult, LocalizedResponse


class LocalizationFormatter:
    def __init__(self) -> None:
        self.hindi = RuralHindiFormatter()

    async def render(self, decision: DecisionResult, language: str) -> LocalizedResponse:
        requested = (language or "en").lower()
        if requested.startswith("hi"):
            return self.hindi.render(decision)

        top_disease = decision.top_disease or "No clear disease"
        headline = f"Provisional diagnosis: {top_disease}"
        summary = (
            f"The case is being treated as {top_disease} with {round(decision.confidence * 100)}% confidence. "
            f"Urgency is {decision.risk.urgency} and safety status is {decision.safety.status}."
        )
        actions = [action.title for action in decision.recommended_actions[:4]]
        return LocalizedResponse(
            language="en",
            headline=headline,
            summary=summary,
            actions=actions,
            warnings=decision.safety.warnings[:4],
        )
