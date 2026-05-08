from __future__ import annotations

from app.agents.disease_agent import DiseaseAgent
from app.agents.environment_agent import EnvironmentAgent
from app.agents.feed_agent import FeedAgent
from app.agents.medicine_agent import MedicineAgent
from app.agents.safety_agent import SafetyAgent
from app.clients.mcp_client import MCPClient
from app.core.config import settings
from app.schemas import AnalyzeRequest, FinalRecommendation
from app.services.llm_service import LLMService
from app.services.rag_service import RAGService
from app.services.vision_service import VisionService


class Orchestrator:
    def __init__(self) -> None:
        self.mcp = MCPClient()
        self.vision = VisionService()
        self.llm = LLMService()
        self.rag = RAGService()
        self.disease_agent = DiseaseAgent()
        self.feed_agent = FeedAgent()
        self.medicine_agent = MedicineAgent()
        self.environment_agent = EnvironmentAgent()
        self.safety_agent = SafetyAgent()

    async def run(self, request: AnalyzeRequest) -> FinalRecommendation:
        vision_result = await self.vision.predict(request)
        symptom_summary = await self.llm.summarize_symptoms(request)

        disease_data = await self.mcp.fetch(
            settings.disease_mcp_url,
            "/search",
            {"query": vision_result["label"], "symptoms": request.symptoms},
        )
        medicine_data = await self.mcp.fetch(
            settings.medicine_mcp_url,
            "/recommend",
            {"disease": ((disease_data or {}).get("match") or {}).get("disease", (vision_result or {}).get("label", "Unknown"))},
        )
        feed_data = await self.mcp.fetch(
            settings.feed_mcp_url,
            "/recommend",
            {"ageInDays": request.context.ageInDays or 0},
        )
        environment_data = await self.mcp.fetch(
            settings.environment_mcp_url,
            "/recommend",
            {
                "ageInDays": request.context.ageInDays or 0,
                "temperatureC": request.context.temperatureC or 0,
                "humidityPercent": request.context.humidityPercent or 0,
            },
        )
        match_data = (disease_data or {}).get("match") or {}
        disease_str = match_data.get("disease", (vision_result or {}).get("label", ""))

        safety_data = await self.mcp.post(
            settings.safety_mcp_url,
            "/validate",
            {
                "disease": disease_str or "",
                "medicine": medicine_data.get("recommendation") or {},
                "context": request.context.model_dump(),
            },
        )
        memory_data = await self.mcp.fetch(
            settings.memory_mcp_url,
            "/history",
            {"farmId": request.context.farmId},
        )
        knowledge = await self.rag.retrieve(request)

        disease_insight = await self.disease_agent.run(vision_result, disease_data, symptom_summary)
        medicine_insight = await self.medicine_agent.run(medicine_data)
        feed_insight = await self.feed_agent.run(request, feed_data)
        environment_insight = await self.environment_agent.run(environment_data)
        safety_insight = await self.safety_agent.run(safety_data, medicine_insight.payload)

        warnings = list(safety_insight.payload.get("flags", []))
        if disease_insight.confidence < 0.7:
            warnings.append("Confidence is moderate. Seek veterinary confirmation before treatment.")
            
        safety_warning = "CRITICAL SAFETY WARNING: Always consult a certified veterinarian before administering any medication, changing feed plans, or drastically altering environment parameters. The information provided is an AI-generated analysis based on available data and may contain inaccuracies."
        warnings.append(safety_warning)

        confidences = [disease_insight.confidence, medicine_insight.confidence, feed_insight.confidence, environment_insight.confidence, safety_insight.confidence]
        accuracy = sum(confidences) / len(confidences)

        details = (
            f"### ANALYSIS REPORT SUMMARY (Model Accuracy: {accuracy*100:.2f}%)\n\n"
            f"**1. Disease Assessment:** {disease_insight.summary}\n"
            f"*Safety Notice: Confirm the above diagnosis with clinical poultry pathology tests before starting treatment.*\n\n"
            f"**2. Treatment Strategy:** {medicine_insight.summary}\n"
            f"*Safety Notice: Verify all medication labels and dosage with a licensed professional. Do not ignore withdrawal periods.*\n\n"
            f"**3. Nutritional Strategy:** {feed_insight.summary}\n"
            f"*Safety Notice: Ensure feed is free from mold and toxins; contaminated feed can worsen flock health conditions.*\n\n"
            f"**4. Environmental Envelope:** {environment_insight.summary}\n"
            f"*Safety Notice: Maintain strict biosecurity at entry points to prevent secondary infections while adjusting house parameters.*\n\n"
            f"**5. Safety Compliance:** {safety_insight.summary}\n"
            f"*Safety Notice: If mortality rates exceed 1% per day, contact government agricultural services immediately.*"
        )

        return FinalRecommendation(
            details=details,
            accuracy=accuracy,
            disease=disease_insight.payload,
            medicine=medicine_insight.payload,
            feed_plan=feed_insight.payload,
            environment=environment_insight.payload,
            safety=safety_insight.payload,
            knowledge=knowledge,
            memory=memory_data,
            warnings=warnings,
            next_steps=[
                "Isolate visibly affected birds.",
                "Capture fresh stool, feed, and water observations for follow-up.",
                "Escalate to a veterinarian if mortality rises or birds stop eating.",
            ],
        )
