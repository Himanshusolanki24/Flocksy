import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  ChartColumn,
  CheckCircle2,
  ChevronDown,
  Leaf,
  Shield,
  Sparkles,
  Stethoscope,
  Thermometer,
  Waves,
  Zap,
} from 'lucide-react';

/* ─── Data ─── */  
const capabilities = [
  'AI Disease Triage',
  'Environment Monitoring',
  'Crop Intelligence',
  'Vet Escalation',
  'Feed Optimization',
  'Biosecurity Tracking',
];

const features = [
  {
    icon: Bot,
    title: 'Intelligent AI Assistant',
    description:
      'Ask questions in plain language about poultry health, crop issues, or feed formulation — and receive structured, expert-level guidance instantly.',
  },
  {
    icon: ChartColumn,
    title: 'Operations Dashboard',
    description:
      'Move beyond passive charts. Surface daily priorities, house-level anomalies, and guided next steps all in one calm workspace.',
  },
  {
    icon: Stethoscope,
    title: 'Expert Vet Network',
    description:
      'Capture symptoms, observations, and treatment history seamlessly. When escalation is needed, the full context travels with the referral.',
  },
  {
    icon: Shield,
    title: 'Biosecurity Engine',
    description:
      'Monitor compliance scores, track entry protocols, and receive automated alerts when standards drift below safe thresholds.',
  },
];

const workflow = [
  {
    step: '01',
    title: 'Observe & Capture',
    description:
      'Log symptoms, upload images, or describe issues in simple language directly from the field.',
  },
  {
    step: '02',
    title: 'AI Analysis',
    description:
      'Receive probable causes, immediate actions, monitoring points, and safety guidance in a structured readout.',
  },
  {
    step: '03',
    title: 'Act with Clarity',
    description:
      'Track environment, feed, treatments, and know exactly when to escalate to verified experts.',
  },
];

const stats = [
  { value: '128K+', label: 'Farm Signals Tracked' },
  { value: '<3 min', label: 'Average Response' },
  { value: '540+', label: 'Expert Workflows' },
  { value: '99.2%', label: 'Uptime Reliability' },
];

/* ─── Animated Counter Hook ─── */
const useInView = (threshold = 0.2) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

