import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useDashboardStore } from '../../store/dashboardStore';

export const FarmBalanceDonut = () => {
  const { chartData } = useDashboardStore();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#1F6F5F]/10 bg-white shadow-sm">
      <div className="border-b border-[#1F6F5F]/10 px-5 py-4">
        <h2 className="text-sm font-semibold text-[#1F6F5F]">Focus Areas</h2>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-5 py-4">
        <div className="relative h-36 w-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={62}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                animationDuration={1200}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-[#1F6F5F]">100%</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-[#1F6F5F]/45">Total</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {chartData.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs text-[#1F6F5F]/70">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color || '#2FA084' }} />
              <span className="font-medium">{item.label}</span>
              <span className="text-[#1F6F5F]/45">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
