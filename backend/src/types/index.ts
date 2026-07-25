export interface AuthenticatedRequestUser {
  id: string;
  email: string;
  role: 'farmer' | 'manager' | 'vet' | 'admin';
}

export interface FarmContext {
  farmId: string;
  batchId?: string;
  flockSize?: number;
  ageInDays?: number;
  temperatureC?: number;
  humidityPercent?: number;
  feedType?: string;
}

export interface DiagnosisRequestPayload {
  symptoms: string;
  symptomChecklist?: string[];
  language?: string;
  context: FarmContext;
  mediaUrl?: string;
  mediaBase64?: string;
  mediaMimeType?: string;
}

export interface DiagnosisCaseRecord {
  caseId: string;
  createdAt: string;
  status: string;
  media?: {
    url?: string;
    mimeType?: string;
    filename?: string;
  } | null;
  result: Record<string, unknown>;
}

export interface TopStat {
  label: string;
  value: string;
  subtext: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface HealthAlert {
  id: string;
  title: string;
  badge: string;
  note: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  actionRequired: boolean;
  category: 'health' | 'feed' | 'environment' | 'vaccination';
}

export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  category: string;
  dueDate?: string;
}

export interface WeeklyTrendData {
  day: string;
  value: number;
}

export interface Activity {
  id: string;
  title: string;
  meta: string;
  timestamp: string;
  type: 'note' | 'consultation' | 'protocol' | 'report';
}

export interface ChartSegment {
  label: string;
  value: number;
  color: string;
  description: string;
}

export interface DashboardSummary {
  // Original fields
  activeAlerts: number;
  healthyBirdRatio: number;
  feedEfficiency: number;
  pendingTreatments: number;
  recentDetections: Array<{
    disease: string;
    confidence: number;
    timestamp: string;
  }>;
  
  // Extended fields for frontend
  stats: TopStat[];
  alerts: HealthAlert[];
  tasks: Task[];
  weeklyTrend: WeeklyTrendData[];
  activities: Activity[];
  chartData: ChartSegment[];
}
