import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Stethoscope, Bookmark, ArrowUpRight } from 'lucide-react';

const ACTIONS = [
  {
    id: 'new-case',
    label: 'AI Diagnosis',
    desc: 'Symptom analysis',
    icon: Bot,
    to: '/chatbot',
    bg: 'bg-[#6FCF97]/20 text-[#1F6F5F]',
  },
  {
    id: 'book-doc',
    label: 'Book Vet',
    desc: 'Find specialists',
    icon: Stethoscope,
    to: '/vets',
    bg: 'bg-[#2FA084]/14 text-[#1F6F5F]',
  },

  {
    id: 'protocols',
    label: 'Protocols',
    desc: 'Saved workflows',
    icon: Bookmark,
    to: '/dashboard',
    bg: 'bg-[#EEEEEE] text-[#1F6F5F]',
  },
];

export const QuickActionsGrid = () => {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-[#1F6F5F]">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {ACTIONS.map(({ id, label, desc, icon: Icon, to, bg }) => (
          <Link
            key={id}
            to={to}
            className="group flex flex-col items-center gap-2.5 rounded-2xl border border-[#1F6F5F]/10 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#6FCF97] hover:shadow-[0_16px_34px_rgba(31,111,95,0.12)]"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} transition-transform group-hover:scale-110`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#1F6F5F]">{label}</p>
              <p className="mt-0.5 text-[11px] text-[#1F6F5F]/55">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
