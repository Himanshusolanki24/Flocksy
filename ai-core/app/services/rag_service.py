from __future__ import annotations

import json
from pathlib import Path

from app.schemas import AnalyzeRequest


class RAGService:
    def __init__(self) -> None:
        self.knowledge_path = Path(__file__).resolve().parent.parent / "data" / "knowledge_base.json"

    def _load(self) -> list[dict]:
        if not self.knowledge_path.exists():
            return []
        return json.loads(self.knowledge_path.read_text())

    async def retrieve(self, request: AnalyzeRequest) -> list[dict]:
        documents = self._load()
        query_terms = {term for term in request.symptoms.lower().split() if len(term) > 3}

        ranked: list[dict] = []
        for document in documents:
            score = sum(1 for term in query_terms if term in document["content"].lower())
            if score:
                ranked.append({**document, "score": score})

        ranked.sort(key=lambda item: item["score"], reverse=True)
        return ranked[:3]
