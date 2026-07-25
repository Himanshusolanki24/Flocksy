import React from 'react';
import { FileText, MessageSquare, Activity, AlertCircle } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

const typeConfig = {
  note: { icon: FileText, dot: 'bg-sky-500' },
  consultation: { icon: MessageSquare, dot: 'bg-violet-500' },
  protocol: { icon: Activity, dot: 'bg-emerald-500' },
  report: { icon: AlertCircle, dot: 'bg-amber-500' },
};

export const RecentActivityFeed = () => {
  const { activities } = useDashboardStore();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-700">Recent Activity</h2>
        <button className="text-xs font-medium text-slate-400 transition hover:text-slate-600">
          See all
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activities.map((item, idx) => {
          const cfg = typeConfig[item.type] || typeConfig.note;
          const isLast = idx === activities.length - 1;

          return (
            <div
              key={item.id}
              className={`group flex items-start gap-3 px-5 py-3.5 transition hover:bg-slate-50/70 ${
                !isLast ? 'border-b border-slate-50' : ''
              }`}
            >
              {/* Timeline dot */}
              <div className="flex flex-col items-center pt-1">
                <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                {!isLast && <div className="mt-1 h-full w-px bg-slate-100" />}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug text-slate-700 group-hover:text-slate-900 transition-colors">
                  {item.title}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{item.source}</span>
                  <span>·</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
