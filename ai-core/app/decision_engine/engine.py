from __future__ import annotations

from uuid import uuid4

from app.agents.disease_agent import DiseaseAgent
from app.agents.environment_agent import EnvironmentAgent
from app.agents.feed_agent import FeedAgent
from app.agents.medicine_agent import MedicineAgent
from app.agents.memory_agent import MemoryAgent
from app.agents.risk_agent import RiskAgent
from app.agents.safety_agent import SafetyAgent
from app.agents.symptom_agent import SymptomAgent
from app.localization.formatter import LocalizationFormatter
from app.schemas import (
    AnalyzeRequest,
    DecisionResult,
    DifferentialDiagnosisItem,
    RecommendedAction,
    RiskAssessment,
    SafetyAssessment,
    VisionResult,
)


class DecisionEngine:
    def __init__(self) -> None:
        self.disease_agent = DiseaseAgent()
        self.environment_agent = EnvironmentAgent()
        self.feed_agent = FeedAgent()
        self.medicine_agent = MedicineAgent()
        self.safety_agent = SafetyAgent()
        self.symptom_agent = SymptomAgent()
        self.memory_agent = MemoryAgent()
        self.risk_agent = RiskAgent()
        self.localizer = LocalizationFormatter()

    def _normalize_symptoms(self, request: AnalyzeRequest) -> list[str]:
        parsed = [item.strip() for item in request.symptomChecklist if item.strip()]
        if request.symptoms.strip():
            parsed.extend(
                piece.strip()
                for piece in request.symptoms.replace("\n", ",").split(",")
                if piece.strip()
            )

        deduped: list[str] = []
        seen: set[str] = set()
        for item in parsed:
            key = item.lower()
            if key not in seen:
                seen.add(key)
                deduped.append(item)
        return deduped

    def _score_candidate(
        self,
        candidate: dict,
        vision: VisionResult,
        symptoms: list[str],
        memory_data: dict,
        knowledge: list[dict],
        environment_data: dict,
    ) -> tuple[float, list[str], list[str], list[str]]:
        disease = candidate.get("disease", "Unknown")
        candidate_symptoms = [item.lower() for item in candidate.get("symptoms", [])]
        normalized_symptoms = [item.lower() for item in symptoms]

        vision_score = 0.0
        if disease.lower().replace(" ", "_") == vision.primary_label.lower().replace(" ", "_"):
            vision_score = vision.primary_confidence
        elif any(match.label.lower().replace(" ", "_") == disease.lower().replace(" ", "_") for match in vision.top_matches):
            matching = next(
                (match.confidence for match in vision.top_matches if match.label.lower().replace(" ", "_") == disease.lower().replace(" ", "_")),
                0.0,
            )
            vision_score = matching

        symptom_overlap = [item for item in normalized_symptoms if item in candidate_symptoms]
        symptom_score = len(symptom_overlap) / max(len(candidate_symptoms), 1)

        history_score = 0.25
        if disease.lower() in str(memory_data.get("last_incident", "")).lower():
            history_score = 0.8
        elif memory_data.get("last_incident"):
            history_score = 0.45

        environment_warnings = (environment_data.get("recommendation") or {}).get("warnings", [])
        environment_score = 0.35
        if environment_warnings:
            environment_score = 0.6
            if "cocci" in disease.lower() and any("humidity" in warning.lower() for warning in environment_warnings):
                environment_score = 0.72

        knowledge_score = 0.25
        source_hits = []
        for item in knowledge:
            content = str(item.get("content", "")).lower()
            if disease.lower() in content:
                knowledge_score = max(knowledge_score, 0.7)
                source_hits.append(item.get("source", "knowledge-base"))

        confidence = (
            vision_score * 0.4 +
            symptom_score * 0.2 +
            environment_score * 0.1 +
            history_score * 0.1 +
            knowledge_score * 0.1 +
            0.7 * 0.1
        )

        supporting = []
        conflicting = []
        if vision_score:
            supporting.append(f"Vision model supports {disease} ({round(vision_score * 100)}%).")
        if symptom_overlap:
            supporting.append(f"Symptoms matched: {', '.join(symptom_overlap[:4])}.")
        if history_score >= 0.75:
            supporting.append("Farm history suggests a similar incident occurred before.")
        if knowledge_score >= 0.7:
            supporting.append("Knowledge retrieval found matching disease guidance.")
        if not symptom_overlap:
            conflicting.append("Symptom overlap is limited.")
        if not vision_score:
            conflicting.append("Vision evidence does not strongly support this disease.")

        return min(confidence, 0.97), supporting, conflicting, source_hits

    def _rank_to_label(self, score: float, mapping: list[tuple[float, str]], fallback: str) -> str:
        for threshold, label in mapping:
            if score >= threshold:
                return label
        return fallback

    def _build_risk(self, top_candidate: DifferentialDiagnosisItem, disease_record: dict, safety_status: str) -> RiskAssessment:
        severity_raw = str(disease_record.get("severity", "")).lower()
        severity = "high" if severity_raw in {"high", "severe"} or top_candidate.confidence >= 0.8 else "medium"
        spread_risk = self._rank_to_label(
            top_candidate.confidence,
            [(0.8, "high"), (0.6, "medium")],
            "low",
        )
        mortality_raw = str(disease_record.get("mortality_rate", "")).lower()
        mortality_risk = "high" if any(token in mortality_raw for token in ["high", "severe", "30", "40", "50"]) else "medium"
        urgency = "immediate" if safety_status == "block_and_escalate" or top_candidate.confidence >= 0.8 else "monitor_closely"
        return RiskAssessment(
            severity=severity,
            spread_risk=spread_risk,
            mortality_risk=mortality_risk,
            urgency=urgency,
        )

    def _build_actions(self, disease_record: dict, environment_plan: dict, top_disease: str) -> list[RecommendedAction]:
        actions = [
            RecommendedAction(
                title="Isolate visibly sick birds",
                reason="Reduce spread while the case is being confirmed.",
                priority="critical",
                category="quarantine",
            ),
            RecommendedAction(
                title="Review water, feed, and litter immediately",
                reason="Supportive care and house hygiene reduce secondary losses.",
                priority="high",
                category="operations",
            ),
        ]

        if environment_plan.get("ventilation"):
            actions.append(
                RecommendedAction(
                    title="Correct house ventilation",
                    reason=f"Environment plan recommends {environment_plan.get('ventilation')}.",
                    priority="high",
                    category="environment",
                )
            )

        treatment = disease_record.get("treatment") or []
        if treatment:
            actions.append(
                RecommendedAction(
                    title=f"Verify treatment plan for {top_disease}",
                    reason=f"Verified disease records mention: {', '.join(treatment[:2])}.",
                    priority="high",
                    category="treatment",
                )
            )

        return actions

    async def build(
        self,
        request: AnalyzeRequest,
        vision: VisionResult,
        disease_data: dict,
        medicine_data: dict,
        feed_data: dict,
        environment_data: dict,
        safety_data: dict,
        memory_data: dict,
        knowledge: list[dict],
    ) -> DecisionResult:
        symptoms = self._normalize_symptoms(request)
        disease_candidates = disease_data.get("items") or []
        if not disease_candidates and disease_data.get("match"):
            disease_candidates = [disease_data["match"]]

        ranked_candidates: list[DifferentialDiagnosisItem] = []
        for candidate in disease_candidates:
            confidence, supporting, conflicting, evidence_sources = self._score_candidate(
                candidate,
                vision,
                symptoms,
                memory_data,
                knowledge,
                environment_data,
            )
            ranked_candidates.append(
                DifferentialDiagnosisItem(
                    disease=candidate.get("disease", "Unknown"),
                    confidence=confidence,
                    rank=0,
                    supporting_factors=supporting,
                    conflicting_factors=conflicting,
                    evidence_sources=evidence_sources,
                )
            )

        if not ranked_candidates:
            ranked_candidates.append(
                DifferentialDiagnosisItem(
                    disease=vision.primary_label,
                    confidence=vision.primary_confidence,
                    rank=1,
                    supporting_factors=["Only vision evidence is currently available."],
                    conflicting_factors=["Verified disease retrieval did not find a close match."],
                    evidence_sources=[],
                )
            )

        ranked_candidates.sort(key=lambda item: item.confidence, reverse=True)
        ranked_candidates = ranked_candidates[:3]
        for index, candidate in enumerate(ranked_candidates, start=1):
            candidate.rank = index

        top_candidate = ranked_candidates[0]
        top_record = next(
            (item for item in disease_candidates if item.get("disease") == top_candidate.disease),
            disease_data.get("match") or {},
        )

        disease_finding = await self.disease_agent.run(vision, top_record, symptoms)
        symptom_finding = await self.symptom_agent.run(symptoms, top_record)
        environment_finding = await self.environment_agent.run(request, environment_data)
        feed_finding = await self.feed_agent.run(request, feed_data)
        medicine_finding = await self.medicine_agent.run(medicine_data, top_candidate.disease)
        memory_finding = await self.memory_agent.run(memory_data, top_candidate.disease)
        safety_finding = await self.safety_agent.run(safety_data, medicine_finding.payload, request.context.ageInDays)
        risk_finding = await self.risk_agent.run(
            {
                "disease": top_candidate.disease,
                "confidence": top_candidate.confidence,
                "spread_rate": top_record.get("spread_rate"),
                "mortality_rate": top_record.get("mortality_rate"),
            },
            environment_data,
            memory_data,
        )

        risk = self._build_risk(top_candidate, top_record, safety_finding.payload["status"])
        actions = self._build_actions(top_record, environment_finding.payload, top_candidate.disease)
        quarantine_steps = [
            "Keep sick birds in a separate area.",
            "Clean drinkers, feeders, and wet litter.",
            "Limit worker movement between healthy and sick flocks.",
        ]
        follow_up = [
            "How many birds are sick today?",
            "Have feed or water intake dropped since yesterday?",
            "Are there sudden deaths or twisted neck signs?",
        ]

        decision = DecisionResult(
            case_id=f"case_{uuid4().hex[:10]}",
            diagnosis_status="provisional" if top_candidate.confidence >= 0.45 else "needs_more_evidence",
            confidence=top_candidate.confidence,
            top_disease=top_candidate.disease,
            symptoms=symptoms,
            differential_diagnosis=ranked_candidates,
            risk=risk,
            recommended_actions=actions,
            quarantine_steps=quarantine_steps,
            follow_up_questions=follow_up if top_candidate.confidence < 0.7 else [],
            safety=SafetyAssessment(
                status=safety_finding.payload["status"],
                approved=safety_finding.payload["approved"],
                warnings=safety_finding.payload["flags"],
                withdrawal_period=(medicine_finding.payload or {}).get("withdrawal_period"),
            ),
            environment=environment_finding.payload,
            feed=feed_finding.payload,
            medicine=medicine_finding.payload,
            knowledge=knowledge,
            memory=memory_data,
            agent_findings=[
                disease_finding,
                symptom_finding,
                environment_finding,
                medicine_finding,
                feed_finding,
                memory_finding,
                risk_finding,
                safety_finding,
            ],
            vision=vision,
            localized_response={
                "language": request.language,
                "headline": "",
                "summary": "",
                "actions": [],
                "warnings": [],
            },
            source_trace={
                "vision_source": vision.source,
                "mcp_services": ["disease", "medicine", "feed", "environment", "safety", "memory"],
                "knowledge_hits": len(knowledge),
            },
        )
        decision.localized_response = await self.localizer.render(decision, request.language)
        return decision
