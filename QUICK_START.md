# Flocksy Quick Start Guide

## Local-first setup

This project runs as a local multi-service poultry intelligence workspace. No Docker is required.

### Services

| Service | URL |
|---|---|
| Frontend (Next.js) | `http://localhost:3000` |
| Backend (Express) | `http://localhost:8080` |
| AI Core (FastAPI) | `http://localhost:8000` |
| Disease MCP | `http://localhost:8101` |
| Medicine MCP | `http://localhost:8102` |
| Feed MCP | `http://localhost:8103` |
| Environment MCP | `http://localhost:8104` |
| Safety MCP | `http://localhost:8105` |
| Memory MCP | `http://localhost:8106` |

> If port 3000 is already taken, Next.js starts on the next free port and prints
> the real URL — check the `start-all.sh` output rather than assuming 3000.

## Prerequisites

- Node.js 18+
- Python 3.9 (the checked-in virtualenvs are built against 3.9)
- npm

Database and Redis URLs only need to be valid environment values for local development. The current backend boot flow does not require an active connection just to start the server.

## One-command startup

From the repo root:

```bash
cd Flocksy
cp backend/.env.example backend/.env
cp ai-core/.env.example ai-core/.env
./start-all.sh
```

`start-all.sh` installs dependencies, creates the Python virtualenvs if missing, and starts all nine services. Ctrl-C stops everything.

## Manual startup

### Backend

```bash
cd Flocksy/backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd Flocksy/frontend
npm install
npm run dev
```

The frontend defaults to `http://localhost:8080/api/v1` for the backend. To point
it elsewhere, set `NEXT_PUBLIC_API_URL` in `frontend/.env.local`.

### AI Core

```bash
cd Flocksy/ai-core
cp .env.example .env
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### MCP services

Run each MCP service in its own terminal if needed:

```bash
cd Flocksy/mcp-services/disease_mcp
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --port 8101
```

Repeat the same pattern for:

- `medicine_mcp` on `8102`
- `feed_mcp` on `8103`
- `environment_mcp` on `8104`
- `safety_mcp` on `8105`
- `memory_mcp` on `8106`

## Where to go in the UI

All app routes are locale-prefixed (`en` or `hi`):

- Landing page — `http://localhost:3000/en`
- Diagnosis workbench — `http://localhost:3000/en/diagnosis`
- AI assistant — `http://localhost:3000/en/assistant`
- Dashboard — `http://localhost:3000/en/dashboard`

Swap `/en` for `/hi` for the Hindi build of any page.

Diagnosis and the assistant both hit the same diagnosis case endpoint underneath, sending:

- symptoms
- farm context
- environment readings
- optional image upload

and returning:

- provisional diagnosis
- differential diagnosis ranking
- severity and urgency
- spread and mortality risk
- action steps
- safety warnings
- localized farmer response
- agent evidence trace

## Quick checks

```bash
curl http://localhost:8080/api/v1/health   # backend
curl http://localhost:8000/health          # ai-core
curl http://localhost:8101/health          # disease MCP (same path on 8102-8106)
```
