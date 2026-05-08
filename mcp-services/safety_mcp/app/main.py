import json
from pathlib import Path

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Safety MCP")
data_path = Path(__file__).resolve().parent.parent / "data" / "rules.json"
rules = json.loads(data_path.read_text())


class ValidationRequest(BaseModel):
    disease: str
    medicine: dict
    context: dict


@app.get("/health")
async def health() -> dict:
    return {"service": "safety-mcp", "status": "ok"}


@app.post("/validate")
async def validate(payload: ValidationRequest) -> dict:
    flags = [
        rule["warning"]
        for rule in rules
        if rule["match"].lower() in payload.disease.lower()
        or rule["match"].lower() in str(payload.medicine).lower()
    ]

    age = payload.context.get("ageInDays")
    if age is not None and age < 7:
        flags.append("Very young flock: confirm dosage and hydration with a veterinarian.")

    return {"flags": flags}
