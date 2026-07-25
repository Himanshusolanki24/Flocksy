from __future__ import annotations

from app.clients.mcp_client import MCPClient
from app.core.config import settings
from app.decision_engine.engine import DecisionEngine
from app.schemas import AnalyzeRequest, DecisionResult
from app.services.rag_service import RAGService
from app.services.vision_service import VisionService


class Orchestrator:
    def __init__(self) -> None:
        self.mcp = MCPClient()
        self.vision = VisionService()
        self.rag = RAGService()
        self.engine = DecisionEngine()

    async def run(self, request: AnalyzeRequest) -> DecisionResult:
        vision_result = await self.vision.predict(request)

        disease_data = await self.mcp.fetch(
            settings.disease_mcp_url,
            "/search",
            {
                "query": vision_result.primary_label,
                "symptoms": ", ".join(request.symptomChecklist) or request.symptoms,
            },
        )

        disease_name = ((disease_data or {}).get("match") or {}).get("disease", vision_result.primary_label)
        medicine_data = await self.mcp.fetch(
            settings.medicine_mcp_url,
            "/recommend",
            {"disease": disease_name},
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
        safety_data = await self.mcp.post(
            settings.safety_mcp_url,
            "/validate",
            {
                "disease": disease_name,
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

        return await self.engine.build(
            request=request,
            vision=vision_result,
            disease_data=disease_data,
            medicine_data=medicine_data,
            feed_data=feed_data,
            environment_data=environment_data,
            safety_data=safety_data,
            memory_data=memory_data,
            knowledge=knowledge,
        )
