import { create } from 'zustand';
import { dashboardApi } from '../src/api';

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';

  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffHours = Math.max(0, Math.floor(diffMs / 3_600_000));

  if (diffHours < 1) {
    const diffMinutes = Math.max(1, Math.floor(diffMs / 60_000));
    return `${diffMinutes} min ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
};

const normalizeSummary = (data) => {
  const palette = ['#1F6F5F', '#2FA084', '#6FCF97', '#EEEEEE'];
  const stats = (data.stats || []).map((stat, index) => ({
    id: stat.id || `stat-${index + 1}`,
    label: stat.label,
    value: stat.value,
    change: stat.change || stat.subtext || 'Stable',
    trend: stat.trend === 'stable' ? 'neutral' : stat.trend,
    color: stat.color || ['emerald', 'sky', 'amber', 'rose'][index % 4],
  }));

  const alerts = (data.alerts || []).map((alert) => ({
    ...alert,
    badge: alert.badge || alert.severity,
    time: formatTimeAgo(alert.timestamp),
    dismissible: alert.dismissible ?? true,
  }));

  const weeklyTrend = (data.weeklyTrend || []).map((entry) => ({
    day: entry.day,
    health: entry.health ?? entry.value ?? 0,
    feed: entry.feed ?? Math.max(60, Math.min(100, (entry.value ?? 0) - 4)),
  }));

  const activities = (data.activities || []).map((item) => ({
    ...item,
    source: item.source || item.meta || 'System update',
    time: formatTimeAgo(item.timestamp),
  }));

  return {
    stats,
    alerts,
    tasks: data.tasks || [],
    weeklyTrend,
    activities,
    chartData: (data.chartData || []).map((item, index) => ({
      ...item,
      color: palette[index % palette.length],
    })),
  };
};

export const useDashboardStore = create((set, get) => ({
  user: {
    name: 'Farm Operator',
    farmName: 'Flocksy Demo Farm',
    email: 'demo@flocksy.app',
  },
  stats: [],
  alerts: [],
  tasks: [],
  weeklyTrend: [],
  activities: [],
  chartData: [],
  activeTab: 'overview',
  searchQuery: '',
  loading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user }),
  fetchSummary: async () => {
    set({ loading: true, error: null });
    try {
      const data = await dashboardApi.getSummary();
      const normalized = normalizeSummary(data);
      set({
        ...normalized,
        loading: false
      });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error('Failed to fetch dashboard summary:', err);
    }
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveTab: (id) => set({ activeTab: id }),
  completeTask: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    })),
  dismissAlert: (id) =>
    set((s) => ({
      alerts: s.alerts.filter((a) => a.id !== id),
    })),
}));
