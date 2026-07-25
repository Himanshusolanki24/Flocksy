from __future__ import annotations

from app.schemas import AgentFinding


class MemoryAgent:
    async def run(self, memory_data: dict, disease_name: str) -> AgentFinding:
        evidence: list[str] = []
        counter_evidence: list[str] = []
        score = 0.35

        last_incident = memory_data.get("last_incident")
        if last_incident:
            evidence.append(f"Previous farm incident on record: {last_incident}")
            if disease_name and disease_name.lower() in str(last_incident).lower():
                score = 0.78
                evidence.append("The current top disease resembles a prior farm incident.")
            else:
                score = 0.52

        recommended_focus = memory_data.get("recommended_focus")
        if recommended_focus:
            evidence.append(f"Farm memory focus: {recommended_focus}")

        if not evidence:
            counter_evidence.append("No meaningful outbreak memory was found for this farm.")

        return AgentFinding(
            agent="farm_memory",
            claim="Farm history contributes context for recurrence and management risk.",
            score=score,
            evidence=evidence,
            counter_evidence=counter_evidence,
            payload=memory_data,
        )
