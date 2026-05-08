import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  ChartColumn,
  CheckCircle2,
  Clock3,
  Leaf,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Thermometer,
  Waves,
} from 'lucide-react';

const heroMetrics = [
  { label: 'Live farm signals tracked', value: '128K+' },
  { label: 'Average first response', value: '< 3 min' },
  { label: 'Expert-backed workflows', value: '540+' },
];

const trustStrip = [
  'Poultry disease triage',
  'Crop issue diagnosis',
  'Vet escalation workflows',
  'Environment and feed monitoring',
];

const solutionCards = [
  {
    title: 'AI assistant built for farm reality',
    description:
      'Ask in plain language and get structured answers for poultry, crop, feed, and operational questions.',
    icon: Bot,
  },
  {
    title: 'Operational dashboards that surface action',
    description:
      'Move from passive charts to daily priorities, house-level anomalies, and guided next steps.',
    icon: ChartColumn,
  },
  {
    title: 'Expert escalation without losing context',
    description:
      'Capture symptoms, observations, and treatment history before looping in a veterinarian.',
    icon: Stethoscope,
  },
];

const workflow = [
  {
    step: '01',
    title: 'Capture the problem',
    description:
      'Log symptoms, upload flock images, or describe crop issues in simple language from the field.',
  },
  {
    step: '02',
    title: 'Get a structured AI readout',
    description:
      'Receive likely causes, immediate actions, monitoring points, and safety guidance in a readable format.',
  },
  {
    step: '03',
    title: 'Act with confidence',
    description:
      'Use one place to track environment, feed, treatments, and when to escalate to verified experts.',
  },
];

const operationsSignals = [
  {
    label: 'House 04 temperature',
    value: '24°C',
    note: 'Within target range',
    icon: Thermometer,
  },
  {
    label: 'Humidity stability',
    value: '62%',
    note: 'Monitor litter moisture',
    icon: Waves,
  },
  {
    label: 'Biosecurity readiness',
    value: '92%',
    note: '2 items need review',
    icon: ShieldCheck,
  },
];

const outcomes = [
  'Faster recognition of flock issues before losses spread',
  'Cleaner handoff from AI guidance to veterinary review',
  'Less guesswork around feed, environment, and next actions',
  'A more professional operating rhythm for modern farm teams',
];

