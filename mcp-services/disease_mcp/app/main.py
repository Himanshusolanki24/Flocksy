import json
from pathlib import Path

from fastapi import FastAPI

app = FastAPI(title="Disease MCP")
data_path = Path(__file__).resolve().parent.parent / "data" / "diseases.json"
diseases = json.loads(data_path.read_text())


@app.get("/health")
async def health() -> dict:
    return {"service": "disease-mcp", "status": "ok"}


@app.get("/search")
async def search(query: str = "", symptoms: str = "") -> dict:
    combined = f"{query} {symptoms}".lower()
    match = next(
        (
            item
            for item in diseases
            if item["disease"].lower() in combined
            or any(symptom.lower() in combined for symptom in item["symptoms"])
        ),
        None,
    )
    return {"match": match, "items": diseases}
