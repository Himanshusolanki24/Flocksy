
# Flocksy AI Production Architecture

## 1. Current State Analysis

Flocksy already has the right top-level separation:

- `frontend`: React/Vite client
- `backend`: Express + TypeScript API layer
- `ai-core`: FastAPI orchestration layer
- `mcp-services`: disease, medicine, feed, environment, safety, memory services
- `database`: SQL schema

What is still missing is the operating model.

Today the platform behaves too much like:

`user input -> LLM summarization -> response card`

The biggest product and architecture gaps are:

- the main diagnosis experience is still exposed as `Chatbot.jsx`
- `ai-core` uses the LLM early for symptom summarization instead of late-stage explanation
- no centralized decision engine exists yet
- no explicit multi-agent debate or conflict resolution ledger exists
- vision is still a starter CNN, not a production transfer-learning pipeline
- no explainability pipeline exists for Grad-CAM / lesion heatmaps
- RAG is present as a service stub, but not yet source-ranked and farm-context-aware
- safety is appended as warnings instead of acting as a hard validation gate
- response contracts are still prose-heavy, not decision-system-first
- localization is not yet a dedicated layer with rural-language renderers

The redesign should preserve the current service split, but change the core behavior to:

`vision + rules + verified MCP data + farm memory + RAG evidence + multi-agent scoring + safety gates -> decision engine -> localized farmer response`

## 2. Target System Identity

Flocksy AI should become three products in one:

- a poultry diagnostic platform
- a farm intelligence operating system
- an agricultural decision engine

LLMs must be constrained to:

- explain findings
- summarize structured outputs
- localize into farmer-friendly language
- produce vet review summaries

LLMs must not:

- originate diagnosis on their own
- invent dosages
- override safety rules
- make unsupported treatment claims

## 3. Recommended Production Folder Structure

```text
Flocksy/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── diagnosis/
│   │   │   ├── explainability/
│   │   │   ├── alerts/
│   │   │   └── shared/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── farms/
│   │   │   ├── diagnosis/
│   │   │   ├── outbreaks/
│   │   │   ├── environment/
│   │   │   ├── analytics/
│   │   │   └── vet-review/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── charts/
│   │   ├── styles/
│   │   └── routes/
├── backend/
│   └── src/
│       ├── modules/
│       │   ├── auth/
│       │   ├── users/
│       │   ├── farms/
│       │   ├── uploads/
│       │   ├── diagnosis/
│       │   ├── analytics/
│       │   ├── outbreaks/
│       │   └── vet-review/
│       ├── middleware/
│       ├── services/
│       ├── queue/
│       ├── events/
│       ├── contracts/
│       └── lib/
├── ai-core/
│   └── app/
│       ├── api/
│       ├── orchestration/
│       ├── decision_engine/
│       ├── agents/
│       ├── fusion/
│       ├── explainability/
│       ├── localization/
│       ├── rag/
│       ├── vision/
│       ├── memory/
│       ├── safety/
│       ├── rules/
│       ├── schemas/
│       ├── clients/
│       └── observability/
├── mcp-services/
│   ├── disease_mcp/
│   ├── medicine_mcp/
│   ├── feed_mcp/
│   ├── environment_mcp/
│   ├── safety_mcp/
│   └── memory_mcp/
├── ml/
│   ├── training/
│   ├── inference/
│   ├── explainability/
│   ├── evaluation/
│   └── registry/
├── rag/
│   ├── ingestion/
│   ├── chunking/
│   ├── indexing/
│   ├── ranking/
│   └── corpora/
├── shared-contracts/
├── infra/
│   ├── docker/
│   ├── github-actions/
│   ├── terraform/
│   └── monitoring/
└── docs/
```

## 4. Production Architecture

### Frontend

Move away from a chatbot-first screen and adopt an operator dashboard with these primary surfaces:

- `Diagnosis Workbench`: image upload, symptom checklist, confidence fusion, heatmap viewer
- `Outbreak Command Center`: active alerts, spread risk, quarantine status, mortality trendline
- `Environment Monitor`: temperature, humidity, ventilation, risk overlays
- `Feed Intelligence`: feed profile, deficiency risks, age-group plan
- `Vet Review Panel`: AI-vs-vet comparison, correction workflow, escalation state
- `Farm Memory Timeline`: previous outbreaks, vaccines, feed changes, weather events

### Backend

Backend should be the application gateway, not the intelligence layer.

Primary responsibilities:

