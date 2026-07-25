from __future__ import annotations

from app.schemas import AgentFinding


class SafetyAgent:
    async def run(self, safety_data: dict, medicine_payload: dict, age_in_days: int | None) -> AgentFinding:
        flags = list(safety_data.get("flags", []))
        if medicine_payload.get("withdrawal_period"):
            flags.append(f"Respect withdrawal period: {medicine_payload['withdrawal_period']}.")

        blocked = any(
            keyword in flag.lower()
            for flag in flags
            for keyword in ["contraindicated", "unsafe", "not safe", "overdose"]
        )
        if age_in_days is not None and age_in_days < 7:
            flags.append("Very young chicks require extra veterinary dosage confirmation.")

        status = "block_and_escalate" if blocked else "allow_with_warning" if flags else "allow"

        return AgentFinding(
            agent="safety_validation",
            claim="Safety rules were applied before any treatment advice was surfaced.",
            score=0.92,
            evidence=flags or ["No safety rule conflict was triggered."],
            counter_evidence=[],
            payload={
                "flags": flags,
                "approved": not blocked,
                "status": status,
            },
        )
