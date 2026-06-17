import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

const colorMap = {
  emerald: {
    badge: 'bg-[#6FCF97]/20 text-[#1F6F5F]',
    gradient: 'from-[#1F6F5F] to-[#2FA084]',
  },
  sky: {
    badge: 'bg-[#2FA084]/14 text-[#1F6F5F]',
    gradient: 'from-[#2FA084] to-[#6FCF97]',
  },
  amber: {
    badge: 'bg-[#EEEEEE] text-[#1F6F5F]',
    gradient: 'from-[#6FCF97] to-[#2FA084]',
  },
  rose: {
    badge: 'bg-[#1F6F5F]/10 text-[#1F6F5F]',
    gradient: 'from-[#1F6F5F] to-[#6FCF97]',
  },
};

export const StatsRow = () => {
  const { stats } = useDashboardStore();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const c = colorMap[stat.color] || colorMap.emerald;
        const isUp = stat.trend === 'up';
        const isDown = stat.trend === 'down';

        return (
          <div
            key={stat.id}
            className="group relative overflow-hidden rounded-2xl border border-[#1F6F5F]/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(31,111,95,0.12)]"
          >
            {/* Decorative top accent */}
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${c.gradient}`} />

            <p className="text-[13px] font-medium text-[#1F6F5F]/70">{stat.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-3xl font-bold tracking-tight text-[#1F6F5F]">{stat.value}</span>
              <span
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${c.badge}`}
              >
                {isUp && <TrendingUp className="h-3 w-3" />}
                {isDown && <TrendingDown className="h-3 w-3" />}
                {!isUp && !isDown && <Minus className="h-3 w-3" />}
                {stat.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
