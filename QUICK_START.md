# Flocksy Quick Start Guide

## Local-first setup

This project now runs as a local multi-service poultry intelligence workspace. No Docker is required.

### Services

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- AI Core: `http://localhost:8000`
- Disease MCP: `http://localhost:8101`
- Medicine MCP: `http://localhost:8102`
- Feed MCP: `http://localhost:8103`
- Environment MCP: `http://localhost:8104`
- Safety MCP: `http://localhost:8105`
- Memory MCP: `http://localhost:8106`

## Prerequisites

- Node.js 18+
- Python 3.10+
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

## What changed

The project now has both:

- `AI Chatbot` at `http://localhost:5173/chatbot`
- `Diagnosis` at `http://localhost:5173/diagnosis`

Both pages use the same diagnosis case endpoint underneath.

- symptoms
- farm context
- environment readings
- optional image upload

The UI now returns:

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
curl http://localhost:8080/api/v1/health
curl http://localhost:8000/health
curl http://localhost:8101/health
```

Then open either:

- `http://localhost:5173/chatbot`
- `http://localhost:5173/diagnosis`
