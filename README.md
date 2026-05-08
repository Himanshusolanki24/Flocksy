# Focksy AI

Focksy AI is a backend-first, production-oriented poultry intelligence platform for disease detection, feed optimization, treatment guidance, and environmental recommendations.

## Workspace Layout

- `frontend `: existing Vite React client
- `backend`: Express + TypeScript application layer
- `ai-core`: FastAPI orchestration and agent layer
- `mcp-services`: verified data microservices
- `ml`: training pipeline for poultry disease vision model
- `rag`: document ingestion and retrieval preparation
- `database`: PostgreSQL schema

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

## Next Recommended Milestones

1. Add Prisma or Drizzle migrations on top of `database/schema.sql`
2. Connect S3 or Cloudinary for media uploads
3. Connect OpenAI or another LLM provider in `ai-core`
4. Replace sample MCP JSON data with curated veterinary datasets
5. Build the frontend upload and analytics views against these APIs
