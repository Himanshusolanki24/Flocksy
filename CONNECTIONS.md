# Flocksy — Frontend Connection Map

> Every place the frontend (`frontend/`) touches another part of the repo:
> backend, AI-core, ML, RAG, MCP services, database, and external/anthropic APIs.

---

## 1. Connection Overview (Diagram)

```
┌─────────────────────────── FRONTEND (React/Vite, port 5173) ───────────────────────────┐
│                                                                                         │
│  pages/Dashboard ──► store/dashboardStore.js (Zustand)                                   │
│  pages/Chatbot ──► src/api.js diagnosisApi                                              │
│  pages/Diagnosis ─► src/api.js diagnosisApi                                             │
│  pages/VetDirectory ► src/api.js vetApi                                                 │
│  components/Modals ► src/api.js authApi  (AuthModal►useAuth store)                      │
│  pages/CropAdvisor ► (direct) Anthropic Claude API  ⚠ bypasses backend                  │
└───────────────┬─────────────────────────┬───────────────────────┬──────────────────────┘
                │  1) REST /api/v1         │  2) reference img URLs │  4) external API
                ▼                          ▼                        ▼
        ┌───────────────────┐      ┌───────────────────┐      ┌─────────────────────┐
        │  BACKEND (Express) │◄─────│ ML DATASET        │      │ Anthropic (Claude)  │
        │  port 8080         │      │ ml/training/      │      │ api.anthropic.com   │
        └─────────┬─────────┘      │ dataset/test/      │      └─────────────────────┘
                  │  3) POST /analyze  (aiCoreClient)   └─────────  served back ─────────┘
                  ▼
        ┌───────────────────┐
        │  AI-CORE (FastAPI) │  port 8000
        └─────────┬─────────┘
                  │  5) MCP HTTP calls
        ┌─────────▼───────────────────────────────────────────────┐
        │  MCP SERVICES (FastAPI, ports 8101–8106)                │
        │   disease:8101  medicine:8102  feed:8103               │
        │   environment:8104  safety:8105  memory:8106           │
        └─────────────────────────────────────────────────────────┘
                  │  6) loads model                 7) reads knowledge base
                  ▼
        ┌───────────────────┐          ┌───────────────────┐
        │  ML MODEL         │          │  RAG              │
        │  ml/training/     │          │  ai-core/.../     │
        │  *.pt (CNN)       │          │  knowledge_base.json│
        └───────────────────┘          └───────────────────┘
```

---

## 2. Connection #1 — Frontend → Backend (REST / HTTP)

**Transport:** HTTP `fetch` through `frontend/src/api.js`.
**Base URL:** `import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'`.
**Auth:** JWT stored in `localStorage` (key `token`); `api.js` attaches `Authorization: Bearer <token>`.

| Frontend caller file(s) | API function | HTTP call | Backend route (handler) | Backend service |
|---|---|---|---|---|
| `components/Modals.jsx` (AuthModal) → `src/store/useAuth.js` `login` | `authApi.login` | `POST /api/v1/auth/login` | `backend/src/routes/auth.ts` | `authService.login` (bcrypt + JWT) |
| `src/store/useAuth.js` `register` | `authApi.register` | `POST /api/v1/auth/register` | `backend/src/routes/auth.ts` | `authService.register` |
| `src/store/useAuth.js` `checkAuth` | `authApi.getProfile` | `GET /api/v1/users/profile` | `backend/src/routes/users.ts` | — (returns demo user + `activeFarmId`) |
| `store/dashboardStore.js` `fetchSummary` | `dashboardApi.getSummary` | `GET /api/v1/dashboard/summary` | `backend/src/routes/dashboard.ts` | `dashboardService.getSummary` (mock data) |
| `pages/Chatbot.jsx` | `diagnosisApi.sendChatQuery` | `POST /api/v1/diagnosis/chat` | `backend/src/routes/diagnosis.ts` | → `aiCoreClient.analyze` |
| `pages/Chatbot.jsx` / `pages/Diagnosis.jsx` | `diagnosisApi.createCase` ⚠ | `POST /api/v1/diagnosis/cases` | `backend/src/routes/diagnosis.ts` | → `storageService.upload` + `aiCoreClient.analyze` |
| `pages/Chatbot.jsx` | `diagnosisApi.uploadImage` | `POST /api/v1/diagnosis/upload` | `backend/src/routes/diagnosis.ts` | → `aiCoreClient.analyze` |
| `pages/VetDirectory.jsx` | `vetApi.listVets` | `GET /api/v1/vets` | `backend/src/routes/vets.ts` | — (mock array) |
| `pages/VetDirectory.jsx` | `vetApi.getVetDetails` | `GET /api/v1/vets/:id` | `backend/src/routes/vets.ts` | — (mock array) |

