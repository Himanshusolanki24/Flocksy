from fastapi import FastAPI

from app.agents.orchestrator import Orchestrator
from app.schemas import AnalyzeRequest

app = FastAPI(title="Focksy AI Core", version="1.0.0")
orchestrator = Orchestrator()


@app.get("/health")
async def health() -> dict:
    return {
        "service": "focksy-ai-core",
        "status": "ok",
    }


@app.post("/analyze")
async def analyze(request: AnalyzeRequest) -> dict:
    recommendation = await orchestrator.run(request)
    return {
        "status": "completed",
        "result": recommendation.model_dump(),
    }
