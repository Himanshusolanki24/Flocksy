from __future__ import annotations

from typing import Any, Optional

import httpx


class MCPClient:
    def __init__(self, timeout: float = 8.0) -> None:
        self.timeout = timeout

    async def fetch(self, base_url: str, path: str, params: Optional[dict[str, Any]] = None) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(f"{base_url}{path}", params=params)
            response.raise_for_status()
            return response.json()

    async def post(self, base_url: str, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(f"{base_url}{path}", json=payload)
            response.raise_for_status()
            return response.json()
