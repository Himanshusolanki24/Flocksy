import React from 'react';
import { AlertTriangle, X, ChevronRight } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

const severityConfig = {
  critical: {
    dot: 'bg-rose-500',
    bg: 'bg-rose-50/60 border-rose-200/60 hover:border-rose-300',
    badge: 'bg-rose-500 text-white',
    accent: 'text-rose-600',
  },
  warning: {
    dot: 'bg-amber-500',
    bg: 'bg-amber-50/60 border-amber-200/60 hover:border-amber-300',
    badge: 'bg-amber-500 text-white',
    accent: 'text-amber-600',
  },
  info: {
    dot: 'bg-sky-500',
    bg: 'bg-sky-50/60 border-sky-200/60 hover:border-sky-300',
    badge: 'bg-sky-500 text-white',
    accent: 'text-sky-600',
  },
};

export const HealthAlertsPanel = () => {
  const { alerts, dismissAlert } = useDashboardStore();

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-700">All clear</p>
        <p className="mt-1 text-xs text-slate-400">No active alerts right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-700">Alerts</h2>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-100 px-1.5 text-[11px] font-bold text-rose-600">
            {alerts.length}
          </span>
        </div>
        <button className="text-xs font-medium text-slate-400 transition hover:text-slate-600">
          View all
        </button>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => {
          const cfg = severityConfig[alert.severity] || severityConfig.info;

          return (
            <div
              key={alert.id}
              className={`group relative flex items-start gap-3 rounded-xl border p-3.5 transition-all duration-200 ${cfg.bg}`}
            >
              <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800 leading-snug">{alert.title}</p>
                  <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cfg.badge}`}>
                    {alert.badge}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{alert.note}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">{alert.time}</span>
                  <button className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${cfg.accent} transition hover:opacity-80`}>
                    Details <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {alert.dismissible && (
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="shrink-0 rounded-lg p-1 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-white/80 hover:text-slate-600"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
