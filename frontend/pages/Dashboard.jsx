import React, { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { StatsRow } from '../components/dashboard/HeroBanner';
import { HealthAlertsPanel } from '../components/dashboard/HealthAlertsPanel';
import { QuickActionsGrid } from '../components/dashboard/QuickActionsGrid';
import { TaskQueue } from '../components/dashboard/TaskQueue';
import { WeeklyTrendChart } from '../components/dashboard/FarmBalanceChart';
import { FarmBalanceDonut } from '../components/dashboard/LiveSnapshotMetrics';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';

export const Dashboard = ({ user }) => {
  const { fetchSummary, setUser } = useDashboardStore();

  useEffect(() => {
    setUser(user);
    fetchSummary();
  }, [user, setUser, fetchSummary]);

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 pb-10">
      {/* Header */}
      <DashboardHeader />

      {/* Stats Row */}
      <StatsRow />

      {/* Quick Actions */}
      <QuickActionsGrid />

      {/* Main Grid — 3 columns on large screens */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left: Chart */}
        <div className="lg:col-span-7 h-[340px]">
          <WeeklyTrendChart />
        </div>

        {/* Right: Donut + Alerts */}
        <div className="flex flex-col gap-5 lg:col-span-5">
          <div className="h-[340px]">
            <FarmBalanceDonut />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Alerts */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <HealthAlertsPanel />
          </div>
        </div>

        {/* Tasks */}
        <div className="lg:col-span-4 h-[360px]">
          <TaskQueue />
        </div>

        {/* Activity */}
        <div className="lg:col-span-4 h-[360px]">
          <RecentActivityFeed />
        </div>
      </div>
    </div>
  );
};
