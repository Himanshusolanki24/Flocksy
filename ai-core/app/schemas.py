from typing import Any, Optional

from pydantic import BaseModel, Field


class FarmContext(BaseModel):
    farmId: str
    batchId: Optional[str] = None
    flockSize: Optional[int] = None
    ageInDays: Optional[int] = None
    temperatureC: Optional[float] = None
    humidityPercent: Optional[float] = None
    feedType: Optional[str] = None


class AnalyzeRequest(BaseModel):
    symptoms: str = ""
    context: FarmContext
    mediaUrl: Optional[str] = None
    mediaBase64: Optional[str] = None
    mediaMimeType: Optional[str] = None


class AgentInsight(BaseModel):
    agent: str
    summary: str
    confidence: float = Field(ge=0.0, le=1.0)
    payload: dict[str, Any] = Field(default_factory=dict)


class FinalRecommendation(BaseModel):
    details: str
    accuracy: float
    disease: dict[str, Any]
    medicine: dict[str, Any]
    feed_plan: dict[str, Any]
    environment: dict[str, Any]
    safety: dict[str, Any]
    knowledge: list[dict[str, Any]]
    memory: dict[str, Any]
    warnings: list[str]
    next_steps: list[str]
