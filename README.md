# Flocksy AI

Flocksy AI is a backend-first poultry intelligence platform that is being redesigned into a production-grade diagnostic and farm decision system.

## Project Directory Tree

```
flocksy/
├── ai-core/                          # FastAPI orchestration and multi-agent AI service
│   ├── app/
│   │   ├── agents/                   # Specialized AI agents
│   │   │   ├── disease_agent.py      # Disease diagnostic agent
│   │   │   ├── environment_agent.py  # Environment analysis agent
│   │   │   ├── feed_agent.py         # Feed & nutrition agent
│   │   │   ├── medicine_agent.py     # Medicine & dosage agent
│   │   │   ├── memory_agent.py       # Historical farm memory agent
│   │   │   ├── orchestrator.py       # Multi-agent coordinator
│   │   │   ├── risk_agent.py         # Farm risk calculation agent
│   │   │   ├── safety_agent.py       # Safety and contraindication checks
│   │   │   └── symptom_agent.py      # Symptom analysis agent
│   │   ├── clients/
│   │   │   └── mcp_client.py         # HTTP client for MCP microservices
│   │   ├── core/
│   │   │   └── config.py             # Configuration settings
│   │   ├── data/
│   │   │   └── knowledge_base.json   # Local domain knowledge base
│   │   ├── decision_engine/
│   │   │   └── engine.py             # Core deterministic decision engine
│   │   ├── localization/             # Multi-lingual & vernacular support
│   │   │   ├── formatter.py
│   │   │   └── rural_hindi_formatter.py
│   │   ├── services/
│   │   │   ├── llm_service.py        # LLM integration service
│   │   │   ├── rag_service.py        # Vector / RAG retrieval service
│   │   │   └── vision_service.py     # CNN vision model inference
│   │   ├── main.py                   # FastAPI application entrypoint
│   │   └── schemas.py                # Pydantic request/response models
│   ├── .env.example
│   └── requirements.txt
├── backend/                          # Express + TypeScript core REST API backend
│   ├── database/
│   │   └── schema.sql                # PostgreSQL relational database schema
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts                # Environment configurations
│   │   ├── lib/
│   │   │   └── logger.ts             # Logging utility
│   │   ├── middleware/
│   │   │   └── auth.ts               # JWT authentication middleware
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.ts               # Auth & registration endpoints
│   │   │   ├── dashboard.ts          # Farm dashboard metrics endpoints
│   │   │   ├── diagnosis.ts          # Multi-modal diagnosis endpoints
│   │   │   ├── farms.ts              # Farm management endpoints
│   │   │   ├── health.ts             # Health check endpoint
│   │   │   ├── users.ts              # User profile endpoints
│   │   │   └── vets.ts               # Tele-vet booking & contact endpoints
│   │   ├── services/
│   │   │   ├── aiCoreClient.ts       # AI-Core integration client
│   │   │   ├── authService.ts        # Authentication business logic
│   │   │   ├── dashboardService.ts   # Metrics aggregator logic
│   │   │   ├── db.ts                 # Database connection pool
│   │   │   └── storageService.ts     # File / image storage handling
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript type definitions
│   │   ├── app.ts                    # Express application setup
│   │   └── server.ts                 # HTTP server entrypoint
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/                         # Next.js 15 App Router frontend (React 19, TailwindCSS)
│   ├── messages/                     # Localization message bundles
│   │   ├── en.json                   # English translations
│   │   └── hi.json                   # Hindi translations
│   ├── public/                       # Static public assets & icons
│   │   ├── icons/
│   │   └── images/
│   ├── src/
│   │   ├── app/                      # App router directory
│   │   │   ├── [locale]/             # Internationalized route wrapper
│   │   │   │   ├── (app)/            # Authenticated application views
│   │   │   │   │   ├── analytics/
│   │   │   │   │   ├── assistant/
│   │   │   │   │   ├── community/
│   │   │   │   │   ├── crop-advisor/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── diagnosis/
│   │   │   │   │   ├── feed/
│   │   │   │   │   ├── finance/
│   │   │   │   │   ├── inventory/
│   │   │   │   │   ├── learning/
│   │   │   │   │   ├── marketplace/
│   │   │   │   │   ├── medicine/
│   │   │   │   │   ├── notifications/
│   │   │   │   │   ├── profile/
│   │   │   │   │   ├── reports/
│   │   │   │   │   ├── schemes/
│   │   │   │   │   ├── settings/
│   │   │   │   │   ├── vaccination/
│   │   │   │   │   ├── vets/
│   │   │   │   │   ├── weather/
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── (auth)/           # Authentication pages (login/register)
│   │   │   │   ├── (marketing)/      # Landing & marketing pages
│   │   │   │   └── layout.tsx
│   │   │   ├── favicon.ico
│   │   │   └── globals.css
│   │   ├── components/               # Reusable UI & shared components
│   │   │   ├── charts/               # Chart visualizations
│   │   │   ├── shared/               # Shell, navigation, sidebar, headers
│   │   │   └── ui/                   # Radix UI / shadcn style atomic components
│   │   ├── config/                   # Site and navigation configurations
│   │   ├── constants/                # Global constants
│   │   ├── features/                 # Modular feature view implementations
│   │   ├── hooks/                    # Custom React hooks (camera, voice, debounce, etc.)
│   │   ├── i18n/                     # Next-intl configuration & routing
│   │   ├── lib/                      # Utilities, fonts, dates, query helpers
│   │   ├── middleware.ts             # Internationalization & routing middleware
│   │   ├── providers/                # Theme, React Query, and online status providers
│   │   ├── services/                 # API service clients
│   │   ├── store/                    # Zustand state management stores
│   │   └── types/                    # Frontend TypeScript types
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
├── mcp-services/                     # Verified Domain Microservices (FastAPI / JSON datasets)
│   ├── disease_mcp/                  # Poultry disease reference dataset & service
│   ├── environment_mcp/              # Environmental safety guidelines service
│   ├── feed_mcp/                     # Feed formulas & nutrition service
│   ├── medicine_mcp/                 # Veterinary medicine dosages service
│   ├── memory_mcp/                   # Farm case history & memory service
│   └── safety_mcp/                   # Safety & drug contraindication service
├── ml/                               # Machine Learning & Computer Vision
│   └── training/                     # Disease classification CNN training scripts & checkpoints
│       ├── artifacts-baseline/
│       ├── artifacts-cpu-real/
│       ├── artifacts-smoke/
│       ├── artifacts-smoke-balanced/
│       ├── train_disease_cnn.py      # PyTorch CNN training pipeline
│       └── README.md
├── rag/                              # Retrieval-Augmented Generation
│   ├── data/
│   │   ├── raw/                      # Raw poultry manuals & reference PDFs
│   │   └── processed/                # Chunked & processed text datasets
│   └── scripts/
│       └── ingest_documents.py       # Document extraction & embedding pipeline
├── charts/                           # Generated analytical charts & infographics
├── docs/                             # Architecture blueprints & roadmaps
│   ├── flocksy-ai-architecture.md
│   ├── implementation-roadmap.md
│   └── landing-design.md
├── CLAUDE.md                         # Development commands & guidelines
├── QUICK_START.md                    # Quick startup guide
├── README.md                         # Project overview and documentation
├── TESTING.md                        # Testing suite documentation
├── download_dataset.sh               # Kaggle dataset download helper
├── start-all.sh                      # Script to spin up all microservices locally
├── test-api.sh                       # End-to-end API test script
└── upload_to_kaggle.py               # Kaggle model upload script
```

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
