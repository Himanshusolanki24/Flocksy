from __future__ import annotations

from app.schemas import DecisionResult, LocalizedResponse


class RuralHindiFormatter:
    def render(self, decision: DecisionResult) -> LocalizedResponse:
        disease = decision.top_disease or "कोई साफ बीमारी तय नहीं हुई"
        summary = (
            f"मुर्गियों में दिख रहे लक्षण {disease} से मिलते हैं। "
            f"अभी इसे {decision.risk.urgency} मामला मानकर जल्दी कार्रवाई करें।"
        )
        return LocalizedResponse(
            language="hi",
            headline=f"संभावित समस्या: {disease}",
            summary=summary,
            actions=[action.title for action in decision.recommended_actions[:4]],
            warnings=decision.safety.warnings[:4],
        )
