/** User roles supported by the platform. */
export type UserRole = "farmer" | "manager" | "vet" | "admin";

/** The primary farming activity a farmer runs. */
export type FarmType = "poultry" | "dairy" | "livestock" | "crops";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  phone?: string;
  farmName?: string;
  locale?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  farmName?: string;
  farmType?: FarmType;
}

/** A farm owned/managed by the user. */
export interface Farm {
  id: string;
  name: string;
  location: string;
  flockSize: number;
  houseCount: number;
  farmType?: FarmType;
  createdAt?: string;
}

/* ============================== Dashboard ============================== */

export type AlertSeverity = "critical" | "warning" | "info";

export interface DashboardAlert {
  id: string;
  title: string;
  badge: string;
  note?: string;
  severity: AlertSeverity;
  timestamp: string;
  actionRequired: boolean;
  category: "environment" | "health" | "feed" | "market";
}

export interface DashboardTask {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  category: "health" | "feed" | "finance" | "farm";
  dueDate: string;
}

export interface Activity {
  id: string;
  title: string;
  meta?: string;
  timestamp: string;
  type: "note" | "alert" | "task" | "sale" | "health";
}

export interface Stat {
  label: string;
  value: string;
  subtext?: string;
  trend?: "up" | "down" | "flat";
}

export interface ChartDatum {
  label: string;
  value: number;
  color?: string;
  description?: string;
}

export interface TrendPoint {
  day: string;
  value: number;
}

export interface DetectionRecord {
  disease: string;
  confidence: number;
  timestamp: string;
}

export interface DashboardSummary {
  activeAlerts: number;
  healthyBirdRatio: number;
  feedEfficiency: number;
  pendingTreatments: number;
  recentDetections: DetectionRecord[];
  stats: Stat[];
  alerts: DashboardAlert[];
  tasks: DashboardTask[];
  weeklyTrend: TrendPoint[];
  activities: Activity[];
  chartData: ChartDatum[];
}

/* ============================== Diagnosis ============================== */

export interface DiseaseResult {
  prediction: string;
  confidence: number;
}

export interface DiagnosisAnalysis {
  result: {
    disease: DiseaseResult;
    next_steps: string[];
    warnings: string[];
  };
}

export interface DiagnosisResponse {
  requestId: string;
  media?: { url: string; mimeType: string };
  analysis: DiagnosisAnalysis;
}

export interface DiagnosisRecord {
  id: string;
  requestId: string;
  disease: string;
  confidence: number;
  symptoms?: string;
  imageUrl?: string;
  createdAt: string;
  nextSteps?: string[];
}

export interface DiagnosisUploadPayload {
  media?: File;
  symptoms?: string;
  farmId?: string;
  flockSize?: number;
  ageInDays?: number;
  temperatureC?: number;
  humidityPercent?: number;
}

/* ============================== Vets =================================== */

export interface Vet {
  id: string;
  name: string;
  specialty: string;
  city: string;
  availability: string;
  rating?: number;
  online?: boolean;
  experience?: string;
  languages?: string[];
}

/* ============================== Weather ================================ */

export type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "light-rain"
  | "moderate-rain"
  | "thunderstorm"
  | "sunny";

export interface HourlyForecast {
  time: string;
  tempC: number;
  condition: WeatherCondition;
  precipitationChance: number;
}

export interface DailyForecast {
  date: string;
  maxTempC: number;
  minTempC: number;
  condition: WeatherCondition;
  precipitationChance: number;
}

export interface WeatherAlert {
  id: string;
  type: "heat" | "rain" | "frost";
  message: string;
}

export interface WeatherData {
  location: string;
  tempC: number;
  feelsLikeC: number;
  humidity: number;
  windKph: number;
  uvIndex: number;
  precipitationChance: number;
  sunrise: string;
  sunset: string;
  condition: WeatherCondition;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts: WeatherAlert[];
}

/* ============================== Market ================================= */

export interface MarketPrice {
  id: string;
  commodity: string;
  unit: string;
  price: number;
  mandi: string;
  changePct: number;
  trend: TrendPoint[];
}

export interface MarketListing {
  id: string;
  commodity: string;
  quantity: string;
  pricePerUnit: number;
  unit: string;
  location: string;
  createdAt: string;
}

/* ============================== Inventory ============================== */

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface InventoryItem {
  id: string;
  name: string;
  category: "feed" | "medicine" | "equipment" | "other";
  quantity: number;
  unit: string;
  stockStatus: StockStatus;
  updatedAt: string;
}

/* ============================== Feed =================================== */

export type FeedType = "starter" | "grower" | "finisher" | "layer" | "dairy";

export interface FeedBatch {
  id: string;
  brand: string;
  type: FeedType;
  weightKg: number;
  cost: number;
  purchaseDate: string;
  expiryDate: string;
  qualityScore: number;
  avgDailyConsumptionKg: number;
  daysLeft: number;
}

/* ============================== Medicine =============================== */

export interface Medicine {
  id: string;
  name: string;
  batchNo?: string;
  dose: string;
  schedule: string;
  stock: string;
  cost: number;
  withdrawalDays: number;
  course: "active" | "completed";
  nextDoseAt?: string;
}

/* ============================== Vaccination ============================ */

export type VaccinationStatus = "completed" | "scheduled" | "overdue";

export interface Vaccination {
  id: string;
  vaccine: string;
  flock: string;
  ageDays: number;
  dueDate: string;
  status: VaccinationStatus;
}

/* ============================== Schemes ================================ */

export type SchemeCategory = "poultry" | "dairy" | "crop" | "insurance" | "loan";

export interface GovernmentScheme {
  id: string;
  title: string;
  ministry: string;
  category: SchemeCategory;
  benefit: string;
  eligibility: string;
  deadline?: string;
  applyUrl?: string;
  open: boolean;
}

/* ============================== Learning =============================== */

export interface Lesson {
  id: string;
  title: string;
  category: "poultry" | "dairy" | "finance" | "crops";
  durationMin: number;
  level: "beginner" | "intermediate" | "advanced";
  completed: boolean;
  points: number;
}

/* ============================== Community ============================== */

export interface CommunityPost {
  id: string;
  author: string;
  avatarUrl?: string;
  content: string;
  likes: number;
  replies: number;
  timeAgo: string;
  tag: string;
  following?: boolean;
  live?: boolean;
}

/* ============================== Finance ================================ */

export type TransactionType = "income" | "expense";
export type TransactionCategory =
  | "sellEggs"
  | "sellMilk"
  | "feedPurchase"
  | "vetVisit"
  | "medicine"
  | "other";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  note?: string;
  date: string;
}

export interface FinanceSummary {
  balance: number;
  income: number;
  expense: number;
  monthlyTrend: TrendPoint[];
}

/* ============================== Notifications ========================== */

export type NotificationType = "alert" | "reminder" | "market" | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

/* ============================== Chat / AI ============================== */

export interface ChatReference {
  title: string;
  url?: string;
  source: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  timestamp: string;
  pinned?: boolean;
  references?: ChatReference[];
  analysis?: DiagnosisAnalysis;
}

export interface AiChatResponse {
  advice: string;
  analysis?: DiagnosisAnalysis;
  references?: ChatReference[];
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

/* ============================== Generic ================================ */

/** Standard list envelope used by the backend. */
export interface ListResponse<T> {
  items: T[];
}

export interface ProfileResponse {
  user: User;
  activeFarmId?: string;
}