/* ─── Home Component ─── */
export const Home = ({ user }) => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [featuresRef, featuresVisible] = useInView(0.15);
  const [workflowRef, workflowVisible] = useInView(0.15);
  const [statsRef, statsVisible] = useInView(0.2);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-0 pb-12">
      {/* ─── Background Ambient ─── */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F8F2] via-[#FAFDF7] to-[#FAFDF7]" />
        <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-[#A8D5B5]/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-[#D4E8D0]/15 blur-[100px]" />
      </div>

      {/* ═══════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════ */}
      <section className="relative mb-12 overflow-hidden rounded-[2rem] lg:rounded-[2.5rem]">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/agri-hero.png"
            alt="Farm operations background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F261C]/95 via-[#1B3A2D]/90 to-[#1B3A2D]/80" />
          {/* Subtle grain */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative z-10 px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div
              className={`transition-all duration-700 ${
                heroVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-6 opacity-0'
              }`}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                AI-Powered Farm Intelligence
              </span>
            </div>

            {/* Title */}
            <h1
              className={`mt-8 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.75rem] transition-all duration-700 delay-150 ${
                heroVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              Professional operations
              <br />
              for teams that need{' '}
              <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                clarity
              </span>
              , not clutter.
            </h1>

            {/* Subtitle */}
            <p
              className={`mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg transition-all duration-700 delay-300 ${
                heroVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              Flocksy brings AI triage, environmental monitoring, crop analysis,
              and expert escalation into one calm, credible workspace — helping
              your team notice problems earlier and act with better structure.
            </p>

            {/* CTAs */}
            <div
              className={`mt-10 flex flex-col gap-3 sm:flex-row transition-all duration-700 delay-[450ms] ${
                heroVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <Link to="/dashboard" className="btn-hero">
                Open Dashboard
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <Link
                to={user ? '/chatbot' : '/dashboard'}
                className="btn-ghost"
              >
                {user ? 'Talk to AI Assistant' : 'Explore the Product'}
              </Link>
            </div>
          </div>

          {/* Capability Chips */}
          <div
            className={`mt-14 flex flex-wrap gap-2.5 transition-all duration-700 delay-[600ms] ${
              heroVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
          >
            {capabilities.map((cap) => (
              <span
                key={cap}
                className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-4 py-2 text-xs font-medium text-white/55 backdrop-blur-sm"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/60" />
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
            Scroll
          </span>
          <ChevronDown className="h-4 w-4 animate-scroll-hint" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 — STATS BAR
      ═══════════════════════════════════════ */}
      <section ref={statsRef} className="mb-16 -mt-2">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`rounded-2xl border bg-white px-5 py-5 text-center transition-all duration-600 ${
                statsVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-6 opacity-0'
              }`}
              style={{
                borderColor: 'rgba(91, 123, 94, 0.1)',
                boxShadow: '0 2px 12px rgba(27, 58, 45, 0.03)',
                animationDelay: `${i * 100}ms`,
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <p className="font-display text-2xl font-bold tracking-tight text-forest sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs font-medium text-[#7B8F80] sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3 — ABOUT / WHY FLOCKSY
      ═══════════════════════════════════════ */}
      <section className="mb-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="space-y-6">
            <span className="eyebrow">About Flocksy</span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-forest sm:text-4xl lg:text-[2.75rem]">
              Built for teams that take farming{' '}
              <span className="text-gradient-forest">seriously</span>
            </h2>
            <p className="text-base leading-relaxed text-[#4A5E50]">
              Modern agricultural operations demand more than spreadsheets and
              guesswork. Flocksy combines AI intelligence, real-time
              environmental sensing, and veterinary expertise into a single
              platform — designed to feel calm, decisive, and
              information-rich.
            </p>
            <p className="text-base leading-relaxed text-[#4A5E50]">
              Whether you manage poultry houses, crop fields, or mixed
              operations — the platform adapts to your workflow, not the other
              way around.
            </p>

            {/* Inline feature list */}
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              {[
                { icon: Zap, text: 'Real-time anomaly detection' },
                { icon: Shield, text: 'Enterprise-grade security' },
                { icon: Leaf, text: 'Farm-aware AI models' },
                { icon: Stethoscope, text: 'Vet network integration' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-xl bg-[#F5F8F2] px-4 py-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest/8">
                    <Icon className="h-4 w-4 text-forest" />
                  </div>
                  <span className="text-sm font-medium text-forest">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <img
                src="/poultry-farm.png"
                alt="Professional poultry farm operations"
                className="h-full w-full object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 left-6 right-6 rounded-2xl border border-white/80 bg-white px-5 py-4 shadow-elevated sm:left-8 sm:right-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B8F80]">
                    Platform Status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-forest">
                    All systems operational
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]" />
                  <span className="text-xs font-semibold text-emerald-600">
                    Live
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 4 — FEATURES
      ═══════════════════════════════════════ */}
      <section ref={featuresRef} className="mb-20">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">Core Features</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-forest sm:text-4xl">
            Everything your operation needs,{' '}
            <span className="text-gradient-forest">nothing it doesn't</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className={`group rounded-2xl border bg-white p-6 transition-all duration-500 hover:shadow-medium sm:p-7 ${
                featuresVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{
                borderColor: 'rgba(91, 123, 94, 0.1)',
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0F5ED] transition-colors duration-300 group-hover:bg-forest group-hover:text-white">
                  <Icon className="h-5 w-5 text-forest group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold tracking-tight text-forest">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4A5E50]">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 5 — WORKFLOW
      ═══════════════════════════════════════ */}
      <section ref={workflowRef} className="mb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16 items-start">
          {/* Left: Workflow Content */}
          <div>
            <span className="eyebrow">How It Works</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-forest sm:text-4xl">
              From observation to action,{' '}
              <span className="text-gradient-forest">simplified</span>
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#4A5E50]">
              Every interaction follows a natural rhythm — capture the problem,
              let AI analyze it, and act with full confidence.
            </p>

            <div className="mt-8 space-y-4">
              {workflow.map((item, i) => (
                <div
                  key={item.step}
                  className={`flex items-start gap-4 rounded-2xl border bg-white p-5 transition-all duration-500 ${
                    workflowVisible
                      ? 'translate-x-0 opacity-100'
                      : '-translate-x-6 opacity-0'
                  }`}
                  style={{
                    borderColor: 'rgba(91, 123, 94, 0.1)',
                    boxShadow: '0 2px 12px rgba(27, 58, 45, 0.03)',
                    transitionDelay: `${i * 150}ms`,
                  }}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest text-sm font-bold text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-forest">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#4A5E50]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Live Signal Card */}
          <div className="space-y-4 lg:sticky lg:top-8">
            {/* Operations Preview */}
            <div
              className="overflow-hidden rounded-2xl border bg-white"
              style={{
                borderColor: 'rgba(91, 123, 94, 0.1)',
                boxShadow: '0 8px 40px rgba(27, 58, 45, 0.06)',
              }}
            >
              <div className="border-b px-6 py-5" style={{ borderColor: 'rgba(91, 123, 94, 0.08)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B8F80]">
                      Operations Cockpit
                    </p>
                    <h3 className="mt-1 font-display text-xl font-semibold text-forest">
                      Today's Farm View
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-5">
                {[
                  {
                    icon: Thermometer,
                    label: 'House 04 Temperature',
                    value: '24°C',
                    status: 'Within target',
                  },
                  {
                    icon: Waves,
                    label: 'Humidity Stability',
                    value: '62%',
                    status: 'Monitor litter',
                  },
                  {
                    icon: Shield,
                    label: 'Biosecurity Score',
                    value: '92%',
                    status: '2 items pending',
                  },
                ].map(({ icon: Icon, label, value, status }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl border px-4 py-3.5"
                    style={{
                      borderColor: 'rgba(91, 123, 94, 0.08)',
                      background: '#FAFDF7',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest/6">
                        <Icon className="h-4 w-4 text-forest" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-forest">
                          {label}
                        </p>
                        <p className="text-xs text-[#7B8F80]">{status}</p>
                      </div>
                    </div>
                    <span className="text-base font-semibold text-forest">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Priority Alert */}
              <div className="mx-5 mb-5 rounded-xl bg-forest p-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                      Priority Signal
                    </p>
                    <h4 className="mt-1.5 font-display text-base font-semibold">
                      Respiratory stress rising in Shed 04
                    </h4>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold text-forest">
                    Review
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  Ventilation drift and lower feed activity detected. Early
                  notice with context and a clear next move.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 6 — CTA BANNER
      ═══════════════════════════════════════ */}
      <section className="overflow-hidden rounded-[2rem]">
        <div className="relative bg-gradient-to-br from-forest via-forest-deep to-[#0D1F16] px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          {/* Decorative orbs */}
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-mint/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-amber/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 backdrop-blur-sm">
                <Zap className="h-3 w-3 text-amber-400" />
                Get Started Today
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                A stronger first impression for a product that feels{' '}
                <span className="text-amber-300">human-made</span> and
                professional.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/50">
                Better farm software should feel like a tool an owner, farm
                manager, or field operator can trust every morning.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/dashboard" className="btn-hero">
                View Dashboard
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to="/chatbot" className="btn-ghost">
                Open AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
