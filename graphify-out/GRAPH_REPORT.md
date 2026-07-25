# Graph Report - Flocksy  (2026-06-18)

## Corpus Check
- 112 files · ~40,599 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 701 nodes · 1068 edges · 52 communities (48 shown, 4 thin omitted)
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 215 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cbfb1318`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]

## God Nodes (most connected - your core abstractions)
1. `AnalyzeRequest` - 31 edges
2. `DecisionEngine` - 28 edges
3. `AgentFinding` - 21 edges
4. `Flocksy AI Production Architecture` - 20 edges
5. `VisionResult` - 19 edges
6. `AnalyzeRequest` - 18 edges
7. `VisionResult` - 18 edges
8. `DifferentialDiagnosisItem` - 18 edges
9. `DecisionResult` - 18 edges
10. `RiskAssessment` - 17 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `Orchestrator`  [INFERRED]
  test_ai_core.py → ai-core/app/agents/orchestrator.py
- `AnalyzeRequest` --uses--> `AnalyzeRequest`  [INFERRED]
  ai-core/app/services/rag_service.py → ai-core/app/schemas.py
- `AgentFinding` --uses--> `AgentFinding`  [INFERRED]
  ai-core/app/agents/medicine_agent.py → ai-core/app/schemas.py
- `AgentFinding` --uses--> `AgentFinding`  [INFERRED]
  ai-core/app/agents/memory_agent.py → ai-core/app/schemas.py
- `Orchestrator` --uses--> `AnalyzeRequest`  [INFERRED]
  ai-core/app/agents/orchestrator.py → ai-core/app/schemas.py

## Import Cycles
- None detected.

## Communities (52 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (48): DiseaseAgent, EnvironmentAgent, FeedAgent, MedicineAgent, MemoryAgent, RiskAgent, SafetyAgent, SymptomAgent (+40 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (36): Logo(), AppointmentModal(), AuthModal(), states, Preloader(), Sidebar(), CaseIntakeForm(), symptomOptions (+28 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (42): Authentication Flow, Backend Changes, Backend Configuration, Backend Deployment, Backend Performance, Backend Security, Backend Testing, Before Marking Complete (+34 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (41): 1. Frontend API Client (`Flocksy/frontend /src/api.js`), 2. Frontend Environment Configuration, 3. Dashboard Store (`Flocksy/frontend /store/dashboardStore.js`), 4. Backend Dashboard Service (`Flocksy/backend/src/services/dashboardService.ts`), 5. Backend TypeScript Types (`Flocksy/backend/src/types/index.ts`), 6. Documentation, 📚 Additional Resources, 📝 API Endpoints Summary (+33 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (33): dependencies, axios, bcryptjs, cors, dotenv, express, helmet, ioredis (+25 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (32): 1. Start Backend, 2. Start Frontend, 3. Test Health Check, 4. Test Login, 5. Open Frontend, AI Core Integration, Authentication Errors, Authentication Flow (+24 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (32): dependencies, date-fns, framer-motion, gsap, lucide-react, react, react-dom, react-hot-toast (+24 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (13): translations, translations, translations, translations, birdData, statusConfig, translations, actions (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (15): DashboardHeader(), WeeklyTrendChart(), HealthAlertsPanel(), severityConfig, colorMap, StatsRow(), FarmBalanceDonut(), ACTIONS (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (8): Orchestrator, AnalyzeRequest, AnalyzeRequest, Any, analyze(), analyze_case(), MCPClient, RAGService

### Community 10 - "Community 10"
Cohesion: 0.23
Nodes (8): AnalyzeRequest, Path, Tensor, VisionResult, VisionCandidate, Image, PoultryCNN, VisionService

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (5): Footer(), footerLinks, LeafIcon(), MenuIcon(), XIcon()

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (17): 1. Authentication (`/auth`), 2. Dashboard (`/dashboard`), 3. Diagnosis (`/diagnosis`), 4. Veterinarians (`/vets`), 5. Users (`/users`), 6. Health Check (`/health`), API Endpoints, GET `/dashboard/summary` (+9 more)

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (10): DataLoader, Dataset, Namespace, Path, Tensor, Module, evaluate(), PoultryCNN (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.17
Nodes (15): caseSchema, caseStore, chatSchema, contextSchema, createCase(), datasetFolderByDisease, datasetRoot, getDatasetFolder() (+7 more)

### Community 15 - "Community 15"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, outDir, resolveJsonModule, rootDir (+5 more)

### Community 16 - "Community 16"
Cohesion: 0.16
Nodes (11): dashboardRouter, dashboardService, Activity, ChartSegment, DashboardSummary, DiagnosisCaseRecord, FarmContext, HealthAlert (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.15
Nodes (12): AI Core, Backend, Flocksy Quick Start Guide, Frontend, Local-first setup, Manual startup, MCP services, One-command startup (+4 more)

### Community 18 - "Community 18"
Cohesion: 0.25
Nodes (6): logger, diagnosisRouter, healthRouter, vetRouter, vets, app

### Community 19 - "Community 19"
Cohesion: 0.24
Nodes (7): env, envSchema, aiCoreClient, client, pgPool, redis, DiagnosisRequestPayload

### Community 20 - "Community 20"
Cohesion: 0.20
Nodes (10): 15. API Design, AI Core API, Backend API, `GET /api/v1/diagnosis/cases/:id`, `GET /api/v1/farms/:farmId/memory`, `POST /analyze-case`, `POST /api/v1/diagnosis/cases`, `POST /api/v1/diagnosis/cases/:id/review` (+2 more)

### Community 21 - "Community 21"
Cohesion: 0.20
Nodes (9): Flocksy AI Implementation Roadmap, Phase 1: Foundation Refactor, Phase 2: Decision Engine, Phase 3: Vision + Explainability, Phase 4: Verified Knowledge Plane, Phase 5: Farm Intelligence, Phase 6: Human-in-the-Loop, Phase 7: Productionization (+1 more)

### Community 22 - "Community 22"
Cohesion: 0.22
Nodes (8): 17. Observability, 18. Recommended Refactor Order, 19. Immediate Codebase Recommendations, 1. Current State Analysis, 2. Target System Identity, 3. Recommended Production Folder Structure, 8. Visual Explainability, Flocksy AI Production Architecture

### Community 23 - "Community 23"
Cohesion: 0.36
Nodes (5): Request, requireAuth(), farmRouter, userRouter, AuthenticatedRequestUser

### Community 24 - "Community 24"
Cohesion: 0.46
Nodes (7): Namespace, Path, clear_output(), collect_files(), normalize_label(), prepare_dataset(), split_counts()

### Community 25 - "Community 25"
Cohesion: 0.29
Nodes (7): 9. MCP Microservices, Disease MCP, Environment MCP, Feed MCP, Medicine MCP, Memory MCP, Safety MCP

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (6): Architecture Blueprint, Build Order, Current State, Flocksy AI, Next Recommended Milestones, Workspace Layout

### Community 27 - "Community 27"
Cohesion: 0.33
Nodes (5): authRouter, loginSchema, registerSchema, authService, demoUser

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (6): 16. Deployment Strategy, AI Core, Backend, CI/CD, Frontend, Storage

### Community 29 - "Community 29"
Cohesion: 0.33
Nodes (6): 5. Decision Engine, Confidence Fusion, Inputs, Output Contract, Responsibilities, Suggested Internal Pipeline

### Community 30 - "Community 30"
Cohesion: 0.67
Nodes (5): Path, chunk_text(), extract_pdf_text(), ingest(), read_document()

### Community 31 - "Community 31"
Cohesion: 0.40
Nodes (5): 4. Production Architecture, AI Core, Backend, Frontend, MCP Layer

### Community 32 - "Community 32"
Cohesion: 0.40
Nodes (4): Poultry Disease CNN Training, Prepare Splits, Raw Dataset, Train

### Community 34 - "Community 34"
Cohesion: 0.50
Nodes (4): 10. RAG System, RAG Output Contract, Retrieval Design, Source Priority

### Community 35 - "Community 35"
Cohesion: 0.50
Nodes (4): 13. Localization Layer, Example Farmer Output, Modules, Rules

### Community 36 - "Community 36"
Cohesion: 0.50
Nodes (4): 14. Frontend Redesign, Diagnosis Workbench Layout, Primary Screens, Visual Language

### Community 37 - "Community 37"
Cohesion: 0.50
Nodes (4): 6. Multi-Agent System, Agent Contract, Debate Resolution, Required Agents

### Community 41 - "Community 41"
Cohesion: 0.67
Nodes (3): 11. Safety Engine, Required Checks, Safety Outcomes

### Community 42 - "Community 42"
Cohesion: 0.67
Nodes (3): 12. Farm Memory Intelligence, Example Memory Insight, Memory Signals

### Community 43 - "Community 43"
Cohesion: 0.67
Nodes (3): 7. Vision System, Production Inference Output, Recommended Training Stack

## Knowledge Gaps
- **304 isolated node(s):** `name`, `version`, `private`, `type`, `dev` (+299 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AnalyzeRequest` connect `Community 0` to `Community 9`, `Community 10`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `Flocksy AI Production Architecture` connect `Community 22` to `Community 34`, `Community 35`, `Community 36`, `Community 37`, `Community 41`, `Community 42`, `Community 43`, `Community 20`, `Community 25`, `Community 28`, `Community 29`, `Community 31`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `DecisionEngine` connect `Community 0` to `Community 9`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Are the 28 inferred relationships involving `AnalyzeRequest` (e.g. with `EnvironmentAgent` and `FeedAgent`) actually correct?**
  _`AnalyzeRequest` has 28 INFERRED edges - model-reasoned connections that need verification._
- **Are the 20 inferred relationships involving `DecisionEngine` (e.g. with `Orchestrator` and `.__init__()`) actually correct?**
  _`DecisionEngine` has 20 INFERRED edges - model-reasoned connections that need verification._
- **Are the 19 inferred relationships involving `AgentFinding` (e.g. with `DiseaseAgent` and `EnvironmentAgent`) actually correct?**
  _`AgentFinding` has 19 INFERRED edges - model-reasoned connections that need verification._
- **Are the 17 inferred relationships involving `VisionResult` (e.g. with `DiseaseAgent` and `AgentFinding`) actually correct?**
  _`VisionResult` has 17 INFERRED edges - model-reasoned connections that need verification._