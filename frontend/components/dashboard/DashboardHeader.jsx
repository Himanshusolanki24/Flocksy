import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Plus, UserRound } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

export const DashboardHeader = () => {
  const { user, searchQuery, setSearchQuery } = useDashboardStore();
  const displayName = user?.name || 'Farm Operator';
  const farmName = user?.farmName || 'Flocksy Demo Farm';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">{greeting},</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900 font-sans">
          {displayName} <span className="text-slate-300 font-normal">/ {farmName}</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-56 rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:w-72 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <Link
          to="/chatbot"
          className="flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.97]"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Case</span>
        </Link>

        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
            3
          </span>
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-sm font-bold text-white shadow-sm">
          {displayName.charAt(0)}
        </div>
      </div>
    </header>
  );
};
