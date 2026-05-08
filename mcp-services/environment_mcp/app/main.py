import json
from pathlib import Path

from fastapi import FastAPI

app = FastAPI(title="Environment MCP")
data_path = Path(__file__).resolve().parent.parent / "data" / "environment_profiles.json"
profiles = json.loads(data_path.read_text())


@app.get("/health")
async def health() -> dict:
    return {"service": "environment-mcp", "status": "ok"}


@app.get("/recommend")
async def recommend(ageInDays: int = 0, temperatureC: float = 0, humidityPercent: float = 0) -> dict:
    target = next((item for item in profiles if item["min_day"] <= ageInDays <= item["max_day"]), profiles[-1])
    warnings = []
    if temperatureC and ageInDays <= 14 and temperatureC < 30:
        warnings.append("Temperature is below brooding range for young chicks.")
    if humidityPercent and humidityPercent > 75:
        warnings.append("Humidity is elevated; review litter and ventilation.")
    return {"recommendation": {**target, "warnings": warnings}}
