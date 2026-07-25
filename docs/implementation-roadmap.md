# Flocksy AI Implementation Roadmap

## Phase 1: Foundation Refactor

Goal: stop behaving like a chatbot and introduce a real case workflow.

- replace `chat` endpoints with `diagnosis case` endpoints
- define shared schemas for case input, differential diagnosis, risks, safety, and localized output
- split the frontend into dashboard, diagnosis workbench, and case details pages
- move LLM usage behind a localization and explanation interface only

Deliverables:

- structured diagnosis API
- new diagnosis workbench UI shell
- decision-engine schema contracts

## Phase 2: Decision Engine

Goal: make deterministic reasoning the center of the platform.

- create `decision_engine/engine.py`
- add agent contracts with `claim`, `score`, `evidence`, `counter_evidence`
- implement confidence fusion
- implement differential diagnosis ranking
- implement urgency, spread, and mortality scoring

Deliverables:

- ranked disease outputs
- decision trace payload
- conflict-aware orchestrator

## Phase 3: Vision + Explainability

Goal: make the disease detection stack credible and explainable.

- train ResNet18 or EfficientNet with transfer learning
- add model registry and versioned checkpoints
- implement Grad-CAM artifact generation
- surface heatmap + image quality checks in UI

Deliverables:

- production vision inference service
- heatmaps and lesion localization artifacts
- model evaluation report

## Phase 4: Verified Knowledge Plane

Goal: reduce hallucination risk with real data services.

- harden MCP schemas
- expand curated disease, medicine, feed, and environment datasets
- add medicine interaction and withdrawal rule coverage
- add RAG ingestion pipeline with source priority

Deliverables:

- validated MCP datasets
- source-ranked retrieval
- safety blocking rules

## Phase 5: Farm Intelligence

Goal: make the system farm-aware, not case-only.

- add farm memory scoring
- add mortality analytics and anomaly detection
- add environment trend tracking
- add outbreak forecasting

Deliverables:

- farm memory timeline
- recurrence-aware diagnosis
- predictive analytics cards

## Phase 6: Human-in-the-Loop

Goal: make the platform reviewable and production-safe.

- build vet review queue
- add AI-vs-vet diff view
- capture corrections as training signals
- add escalation workflows

Deliverables:

- vet correction panel
- override audit logs
- feedback loop dataset

## Phase 7: Productionization

Goal: ship with confidence.

- add Docker builds for all services
- add GitHub Actions test and deploy workflows
- add centralized logging and tracing
- add load tests and smoke tests
- define SLOs for diagnosis latency and service reliability

Deliverables:

- containerized deployment
- CI/CD pipelines
- monitoring dashboards

## Suggested Priority For This Repo

If we continue from the current codebase, the best next implementation order is:

1. redesign diagnosis contracts
2. refactor orchestrator into a decision engine
3. rebuild the frontend diagnosis screen
4. add explainability artifacts
5. harden MCP and safety rules
6. add RAG source ranking
7. add vet review

