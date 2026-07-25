import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboardStore } from '../../store/dashboardStore';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-slate-500">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-600">{p.name}:</span>
          <span className="font-semibold text-slate-900">{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

export const WeeklyTrendChart = () => {
  const { weeklyTrend } = useDashboardStore();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-700">Weekly Trend</h2>
        <div className="flex items-center gap-4 text-[11px] font-medium">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Health
          </span>
          <span className="flex items-center gap-1.5 text-sky-600">
            <span className="h-2 w-2 rounded-full bg-sky-500" /> Feed
          </span>
        </div>
      </div>

      <div className="flex-1 px-2 pb-2 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyTrend} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradHealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradFeed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="health"
              name="Health"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gradHealth)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#10b981' }}
            />
            <Area
              type="monotone"
              dataKey="feed"
              name="Feed"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#gradFeed)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#0ea5e9' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
