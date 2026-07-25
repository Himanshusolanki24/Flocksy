# Flocksy AI

Flocksy AI is a backend-first poultry intelligence platform that is being redesigned into a production-grade diagnostic and farm decision system.

## Workspace Layout

- `frontend `: existing Vite React client
- `backend`: Express + TypeScript application layer
- `ai-core`: FastAPI orchestration and agent layer
- `mcp-services`: verified data microservices
- `ml`: training pipeline for poultry disease vision model
- `rag`: document ingestion and retrieval preparation
- `database`: PostgreSQL schema
- `docs`: architecture and implementation blueprints

## Build Order

1. Run `./start-all.sh` to start all services locally, including `ai-core`, `backend`, the frontend, and all MCP services.
2. Ingest verified knowledge into the RAG store
3. Train and register the CNN model
4. Replace stub decision paths with production model endpoints

## Current State

This scaffold gives you:

- Auth, farm, dashboard, and diagnosis API routes
- FastAPI AI orchestrator with multi-agent response assembly
- Verified MCP services for disease, medicine, feed, environment, safety, and memory
- Database schema for core poultry workflows
- CNN training starter pipeline
- RAG ingestion pipeline

## Architecture Blueprint

The redesign plan for turning Flocksy into a real agricultural intelligence platform is documented here:

- [Production Architecture](./docs/flocksy-ai-architecture.md)
- [Implementation Roadmap](./docs/implementation-roadmap.md)

## Next Recommended Milestones

1. Replace chatbot-style diagnosis flows with case-based workflows
2. Extract a dedicated decision engine from `ai-core`
3. Connect S3 or Cloudinary for media uploads and explainability artifacts
4. Replace sample MCP JSON data with curated veterinary datasets
5. Upgrade the vision service to transfer-learning inference with Grad-CAM