- auth and user access control
- farm, flock, and batch management
- media upload and signed URL generation
- request validation
- diagnosis job creation
- asynchronous workflow triggering
- vet review workflow
- audit logging

### AI Core

AI Core becomes the decision brain, with explicit sub-systems:

- `vision inference`
- `symptom parser`
- `environment scorer`
- `farm memory retrieval`
- `RAG evidence retrieval`
- `agent debate`
- `confidence fusion`
- `safety gate`
- `localization renderer`

### MCP Layer

MCP services remain the verified data plane and should answer narrow, deterministic questions only.

## 5. Decision Engine

This is the most important subsystem and should be implemented as a first-class module, not hidden inside `orchestrator.py`.

### Inputs

- vision model top-k predictions
- Grad-CAM lesion regions
- structured symptom checklist
- flock metadata
- environment telemetry
- farm history and prior outbreaks
- mortality trend
- RAG evidence
- verified MCP records

### Responsibilities

- produce ranked disease hypotheses
- support overlapping conditions
- compute severity and urgency
- estimate spread risk and mortality risk
- detect insufficient evidence
- request follow-up data when confidence is low
- block unsafe medicine or unsupported advice

### Suggested Internal Pipeline

```text
1. Normalize request
2. Run vision inference
3. Retrieve MCP disease candidates
4. Score symptom-disease overlap
5. Score environment-disease compatibility
6. Score historical recurrence match
7. Retrieve ranked evidence from RAG
8. Run agent debate and collect claims
9. Fuse confidence scores
10. Run safety gate
11. Generate operational action plan
12. Localize structured response
```

### Confidence Fusion

Suggested weighted baseline:

```text
final_confidence =
  vision_score * 0.40 +
  symptom_score * 0.20 +
  environment_score * 0.10 +
  history_score * 0.10 +
  rag_evidence_score * 0.10 +
  safety_support_score * 0.10
```

Weights should be configurable per disease family. Example:

- vision-heavy for lesion-visible diseases like coccidiosis
- environment-heavy for heat stress
- history-heavy for recurrent farm outbreaks

### Output Contract

```json
{
  "case_id": "diag_01",
  "diagnosis_status": "provisional",
  "differential_diagnosis": [
    {
      "disease": "Newcastle Disease",
      "confidence": 0.86,
      "rank": 1,
      "supporting_factors": [
        "vision lesions matched",
        "twisted neck symptom overlap",
        "recent outbreak history"
      ],
      "conflicting_factors": [
        "humidity pattern partially mismatched"
      ]
    },
    {
      "disease": "Heat Stress",
      "confidence": 0.52,
      "rank": 2
    }
  ],
  "severity": "high",
  "spread_risk": "high",
  "mortality_risk": "medium",
  "urgency": "immediate",
  "recommended_actions": [
    "Isolate visibly sick birds",
    "Improve ventilation immediately",
    "Escalate to veterinarian"
  ],
  "safety_warnings": [
    "Do not use this medicine in chicks below the safe age range"
  ],
  "needs_more_evidence": false
}
```

## 6. Multi-Agent System

Replace “agent wrappers that summarize MCP responses” with agents that own a formal scoring function and evidence statement.

### Required Agents

- `DiseaseDetectionAgent`
- `SymptomAnalysisAgent`
- `EnvironmentAnalysisAgent`
- `MedicineRecommendationAgent`
- `FeedOptimizationAgent`
- `RiskAnalysisAgent`
- `SafetyValidationAgent`
- `FarmMemoryAgent`
- `OrchestratorAgent`

### Agent Contract

Each agent should return:

```json
{
  "agent": "environment_analysis",
  "claim": "Heat stress is contributing to respiratory distress",
  "score": 0.61,
  "evidence": [
    "temperature 35C",
    "humidity 82%",
    "ventilation poor"
  ],
  "counter_evidence": [
    "neurological signs are not explained by heat alone"
  ],
  "action_bias": [
    "cooling",
    "ventilation correction"
  ]
}
```

### Debate Resolution

The orchestrator should not average opinions blindly. It should:

- cluster similar claims
- detect contradictions
- privilege deterministic evidence over generated language
- let safety veto unsafe plans
- downgrade confidence when strong disagreement remains

## 7. Vision System

Current `VisionService` is a starter CNN and should be replaced with a production inference path.

### Recommended Training Stack

