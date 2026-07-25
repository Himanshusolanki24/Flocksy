from __future__ import annotations

from app.schemas import AgentFinding, VisionResult


class DiseaseAgent:
    async def run(self, vision_result: VisionResult, disease_record: dict, symptoms: list[str]) -> AgentFinding:
        label = disease_record.get("disease", vision_result.primary_label)
        evidence = []
        counter_evidence = []

        if vision_result.primary_label:
            evidence.append(
                f"Vision model top match: {vision_result.primary_label} ({round(vision_result.primary_confidence * 100)}%)."
            )
        if disease_record.get("symptoms"):
            evidence.append(f"Verified disease profile includes: {', '.join(disease_record['symptoms'][:4])}.")
        if symptoms:
            evidence.append(f"Farmer-reported signs: {', '.join(symptoms[:4])}.")
        else:
            counter_evidence.append("No structured symptom list was provided by the farmer.")

        return AgentFinding(
            agent="disease_detection",
            claim=f"{label} is the strongest disease candidate from the current evidence.",
            score=min(max(vision_result.primary_confidence, 0.3), 0.97),
            evidence=evidence,
            counter_evidence=counter_evidence,
            payload={
                "prediction": label,
                "verified_record": disease_record,
            },
        )