### ⚠ Anomalies found in the connection layer
- **`diagnosisApi.createCase` does not exist** in `frontend/src/api.js`. Only `uploadImage` and `sendChatQuery` are exported, yet `Chatbot.jsx` and `Diagnosis.jsx` both call `diagnosisApi.createCase(...)` → will throw at runtime. The intended backend target is `POST /api/v1/diagnosis/cases`.
- **`sendChatQuery` signature mismatch:** `api.js` defines `sendChatQuery(query, lang)` but `Chatbot.jsx` calls it as `sendChatQuery({ query, ...diagnosisContext })` (one object arg).
- Routes `diagnosisRouter.post('/cases'|'/analyze'|'/upload')` all map to the **same `createCase` handler** — only `/chat` differs.

### Backend middleware / plumbing used by these routes
- `backend/src/middleware/auth.ts` `requireAuth` guards `/users/profile` and `/farms/*`.
- `backend/src/services/db.ts`: `pgPool` (Postgres, `DATABASE_URL`) and `redis` (`REDIS_URL`) are created but **not actually queried** by current routes (they return mock/in-memory data). Schema at `backend/database/schema.sql`.

---

## 3. Connection #2 — Backend → Frontend (Reference Images)

When a diagnosis completes, the backend picks up to 4 sample images from the **ML image dataset** and returns public URLs served by the backend itself:

- Backend source: `backend/src/routes/diagnosis.ts` (`getReferenceImages`)
- Dataset path: `ml/training/dataset/test/<DiseaseFolder>/` (Newcastle_Disease, Coccidiosis, Salmonella, Healthy)
- Image URL returned to frontend:
  `GET http://localhost:8080/api/v1/diagnosis/dataset-image/{folder}/{filename}`
  (handler: same file, allows only whitelisted folders + image extensions)
- **Frontend consumer:** `pages/Chatbot.jsx` (`message.images`) and `components/diagnosis/CaseResultPanel.jsx` (`decision.referenceImages`).

> Note: the `dataset/test` folder does not exist in the current tree (only `ml/training/artifacts-*/*.pt` exist). The route degrades to `[]` when files are missing.

---

## 4. Connection #3 — Backend → AI-Core

- File: `backend/src/services/aiCoreClient.ts`
- Uses `axios` with `baseURL = env.AI_CORE_URL` (from `backend/.env`, expected `http://localhost:8000`).
- Endpoint called: `POST {AI_CORE_URL}/analyze` — payload is the diagnosis `DiagnosisRequestPayload` (symptoms, symptomChecklist, language, context, mediaUrl/mediaBase64/mimeType).
- **AI-Core listener:** `ai-core/app/main.py` `@app.post("/analyze")` (and `/analyze-case`) → runs `Orchestrator.run()`.

---

## 5. Connection #4 — Frontend → External AI (Anthropic, direct-browser ⚠)

- File: `frontend/pages/CropAdvisor.jsx` `handleAnalyze`
- Calls **directly** from the browser to `https://api.anthropic.com/v1/messages` (model `claude-3-5-sonnet-...`) — **bypasses the Flocksy backend entirely**.
- Headers include a placeholder `x-api-key: 'YOUR_API_KEY_HERE'` and `anthropic-dangerously-allow-browser: 'true'`.
- On failure it shows a hardcoded demo fallback result.
- **Security risk:** exposing an Anthropic key in the browser. Should be proxied through the backend.

---

## 6. Connection #5 — AI-Core → MCP Services

`ai-core/app/agents/orchestrator.py` calls each MCP microservice via `MCPClient` (`httpx`). URLs configured in `ai-core/app/core/config.py`. All started by `start-all.sh`.

| MCP service (`mcp-services/`) | Port | Endpoint | Called with | Data file |
|---|---|---|---|---|
| `disease_mcp` | 8101 | `GET /search` | `query` (vision label), `symptoms` | `data/diseases.json` |
| `medicine_mcp` | 8102 | `GET /recommend` | `disease` | `data/medicines.json` |
| `feed_mcp` | 8103 | `GET /recommend` | `ageInDays` | `data/feed_profiles.json` |
| `environment_mcp` | 8104 | `GET /recommend` | `ageInDays`, `temperatureC`, `humidityPercent` | `data/environment_profiles.json` |
| `safety_mcp` | 8105 | `POST /validate` | `disease`, `medicine`, `context` | `data/rules.json` |
| `memory_mcp` | 8106 | `GET /history` | `farmId` | `data/history.json` |

