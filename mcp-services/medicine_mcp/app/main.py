import json
from pathlib import Path

from fastapi import FastAPI

app = FastAPI(title="Medicine MCP")
data_path = Path(__file__).resolve().parent.parent / "data" / "medicines.json"
records = json.loads(data_path.read_text())


@app.get("/health")
async def health() -> dict:
    return {"service": "medicine-mcp", "status": "ok"}


@app.get("/recommend")
async def recommend(disease: str = "") -> dict:
    match = next(
        (
            item
            for item in records
            if any(disease.lower() in u.lower() for u in item.get("used_for", []))
        ),
        None,
    )
    return {"recommendation": match}
