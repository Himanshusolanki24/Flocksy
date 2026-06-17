import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, LayoutDashboard, Stethoscope } from 'lucide-react';
import { LeafIcon } from './Icons';

export const Footer = () => {
  return (
    <footer className="px-4 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur xl:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1F6F5F] text-[#6FCF97] shadow-lg shadow-[#1F6F5F]/20">
                <LeafIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1F6F5F]/70">Flocksy</p>
                <h3 className="text-xl font-serif text-[#1F6F5F]">Professional farm operations dashboard</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#1F6F5F]/65">
              Flocksy brings AI advisory, vet access, crop intelligence, and farm operations into one modern control center built for growing agricultural businesses.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link className="dashboard-card min-w-[150px] p-4" to="/dashboard">
              <LayoutDashboard className="h-5 w-5 text-[#1F6F5F]" />
              <p className="mt-3 text-sm font-semibold text-[#1F6F5F]">Dashboard</p>
              <p className="mt-1 text-sm text-[#1F6F5F]/55">Monitor performance and next actions.</p>
            </Link>
            <Link className="dashboard-card min-w-[150px] p-4" to="/chatbot">
              <Bot className="h-5 w-5 text-[#1F6F5F]" />
              <p className="mt-3 text-sm font-semibold text-[#1F6F5F]">AI Assistant</p>
              <p className="mt-1 text-sm text-[#1F6F5F]/55">Get quick answers and diagnosis support.</p>
            </Link>
            <Link className="dashboard-card min-w-[150px] p-4" to="/vets">
              <Stethoscope className="h-5 w-5 text-[#1F6F5F]" />
              <p className="mt-3 text-sm font-semibold text-[#1F6F5F]">Vet Network</p>
              <p className="mt-1 text-sm text-[#1F6F5F]/55">Book verified experts faster.</p>
            </Link>

          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[#1F6F5F]/10/80 pt-5 text-sm text-[#1F6F5F]/55 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Flocksy. Built for modern agricultural teams.</p>
          <div className="flex gap-5">
            <a href="#" className="transition hover:text-[#1F6F5F]">Privacy</a>
            <a href="#" className="transition hover:text-[#1F6F5F]">Terms</a>
            <a href="#" className="transition hover:text-[#1F6F5F]">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
