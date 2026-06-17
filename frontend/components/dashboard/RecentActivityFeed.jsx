import React from 'react';
import { FileText, MessageSquare, Activity, AlertCircle } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

const typeConfig = {
  note: { icon: FileText, dot: 'bg-[#2FA084]' },
  consultation: { icon: MessageSquare, dot: 'bg-[#1F6F5F]' },
  protocol: { icon: Activity, dot: 'bg-[#6FCF97]' },
  report: { icon: AlertCircle, dot: 'bg-[#2FA084]' },
};

export const RecentActivityFeed = () => {
  const { activities } = useDashboardStore();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#1F6F5F]/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#1F6F5F]/10 px-5 py-4">
        <h2 className="text-sm font-semibold text-[#1F6F5F]">Recent Activity</h2>
        <button className="text-xs font-medium text-[#1F6F5F]/45 transition hover:text-[#1F6F5F]">
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
              className={`group flex items-start gap-3 px-5 py-3.5 transition hover:bg-[#EEEEEE]/50 ${
                !isLast ? 'border-b border-[#1F6F5F]/5' : ''
              }`}
            >
              {/* Timeline dot */}
              <div className="flex flex-col items-center pt-1">
                <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                {!isLast && <div className="mt-1 h-full w-px bg-[#1F6F5F]/10" />}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug text-[#1F6F5F]/75 group-hover:text-[#1F6F5F] transition-colors">
                  {item.title}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-[#1F6F5F]/45">
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
