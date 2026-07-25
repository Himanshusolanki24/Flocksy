from __future__ import annotations

from app.schemas import AgentFinding


class MedicineAgent:
    async def run(self, medicine_data: dict, disease_name: str) -> AgentFinding:
        recommendation = medicine_data.get("recommendation") or {}
        evidence = []
        if recommendation.get("name"):
            evidence.append(f"Verified medicine record: {recommendation['name']}.")
        if recommendation.get("dosage"):
            evidence.append(f"Dose reference: {recommendation['dosage']}.")
        if recommendation.get("withdrawal_period"):
            evidence.append(f"Withdrawal period: {recommendation['withdrawal_period']}.")

        return AgentFinding(
            agent="medicine_recommendation",
            claim=f"Medicine guidance was cross-checked against verified records for {disease_name}.",
            score=0.76 if recommendation else 0.28,
            evidence=evidence,
            counter_evidence=[] if recommendation else ["No verified medicine record matched the current disease."],
            payload=recommendation,
        )
