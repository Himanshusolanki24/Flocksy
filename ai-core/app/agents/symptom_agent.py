from __future__ import annotations

from app.schemas import AgentFinding


class SymptomAgent:
    async def run(self, symptoms: list[str], disease_record: dict) -> AgentFinding:
        known_symptoms = [symptom.lower() for symptom in disease_record.get("symptoms", [])]
        matched = [symptom for symptom in symptoms if symptom.lower() in known_symptoms]
        score = len(matched) / max(len(known_symptoms), 1)

        return AgentFinding(
            agent="symptom_analysis",
            claim="Reported symptoms partially align with the highest-ranked disease profile.",
            score=min(max(score, 0.2 if symptoms else 0.0), 0.95),
            evidence=[f"Matched symptom: {item}" for item in matched],
            counter_evidence=["No symptoms were provided."] if not symptoms else [],
            payload={
                "reported_symptoms": symptoms,
                "matched_symptoms": matched,
                "known_symptoms": disease_record.get("symptoms", []),
            },
        )
