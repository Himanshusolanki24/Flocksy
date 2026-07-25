import json
from pathlib import Path

from fastapi import FastAPI

app = FastAPI(title="Feed MCP")
data_path = Path(__file__).resolve().parent.parent / "data" / "feed_profiles.json"
profiles = json.loads(data_path.read_text())


@app.get("/health")
async def health() -> dict:
    return {"service": "feed-mcp", "status": "ok"}


@app.get("/recommend")
async def recommend(ageInDays: int = 0) -> dict:
    recommendation = next(
        (item for item in profiles if item["min_day"] <= ageInDays <= item["max_day"]),
        profiles[-1],
    )
    return {"recommendation": recommendation}
