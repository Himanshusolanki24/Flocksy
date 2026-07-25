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
    symptomChecklist: list[str] = Field(default_factory=list)
    language: str = "en"
    context: FarmContext
    mediaUrl: Optional[str] = None
    mediaBase64: Optional[str] = None
    mediaMimeType: Optional[str] = None


class VisionCandidate(BaseModel):
    label: str
    confidence: float = Field(ge=0.0, le=1.0)


class VisionResult(BaseModel):
    primary_label: str
    primary_confidence: float = Field(ge=0.0, le=1.0)
    source: str
    top_matches: list[VisionCandidate] = Field(default_factory=list)
    heatmap_url: Optional[str] = None
    lesion_regions: list[dict[str, Any]] = Field(default_factory=list)
    image_quality: str = "unknown"


class AgentFinding(BaseModel):
    agent: str
    claim: str
    score: float = Field(ge=0.0, le=1.0)
    evidence: list[str] = Field(default_factory=list)
    counter_evidence: list[str] = Field(default_factory=list)
    payload: dict[str, Any] = Field(default_factory=dict)


class DifferentialDiagnosisItem(BaseModel):
    disease: str
    confidence: float = Field(ge=0.0, le=1.0)
    rank: int
    supporting_factors: list[str] = Field(default_factory=list)
    conflicting_factors: list[str] = Field(default_factory=list)
    evidence_sources: list[str] = Field(default_factory=list)


class RecommendedAction(BaseModel):
    title: str
    reason: str
    priority: str
    category: str


class RiskAssessment(BaseModel):
    severity: str
    spread_risk: str
    mortality_risk: str
    urgency: str


class SafetyAssessment(BaseModel):
    status: str
    approved: bool
    warnings: list[str] = Field(default_factory=list)
    withdrawal_period: Optional[str] = None


class LocalizedResponse(BaseModel):
    language: str
    headline: str
    summary: str
    actions: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


class DecisionResult(BaseModel):
    case_id: str
    diagnosis_status: str
    confidence: float = Field(ge=0.0, le=1.0)
    top_disease: Optional[str] = None
    symptoms: list[str] = Field(default_factory=list)
    differential_diagnosis: list[DifferentialDiagnosisItem] = Field(default_factory=list)
    risk: RiskAssessment
    recommended_actions: list[RecommendedAction] = Field(default_factory=list)
    quarantine_steps: list[str] = Field(default_factory=list)
    follow_up_questions: list[str] = Field(default_factory=list)
    safety: SafetyAssessment
    environment: dict[str, Any] = Field(default_factory=dict)
    feed: dict[str, Any] = Field(default_factory=dict)
    medicine: dict[str, Any] = Field(default_factory=dict)
    knowledge: list[dict[str, Any]] = Field(default_factory=list)
    memory: dict[str, Any] = Field(default_factory=dict)
    agent_findings: list[AgentFinding] = Field(default_factory=list)
    vision: VisionResult
    localized_response: LocalizedResponse
    source_trace: dict[str, Any] = Field(default_factory=dict)
