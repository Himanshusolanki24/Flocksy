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
        <p className="text-sm font-medium text-[#1F6F5F]/60">{greeting},</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-[#1F6F5F] font-sans">
          {displayName} <span className="text-[#2FA084]/55 font-normal">/ {farmName}</span>
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
            className="h-10 w-56 rounded-xl border border-[#1F6F5F]/12 bg-white pl-9 pr-4 text-sm text-[#1F6F5F] outline-none transition-all placeholder:text-[#1F6F5F]/40 focus:w-72 focus:border-[#6FCF97] focus:ring-2 focus:ring-[#6FCF97]/25"
          />
        </div>

        <Link
          to="/chatbot"
          className="flex h-10 items-center gap-2 rounded-xl bg-[#1F6F5F] px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#2FA084] hover:shadow-md active:scale-[0.97]"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Case</span>
        </Link>

        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#1F6F5F]/12 bg-white text-[#1F6F5F]/65 transition hover:border-[#6FCF97] hover:text-[#1F6F5F]"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#6FCF97] text-[10px] font-bold text-[#1F6F5F] ring-2 ring-white">
            3
          </span>
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6FCF97] to-[#1F6F5F] text-sm font-bold text-white shadow-sm">
          {displayName.charAt(0)}
        </div>
      </div>
    </header>
  );
};
