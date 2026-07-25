import json
from pathlib import Path

from fastapi import FastAPI

app = FastAPI(title="Memory MCP")
data_path = Path(__file__).resolve().parent.parent / "data" / "history.json"
history = json.loads(data_path.read_text())


@app.get("/health")
async def health() -> dict:
    return {"service": "memory-mcp", "status": "ok"}


@app.get("/history")
async def get_history(farmId: str) -> dict:
    return history.get(farmId, {"last_incident": None, "recommended_focus": None, "recent_treatments": []})