The decision is then assembled by `ai-core/app/decision_engine/engine.py` into the response the backend forwards to the frontend.

---

## 7. Connection #6 — AI-Core → ML Model (CNN Vision)

- File: `ai-core/app/services/vision_service.py`
- Loads a trained PyTorch disease CNN checkpoint.
- Model path (`ai-core/app/core/config.py` → `vision_model_path`):
  `../ml/training/artifacts-cpu-real/best_poultry_disease_cnn.pt`
- Trained by `ml/training/train_disease_cnn.py`; artifact variants in:
  `ml/training/artifacts-baseline/`, `artifacts-cpu-real/`, `artifacts-smoke/`, `artifacts-smoke-balanced/` (each with `best_poultry_disease_cnn.pt` + `metrics.json`).
- If no image / model missing, `VisionService._fallback_prediction` classifies from symptom text (Coccidiosis / Newcastle_Disease / Healthy).
- **Input images flow:** frontend uploads `media` → backend `storageService.upload` (base64) → `aiCoreClient.analyze` → AI-core `mediaBase64` → `VisionService.predict`.

---

## 8. Connection #7 — AI-Core → RAG

- File: `ai-core/app/services/rag_service.py`
- Loads `ai-core/app/data/knowledge_base.json` (list of `{title, content}` docs), scores documents against free-text symptoms, returns top ≤3 ranked chunks to the decision engine.
- **`rag/` folder** is the ingest side: `rag/scripts/ingest_documents.py` processes PDFs in `rag/data/raw/` (poultry/livestock manuals) — presumably used to build/extend the knowledge base JSON.

---

## 9. Data-flow chain for a full diagnosis (front-end perspective)

```
User (UI) ──► pages/Diagnosis or Chatbot
   └► src/api.js
        └► POST /api/v1/diagnosis/cases (image)  |  POST /api/v1/diagnosis/chat (text)
              [backend/src/routes/diagnosis.ts]
                 ├► storageService.upload (media → base64)
                 └► aiCoreClient.analyze ─► POST :8000/analyze
                        [ai-core/app/main.py → Orchestrator.run]
                            ├► VisionService  ─► ML CNN (*.pt)
                            ├► MCP disease :8101 / medicine :8102 / feed :8103 /
                            │   environment :8104 / safety :8105 / memory :8106
                            ├► RAGService     ─► knowledge_base.json
                            └► DecisionEngine ─► result payload
              └► resolve dataset image URLs ─► ml/training/dataset/test/
                                      │
                       result (JSON) ◄┘ back to frontend
```

---

## 10. Services / Ports (start-all.sh)

| Service | Working dir | Command port |
|---|---|---|
| Backend | `backend/` (`npm run dev`) | **8080** |
| Frontend | `frontend/` (`npm run dev`) | **5173** |
| AI-Core | `ai-core/` (`uvicorn app.main:app`) | **8000** |
| disease_mcp | `mcp-services/disease_mcp` | **8101** |
| medicine_mcp | `mcp-services/medicine_mcp` | **8102** |
| feed_mcp | `mcp-services/feed_mcp` | **8103** |
| environment_mcp | `mcp-services/environment_mcp` | **8104** |
| safety_mcp | `mcp-services/safety_mcp` | **8105** |
| memory_mcp | `mcp-services/memory_mcp` | **8106** |
| Postgres / Redis | via `DATABASE_URL` / `REDIS_URL` in `backend/.env` | (external services) |

---

## 11. Summary of every folder the frontend connects to

| Folder | How the frontend connects | Direction |
|---|---|---|
| **`backend/`** | REST `/api/v1/*` via `src/api.js` (auth, dashboard, diagnosis, vets); backend also serves diagnosis reference images back | Frontend ⇄ Backend |
| **`ai-core/`** | Only **indirectly** — through the backend's `aiCoreClient` (`POST /analyze`). Frontend never calls AI-core directly | Frontend → Backend → AI-core |
| **`ml/`** | **Indirectly** — backend serves `ml/training/dataset/test/*` images as reference images; AI-core loads `ml/training/artifacts-*/.*.pt` for vision. No direct frontend→ML call | via Backend & AI-core |
| **`mcp-services/`** | **Indirectly** — only touched by AI-core's orchestrator. No frontend involvement | AI-core only |
| **`rag/`** | **Indirectly** — `rag/scripts` build the knowledge base that AI-core's RAGService reads. No direct frontend call | via AI-core |
| **External (Anthropic)** | **Directly** from `pages/CropAdvisor.jsx` (bypasses backend) ⚠ | Frontend → Anthropic |