- `ResNet18` or `EfficientNet-B0`
- image size `224x224`
- ImageNet transfer learning
- weighted cross-entropy
- oversampling for minority classes
- augmentation: flip, rotate, brightness, blur, crop
- optimizer: Adam
- scheduler: cosine or step LR
- early stopping
- checkpoint registry

### Production Inference Output

```json
{
  "top_k": [
    { "label": "Newcastle Disease", "confidence": 0.87 },
    { "label": "Salmonellosis", "confidence": 0.08 },
    { "label": "Healthy", "confidence": 0.05 }
  ],
  "heatmap_url": "/artifacts/cases/diag_01/gradcam.png",
  "lesion_regions": [
    { "x": 121, "y": 88, "w": 54, "h": 39, "score": 0.81 }
  ]
}
```

## 8. Visual Explainability

Add a dedicated explainability step after inference.

Artifacts:

- Grad-CAM heatmap
- side-by-side original image and heatmap
- highlighted lesion regions
- confidence explanation card

UI behavior:

- show “where the model looked”
- expose “why confidence is lower” when lesion spread is weak
- display “needs better image” when blur or framing quality is poor

## 9. MCP Microservices

Each MCP service should be deterministic and auditable.

### Disease MCP

Responsibilities:

- symptom-to-disease matching
- mortality and spread lookup
- prevention and treatment references
- disease class metadata

### Medicine MCP

Responsibilities:

- dosage lookup
- age restrictions
- withdrawal periods
- contraindications
- medicine interaction rules

### Feed MCP

Responsibilities:

- age-specific feed plans
- protein / energy targets
- disease recovery nutritional support

### Environment MCP

Responsibilities:

- temperature and humidity ranges by age
- ventilation guidance
- environment-linked disease risk scoring

### Safety MCP

Responsibilities:

- unsafe combination detection
- overdose detection
- chick safety
- egg / meat withdrawal warnings
- escalation rules

### Memory MCP

Responsibilities:

- prior outbreaks
- vaccination logs
- medication history
- mortality anomalies
- weather-linked events

## 10. RAG System

RAG should become evidence retrieval, not generic context stuffing.

### Source Priority

1. FAO poultry manuals
2. ICAR poultry guides
3. veterinary manuals
4. peer-reviewed research papers

### Retrieval Design

- use sentence-transformers embeddings
- chunk by disease, symptom cluster, and intervention topic
- attach metadata for source, disease, species, confidence tier
- filter by disease candidates from the decision engine
- rerank retrieved chunks by source priority and farm relevance

### RAG Output Contract

```json
{
  "evidence": [
    {
      "source": "FAO",
      "title": "Poultry disease field guide",
      "snippet": "Supportive care and isolation are early response priorities...",
      "relevance": 0.92,
      "disease_tags": ["Newcastle Disease"]
    }
  ]
}
```

## 11. Safety Engine

Safety must be a hard gate, not a text warning footer.

### Required Checks

- dosage within safe range
- age restriction validation
- withdrawal period disclosure
- duplicate active ingredient detection
- contraindicated combination detection
- symptom severity escalation
- mortality threshold escalation

### Safety Outcomes

- `allow`
- `allow_with_warning`
- `block_and_escalate`

If blocked, the frontend should show a red safety banner and remove medication CTA buttons.

## 12. Farm Memory Intelligence

Farm memory should influence both diagnosis and operations.

### Memory Signals

- same disease in past 30-90 days
- mortality spike recurrence
- post-vaccination symptom window
- recent feed switch
- weather pattern change
- recurring shed / batch risk

### Example Memory Insight

```json
{
  "historical_match": true,
  "similar_case_count": 2,
  "last_case_date": "2026-04-11",
  "notes": [
    "Similar neurological signs observed in batch B2 last month"
  ]
}
```

## 13. Localization Layer

Create a dedicated rendering layer that transforms structured findings into natural rural language.

### Modules

```text
ai-core/app/localization/
├── formatter.py
├── rural_hindi_formatter.py
├── bhojpuri_formatter.py
├── haryanvi_formatter.py
├── punjabi_formatter.py
└── marathi_formatter.py
```

### Rules

- never expose raw clinical jargon unless a vet mode is enabled
- avoid direct machine translation tone
- keep sentences short
- prefer action-first phrasing
- state uncertainty honestly

### Example Farmer Output

`मुर्गियों में गर्दन मुड़ना, कमजोरी और सुस्ती दिख रही है। यह न्यूकैसल बीमारी हो सकती है। बीमार पक्षियों को अभी अलग रखें और दवा देने से पहले डॉक्टर से पक्का करा लें।`

