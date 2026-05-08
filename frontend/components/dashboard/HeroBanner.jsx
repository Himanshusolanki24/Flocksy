import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

const colorMap = {
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    ring: 'ring-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  sky: {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    ring: 'ring-sky-100',
    badge: 'bg-sky-100 text-sky-700',
    gradient: 'from-sky-500 to-sky-600',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    ring: 'ring-amber-100',
    badge: 'bg-amber-100 text-amber-700',
    gradient: 'from-amber-500 to-amber-600',
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    ring: 'ring-rose-100',
    badge: 'bg-rose-100 text-rose-700',
    gradient: 'from-rose-500 to-rose-600',
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
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Decorative top accent */}
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${c.gradient}`} />

            <p className="text-[13px] font-medium text-slate-500">{stat.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-3xl font-bold tracking-tight text-slate-900">{stat.value}</span>
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