export const Home = ({ user }) => {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 pb-20">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(142,155,68,0.08),transparent_34%),radial-gradient(circle_at_top_right,rgba(61,84,56,0.08),transparent_28%),linear-gradient(180deg,#fdfef9_0%,#f3f5ec_100%)]" />

      <section className="relative overflow-hidden rounded-[44px] border border-white/70 bg-[#173122] px-6 py-8 shadow-[0_30px_90px_rgba(10,31,20,0.16)] sm:px-8 lg:px-12 lg:py-12">
        <div className="absolute inset-0">
          <img
            src="/agri-hero.png"
            alt="Agricultural operations"
            className="h-full w-full object-cover opacity-20 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(194,203,161,0.18),transparent_28%),linear-gradient(105deg,rgba(23,49,34,0.96)_0%,rgba(23,49,34,0.9)_38%,rgba(23,49,34,0.62)_68%,rgba(23,49,34,0.88)_100%)]" />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
        </div>

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="py-4 lg:py-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-50/90 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Farm intelligence, designed like real software
            </span>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
              Professional operations for poultry and crop teams that need clarity, not clutter.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-emerald-50/78 sm:text-lg">
              Flocksy brings AI triage, environmental monitoring, crop analysis, and expert escalation into one calm,
              credible workspace. The goal is simple: help teams notice problems earlier and act with better structure.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/dashboard" className="btn-hero h-14 px-8 text-base">
                Open Operations Dashboard
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to={user ? '/chatbot' : '/dashboard'} className="btn-hero-secondary h-14 px-8 text-base">
                {user ? 'Ask the AI Assistant' : 'Preview the Product'}
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="rounded-[26px] border border-white/10 bg-white/8 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold tracking-tight text-white">{metric.value}</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-50/68">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-[34px] border border-white/10 bg-[#F7F7F0] p-5 shadow-[0_24px_60px_rgba(7,23,16,0.22)]">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Operations cockpit</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Today’s farm view</h2>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Live
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                {operationsSignals.map(({ label, value, note, icon: Icon }) => (
                  <div key={label} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EBF0E6] text-[#3D5438]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{label}</p>
                          <p className="mt-1 text-sm text-slate-500">{note}</p>
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-slate-950">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[28px] bg-[#173122] p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/55">Priority signal</p>
                    <h3 className="mt-2 text-xl font-semibold">Respiratory stress rising in Shed 04</h3>
                  </div>
                  <div className="rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-slate-950">Review now</div>
                </div>
                <p className="mt-4 text-sm leading-7 text-emerald-50/76">
                  Ventilation drift and lower feed activity were detected before a major drop in performance. This is what the product
                  should feel like: early notice, context, and a clear next move.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-[32px] border border-slate-200/80 bg-white/70 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] backdrop-blur sm:grid-cols-2 lg:grid-cols-4 lg:p-5">
        {trustStrip.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-[22px] bg-[#F7F8F1] px-4 py-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-[#3D5438]" />
            <span className="text-sm font-medium text-slate-700">{item}</span>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="dashboard-card overflow-hidden bg-[#F7F8F1]">
          <div className="border-b border-slate-200/80 px-8 py-8 sm:px-10">
            <span className="eyebrow">Why It Feels Better</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              Built to look like a serious operations product, not a generic farm app.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              The best agricultural software should feel calm, decisive, and information-rich. That means cleaner hierarchy, better
              spacing, believable metrics, and UI blocks that support real daily work.
            </p>
          </div>

          <div className="grid gap-4 p-8 sm:p-10">
            {outcomes.map((outcome) => (
              <div key={outcome} className="flex items-start gap-4 rounded-[24px] border border-slate-200 bg-white p-5">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#173122] text-white">
                  <Leaf className="h-4 w-4" />
                </div>
                <p className="text-sm leading-7 text-slate-700">{outcome}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          {solutionCards.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="dashboard-card group bg-white p-7 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[#EBF0E6] text-[#3D5438] transition group-hover:bg-[#3D5438] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="dashboard-card overflow-hidden p-0">
          <div className="relative h-full min-h-[420px]">
            <img src="/poultry-farm.png" alt="Poultry farm operations" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,49,34,0.05)_0%,rgba(23,49,34,0.75)_58%,rgba(23,49,34,0.95)_100%)]" />

            <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-10">
              <span className="inline-flex w-fit rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur">
                Operator workflow
              </span>
              <h2 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight text-white">
                One platform for what your team sees, decides, and does next.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-8 text-emerald-50/78">
                The product experience should reassure a serious farm operator: field observations go in, structured action comes out,
                and nothing gets lost between AI advice, monitoring, and expert review.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {workflow.map((item) => (
            <div key={item.step} className="dashboard-card bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#173122] text-sm font-semibold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="dashboard-card bg-[#8E9B44] p-6 text-white">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/74">Designed for daily use</p>
            </div>
            <p className="mt-4 text-base leading-8 text-white/88">
              Better farm software should not feel noisy or experimental. It should feel like a tool an owner, farm manager, or field
              operator can trust every morning.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[38px] border border-[#D8DEC6] bg-[linear-gradient(135deg,#f7f8ef_0%,#eef3df_100%)] px-6 py-10 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:px-8 lg:px-10">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[#C2CBA1]/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-[#D6E4C4]/40 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">Homepage Refresh</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              A stronger first impression for a product that needs to feel human-made and professional.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              This direction gives the home page a more credible software presence while still staying warm and farm-relevant.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/dashboard" className="btn-primary h-12 px-6">
              View Dashboard
            </Link>
            <Link to="/chatbot" className="btn-secondary h-12 px-6">
              Open AI Assistant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