## 14. Frontend Redesign

The current chat page should be replaced by a diagnosis console.

### Primary Screens

- `Dashboard`
- `Diagnosis Workbench`
- `Case Details`
- `Outbreak Map`
- `Environment Monitor`
- `Feed Advisor`
- `Vet Review`
- `Farm Memory`

### Diagnosis Workbench Layout

- left: image upload, symptom chips, farm context form
- center: case timeline, differential diagnosis cards, heatmap viewer
- right: severity, spread risk, mortality risk, recommended actions, safety block

### Visual Language

- clinical-agri dashboard, not assistant bubbles
- muted earth palette with alert colors
- dense card-based information layout
- confidence bars, severity ladders, and risk badges
- charts for mortality, feed, and environment telemetry

## 15. API Design

### Backend API

#### `POST /api/v1/diagnosis/cases`

Creates a diagnosis job.

```json
{
  "farmId": "farm_123",
  "batchId": "batch_a",
  "symptoms": ["twisted neck", "green diarrhea", "weakness"],
  "ageInDays": 21,
  "temperatureC": 34,
  "humidityPercent": 79,
  "media": ["signed-upload-url-or-file-ref"]
}
```

#### `GET /api/v1/diagnosis/cases/:id`

Returns structured case status and final decision payload.

#### `POST /api/v1/diagnosis/cases/:id/review`

Vet correction and override workflow.

#### `GET /api/v1/farms/:farmId/memory`

Returns outbreak and management history.

### AI Core API

#### `POST /analyze-case`

Consumes normalized case payload and returns machine-first decision data.

#### `POST /localize`

Turns structured decisions into farmer-facing language.

#### `POST /safety/validate`

Allows external workflows to validate medicine plans separately.

## 16. Deployment Strategy

### Frontend

- Vercel
- edge caching for static assets
- signed URLs for image access

### Backend

- AWS ECS, Railway, or Render
- Redis queue for async diagnosis jobs
- PostgreSQL on RDS or Supabase

### AI Core

- EC2 or Azure VM with GPU option
- separate autoscaling path for vision inference if traffic grows

### Storage

- S3 or Cloudinary for media and heatmap artifacts
- Redis for caching and job status

### CI/CD

- GitHub Actions
- Docker builds for backend, ai-core, and MCP services
- model artifact version tagging
- migration + smoke-test pipeline

## 17. Observability

Add production telemetry from day one:

- request IDs across backend and ai-core
- agent decision traces
- confidence component logs
- model version logging
- safety rule trigger logs
- retrieval source logs
- audit log for vet overrides

## 18. Recommended Refactor Order

1. Replace chatbot-first diagnosis flow with case-based workflow
2. Extract `DecisionEngine` from `orchestrator.py`
3. Standardize agent contracts around score + evidence + conflict data
4. Replace starter CNN with transfer-learning inference contract
5. Add Grad-CAM pipeline and artifact storage
6. Add structured diagnosis response schema
7. Move localization into dedicated formatters
8. Turn safety into a blocking validator
9. Add farm memory scoring
10. Add vet review and correction loop

## 19. Immediate Codebase Recommendations

Based on the current repository, these are the first concrete changes to make next:

- rename or retire [frontend/pages/Chatbot.jsx](/Users/himanshusolanki/Desktop/Rion/Flocksy/frontend/pages/Chatbot.jsx)
- replace prose-heavy `FinalRecommendation` in [ai-core/app/schemas.py](/Users/himanshusolanki/Desktop/Rion/Flocksy/ai-core/app/schemas.py) with structured decision schemas
- split [ai-core/app/agents/orchestrator.py](/Users/himanshusolanki/Desktop/Rion/Flocksy/ai-core/app/agents/orchestrator.py) into `decision_engine`, `agent_registry`, and `response_localizer`
- upgrade [ai-core/app/services/vision_service.py](/Users/himanshusolanki/Desktop/Rion/Flocksy/ai-core/app/services/vision_service.py) to model-registry-based inference with top-k output and explainability support
- replace `/diagnosis/chat` patterns in [frontend/src/api.js](/Users/himanshusolanki/Desktop/Rion/Flocksy/frontend/src/api.js) and [backend/src/routes/diagnosis.ts](/Users/himanshusolanki/Desktop/Rion/Flocksy/backend/src/routes/diagnosis.ts) with case-oriented APIs

