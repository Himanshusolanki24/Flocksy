# Graph Report - Flocksy  (2026-08-05)

## Corpus Check
- 224 files · ~64,877 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1298 nodes · 2515 edges · 107 communities (82 shown, 25 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 215 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7cdbc927`
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
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 101|Community 101]]
- [[_COMMUNITY_Community 104|Community 104]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 94 edges
2. `Button` - 32 edges
3. `AnalyzeRequest` - 31 edges
4. `DecisionEngine` - 28 edges
5. `Card` - 24 edges
6. `Badge()` - 23 edges
7. `AgentFinding` - 21 edges
8. `PageHeader()` - 20 edges
9. `Flocksy AI Production Architecture` - 20 edges
10. `VisionResult` - 19 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `Orchestrator`  [INFERRED]
  test_ai_core.py → ai-core/app/agents/orchestrator.py
- `AgentFinding` --uses--> `AgentFinding`  [INFERRED]
  ai-core/app/agents/medicine_agent.py → ai-core/app/schemas.py
- `AgentFinding` --uses--> `AgentFinding`  [INFERRED]
  ai-core/app/agents/memory_agent.py → ai-core/app/schemas.py
- `AgentFinding` --uses--> `AgentFinding`  [INFERRED]
  ai-core/app/agents/risk_agent.py → ai-core/app/schemas.py
- `AgentFinding` --uses--> `AgentFinding`  [INFERRED]
  ai-core/app/agents/safety_agent.py → ai-core/app/schemas.py

## Import Cycles
- None detected.

## Communities (107 total, 25 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (64): DiseaseAgent, EnvironmentAgent, FeedAgent, MedicineAgent, MemoryAgent, Orchestrator, RiskAgent, SafetyAgent (+56 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (24): ChatView(), ConversationList(), suggestions, Composer(), ComposerProps, MarkdownContent(), MessageList(), generateReply() (+16 more)

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
Cohesion: 0.15
Nodes (12): AI Core Integration, Authentication Flow, Backend Server, CORS Configuration, Database, Error Handling, Flocksy API Integration Guide, Next Steps (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.04
Nodes (47): dependencies, class-variance-authority, clsx, cmdk, date-fns, @dnd-kit/core, @dnd-kit/modifiers, @dnd-kit/sortable (+39 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (18): LocalResult, statusStyle, categoryIcons, Avatar, AvatarFallback, AvatarImage, Badge(), BadgeProps (+10 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (27): CHART_COLORS, FARM_TYPES, INVENTORY_UNITS, SEVERITY_TONES, STOCK_TONES, TRANSACTION_CATEGORIES, VACCINATION_TONES, isLocale() (+19 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (28): AreaTrend(), BarSeries(), DonutChart(), DonutChartProps, DonutDatum, LineSeries(), SeriesPoint, Sparkline() (+20 more)

### Community 10 - "Community 10"
Cohesion: 0.10
Nodes (29): mockCommunityPosts, mockFarms, mockFeedBatches, mockFinance, mockInventory, mockLessons, mockMarketPrices, mockMedicines (+21 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (18): AdviceCard(), GaugeCard(), seasonMap, categoryEmoji, NotificationRow(), typeIcon, categoryEmoji, DataState() (+10 more)

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (13): 1. Authentication (`/auth`), 2. Dashboard (`/dashboard`), 4. Veterinarians (`/vets`), 5. Users (`/users`), 6. Health Check (`/health`), API Endpoints, GET `/dashboard/summary`, GET `/health` (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (10): DataLoader, Dataset, Path, Tensor, Module, Namespace, evaluate(), PoultryCNN (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.17
Nodes (15): caseSchema, caseStore, chatSchema, contextSchema, createCase(), datasetFolderByDisease, datasetRoot, getDatasetFolder() (+7 more)

### Community 15 - "Community 15"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, outDir, resolveJsonModule, rootDir (+5 more)

### Community 16 - "Community 16"
Cohesion: 0.20
Nodes (9): Activity, DashboardSummary, ChartSegment, DiagnosisCaseRecord, FarmContext, HealthAlert, Task, TopStat (+1 more)

### Community 17 - "Community 17"
Cohesion: 0.15
Nodes (12): AI Core, Backend, Flocksy Quick Start Guide, Frontend, Local-first setup, Manual startup, MCP services, One-command startup (+4 more)

### Community 18 - "Community 18"
Cohesion: 0.25
Nodes (6): dashboardRouter, diagnosisRouter, healthRouter, vetRouter, vets, dashboardService

### Community 19 - "Community 19"
Cohesion: 0.19
Nodes (9): env, envSchema, logger, aiCoreClient, client, pgPool, redis, app (+1 more)

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
Cohesion: 0.06
Nodes (31): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+23 more)

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
Cohesion: 0.33
Nodes (5): Dataset Setup, Download the Dataset, ML Training - Poultry Disease Detection, Trained Models, Training

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

### Community 50 - "Community 50"
Cohesion: 0.09
Nodes (16): SiteConfig, benefits, faqKeys, farmTypes, LandingPage(), showcaseFeatures, stats, steps (+8 more)

### Community 51 - "Community 51"
Cohesion: 0.07
Nodes (27): Activity, DashboardSummary, AiChatResponse, AlertSeverity, ChartDatum, ChatReference, DailyForecast, DashboardAlert (+19 more)

### Community 52 - "Community 52"
Cohesion: 0.18
Nodes (10): SectionCardProps, StatCard(), StatCardProps, Card, CardContent, CardDescription, CardFooter, CardHeader (+2 more)

### Community 53 - "Community 53"
Cohesion: 0.10
Nodes (6): Checkbox, PopoverContent, RadioGroup, RadioGroupItem, Separator, TooltipContent

### Community 54 - "Community 54"
Cohesion: 0.16
Nodes (15): LoginForm(), RegisterForm(), loginSchema, LoginValues, registerSchema, RegisterValues, useLogin(), useRegister() (+7 more)

### Community 55 - "Community 55"
Cohesion: 0.15
Nodes (13): mockDashboard(), getAuthToken(), authService, dashboardService, ApiError, extractErrorMessage(), http, request() (+5 more)

### Community 56 - "Community 56"
Cohesion: 0.13
Nodes (8): AnalyticsView(), BatchCard(), daysLeftTone(), FinanceView(), useFinance(), useTransactions(), formatINR(), MedicineCard()

### Community 57 - "Community 57"
Cohesion: 0.18
Nodes (9): AppShell(), AppSidebar(), MobileDock(), MobileNav(), ModalName, UiState, useUiStore, ScrollArea (+1 more)

### Community 58 - "Community 58"
Cohesion: 0.19
Nodes (9): { Link, redirect, usePathname, useRouter, getPathname }, MarketingFooter(), links, MarketingNav(), Brand(), BrandMark(), BrandProps, LanguageSwitcher() (+1 more)

### Community 59 - "Community 59"
Cohesion: 0.18
Nodes (13): allNavItems, dockItems, navigation, NavItem, NavSection, Command, CommandDialog(), CommandEmpty (+5 more)

### Community 60 - "Community 60"
Cohesion: 0.21
Nodes (13): DashboardHeader(), useLogout(), AppTopbar(), useAuthStore, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel (+5 more)

### Community 61 - "Community 61"
Cohesion: 0.13
Nodes (14): 10. Services / Ports (start-all.sh), 11. Summary of every folder the frontend connects to, 1. Connection Overview (Diagram), 2. Connection #1 — Frontend → Backend (REST / HTTP), 3. Connection #2 — Backend → Frontend (Reference Images), 4. Connection #3 — Backend → AI-Core, 5. Connection #4 — Frontend → External AI (Anthropic, direct-browser ⚠), 6. Connection #5 — AI-Core → MCP Services (+6 more)

### Community 62 - "Community 62"
Cohesion: 0.13
Nodes (13): qk, setAuthToken(), communityService, feedService, financeService, inventoryService, learningService, marketService (+5 more)

### Community 63 - "Community 63"
Cohesion: 0.15
Nodes (7): ProfileView(), ThemeProvider(), SettingsView(), CommandPalette(), PreferencesState, ThemePreference, usePreferencesStore

### Community 64 - "Community 64"
Cohesion: 0.15
Nodes (12): description, engines, node, name, private, scripts, build, dev (+4 more)

### Community 65 - "Community 65"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node, @types/react (+2 more)

### Community 66 - "Community 66"
Cohesion: 0.27
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 67 - "Community 67"
Cohesion: 0.20
Nodes (9): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+1 more)

### Community 68 - "Community 68"
Cohesion: 0.28
Nodes (4): WeatherMini(), useWeather(), conditionIcon, WeatherView()

### Community 69 - "Community 69"
Cohesion: 0.28
Nodes (5): useNotifications(), NotificationsView(), NotificationsState, useNotificationsStore, AppNotification

### Community 70 - "Community 70"
Cohesion: 0.28
Nodes (4): ReportLine(), ReportsView(), ReportType, Progress

### Community 71 - "Community 71"
Cohesion: 0.25
Nodes (7): diagnosisService, farmService, userService, vetService, DiagnosisUploadPayload, ListResponse, Vet

### Community 72 - "Community 72"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 73 - "Community 73"
Cohesion: 0.33
Nodes (6): 1. Start Backend, 2. Start Frontend, 3. Test Health Check, 4. Test Login, 5. Open Frontend, Testing the Integration

### Community 74 - "Community 74"
Cohesion: 0.33
Nodes (6): Example: Chat Query, Example: Fetch Dashboard, Example: Login, Example: Upload Image for Diagnosis, Frontend API Usage, Import API Functions

### Community 76 - "Community 76"
Cohesion: 0.40
Nodes (5): Authentication Errors, Connection Errors, CORS Errors, Database Errors, Troubleshooting

### Community 80 - "Community 80"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 88 - "Community 88"
Cohesion: 0.40
Nodes (3): DateRangeKey, FiltersState, useFiltersStore

### Community 89 - "Community 89"
Cohesion: 0.50
Nodes (4): 3. Diagnosis (`/diagnosis`), POST `/diagnosis/analyze`, POST `/diagnosis/chat`, POST `/diagnosis/upload`

### Community 92 - "Community 92"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 93 - "Community 93"
Cohesion: 0.67
Nodes (3): AuthState, AuthStatus, User

### Community 94 - "Community 94"
Cohesion: 0.67
Nodes (3): FarmState, useFarmStore, Farm

### Community 95 - "Community 95"
Cohesion: 0.67
Nodes (3): Environment Variables, Frontend Configuration, Starting the Frontend

## Knowledge Gaps
- **497 isolated node(s):** `name`, `version`, `private`, `type`, `dev` (+492 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 9` to `Community 1`, `Community 66`, `Community 67`, `Community 70`, `Community 7`, `Community 72`, `Community 11`, `Community 50`, `Community 52`, `Community 53`, `Community 54`, `Community 56`, `Community 57`, `Community 58`, `Community 59`, `Community 60`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `Button` connect `Community 11` to `Community 1`, `Community 68`, `Community 70`, `Community 7`, `Community 9`, `Community 50`, `Community 52`, `Community 54`, `Community 56`, `Community 57`, `Community 58`, `Community 60`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `Medicine` connect `Community 10` to `Community 11`, `Community 51`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Are the 28 inferred relationships involving `AnalyzeRequest` (e.g. with `EnvironmentAgent` and `FeedAgent`) actually correct?**
  _`AnalyzeRequest` has 28 INFERRED edges - model-reasoned connections that need verification._
- **Are the 20 inferred relationships involving `DecisionEngine` (e.g. with `Orchestrator` and `.__init__()`) actually correct?**
  _`DecisionEngine` has 20 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _497 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05137741046831956 - nodes in this community are weakly interconnected._