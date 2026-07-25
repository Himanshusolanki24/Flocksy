import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Stethoscope, Sprout, Bookmark, ArrowUpRight } from 'lucide-react';

const ACTIONS = [
  {
    id: 'new-case',
    label: 'AI Diagnosis',
    desc: 'Symptom analysis',
    icon: Bot,
    to: '/chatbot',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 text-violet-600',
  },
  {
    id: 'book-doc',
    label: 'Book Vet',
    desc: 'Find specialists',
    icon: Stethoscope,
    to: '/vets',
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50 text-sky-600',
  },
  {
    id: 'crop-review',
    label: 'Crop Advisor',
    desc: 'Field diagnosis',
    icon: Sprout,
    to: '/crop-advisor',
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'protocols',
    label: 'Protocols',
    desc: 'Saved workflows',
    icon: Bookmark,
    to: '/dashboard',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50 text-amber-600',
  },
];

export const QuickActionsGrid = () => {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-700">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {ACTIONS.map(({ id, label, desc, icon: Icon, to, bg }) => (
          <Link
            key={id}
            to={to}
            className="group flex flex-col items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-slate-300"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} transition-transform group-hover:scale-110`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-800">{label}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
