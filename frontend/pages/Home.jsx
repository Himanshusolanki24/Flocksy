import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Bird,
  ChevronDown,
  Globe2,
  Heart,
  Menu,
  ShieldCheck,
  Star,
  Stethoscope,
  Target,
} from 'lucide-react';

const featureCards = [
  {
    title: 'Detect Early',
    text: 'Identify diseases early and stay one step ahead.',
    icon: Target,
  },
  {
    title: 'Expert Help',
    text: 'Get guidance from poultry health experts.',
    icon: Stethoscope,
  },
  {
    title: 'Better Results',
    text: 'Healthier birds, higher productivity, better profits.',
    icon: BarChart3,
  },
];

const stats = [
  { value: '10K+', label: ['Farmers', 'Trust Us'], icon: Heart },
  { value: '95%', label: ['Disease Detection', 'Accuracy'], icon: ShieldCheck },
  { value: '3M+', label: ['Birds Health', 'Monitored'], icon: Bird },
  { value: '4.8/5', label: ['Farmer', 'Satisfaction'], icon: Star },
];

export const Home = () => {
  return (
    <main className="relative h-screen flex flex-col overflow-hidden bg-[#f5f3ef]" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>

      {/* ── Background: Use the reference chicken photo with proper fade ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* The chicken photo as full background, positioned right */}
        <img
          src="/hero-chicken-bg.png"
          alt=""
          className="absolute top-0 right-0 h-full w-[70%] object-cover object-[center_20%]"
        />
        {/* Smooth left-to-right fade to blend chicken into background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, #f5f3ef 30%, rgba(245,243,239,0.92) 38%, rgba(245,243,239,0.5) 50%, rgba(245,243,239,0) 62%)'
        }} />
        {/* Bottom fade for the stats bar */}
        <div className="absolute inset-x-0 bottom-0 h-[25%]" style={{
          background: 'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0) 100%)'
        }} />
      </div>

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <header className="relative z-30 flex items-center justify-between px-[3%] shrink-0" style={{ height: '8%' }}>
        <Link to="/" className="flex items-center gap-3" aria-label="Flocksy home">
          <img src="/flocksy-logo.jpeg" alt="" style={{ height: '5.5vh' }} className="object-contain" />
          <div>
            <p style={{ fontSize: 'clamp(1rem, 2.4vw, 1.6rem)' }} className="font-black leading-none tracking-wide text-[#1a3c34]">FLOCKSY</p>
            <p style={{ fontSize: 'clamp(0.55rem, 1.1vw, 0.8rem)' }} className="mt-[2px] font-medium leading-none text-[#1a3c34]/60">AI for Poultry Health</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center" style={{ gap: 'clamp(1.5rem, 3vw, 3rem)' }}>
          {[
            { to: '/', label: 'Home', active: true },
            { to: '/dashboard', label: 'Poultry Health' },
            { to: '/chatbot', label: 'AI Assistant' },
            { to: '/vets', label: 'About Us' },
          ].map(({ to, label, active }) => (
            <Link
              key={label}
              to={to}
              style={{ fontSize: 'clamp(0.8rem, 1.3vw, 1.1rem)' }}
              className={`whitespace-nowrap font-semibold transition relative pb-1 ${active ? 'text-[#1a6b52]' : 'text-[#1a3c34]/65 hover:text-[#1a6b52]'}`}
            >
              {label}
              {active && <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-[#1a6b52]" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden md:flex items-center gap-2 rounded-full bg-white/90 border border-[#e8e8e6] shadow-sm backdrop-blur-sm hover:bg-white transition"
            style={{ height: '4.8vh', padding: '0 clamp(0.7rem, 1.3vw, 1.2rem)', fontSize: 'clamp(0.7rem, 1.1vw, 0.95rem)' }}
          >
            <Globe2 style={{ width: '2vh', height: '2vh' }} className="text-[#1a6b52]" />
            <span className="font-medium text-[#1a3c34]">English</span>
            <ChevronDown style={{ width: '1.6vh', height: '1.6vh' }} className="text-[#1a6b52]/60" />
          </button>
          <button
            type="button"
            aria-label="Open menu"
            className="flex items-center justify-center rounded-full bg-[#1a6b52] text-white shadow-[0_6px_20px_rgba(26,107,82,0.3)] hover:bg-[#22836a] transition"
            style={{ height: '4.8vh', width: '4.8vh' }}
          >
            <Menu style={{ width: '2.4vh', height: '2.4vh' }} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <div className="relative z-20 flex-1 flex items-center px-[3%] min-h-0">

        {/* Left Column */}
        <div className="w-[45%] flex flex-col justify-center relative z-10">
          {/* Headline */}
          <h1
            className="font-black leading-[1.08] tracking-[-0.03em] text-[#1a3c34]"
            style={{ fontSize: 'clamp(2rem, 4.2vw, 4.5rem)' }}
          >
            Stronger Flocks.
            <br />
            Happier Farms.
            <br />
            <span className="text-[#2fa97e]">Better Tomorrow.</span>
          </h1>

          {/* Accent bar */}
          <div className="mt-[1.5vh] h-[4px] rounded-full bg-[#2fa97e]" style={{ width: 'clamp(3rem, 5vw, 5rem)' }} />

          {/* Subtitle */}
          <p
            className="mt-[2vh] font-medium leading-[1.5] text-[#3a5a50]/75"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.2rem)', maxWidth: '22vw' }}
          >
            Simple AI tools to detect, protect and improve your poultry health.
          </p>

          {/* CTA Area */}
          <div className="mt-[3vh] relative">
            {/* Glow */}
            <div className="absolute -inset-4 rounded-full bg-[#5ec99b]/25 blur-[30px] pointer-events-none" />

            {/* Button */}
            <Link
              to="/chatbot"
              className="relative z-10 group inline-flex items-center rounded-full border-[3px] border-white/80 bg-gradient-to-r from-[#2fa97e] via-[#1a7d5a] to-[#145e44] text-white shadow-[0_12px_35px_rgba(26,107,82,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_45px_rgba(26,107,82,0.4)]"
              style={{ padding: 'clamp(4px, 0.5vh, 8px)', paddingRight: 'clamp(12px, 1.5vw, 28px)', gap: 'clamp(8px, 1vw, 18px)' }}
            >
              <div className="relative shrink-0">
                <img
                  src="/landing-bot.png"
                  alt=""
                  className="rounded-full object-cover bg-[#7dd4a8] shadow-[inset_0_0_12px_rgba(255,255,255,0.4)] border-2 border-white/25"
                  style={{ height: 'clamp(48px, 7vh, 80px)', width: 'clamp(48px, 7vh, 80px)' }}
                />
                <div
                  className="absolute -top-1 right-0 flex items-center justify-center rounded-full bg-[#5ec99b] font-bold text-white shadow border-2 border-white"
                  style={{ height: 'clamp(18px, 2.5vh, 28px)', width: 'clamp(18px, 2.5vh, 28px)', fontSize: 'clamp(7px, 1vh, 11px)' }}
                >
                  AI
                </div>
              </div>
              <span className="flex-1 min-w-0">
                <span className="block font-extrabold leading-tight" style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1.5rem)' }}>Ask Flocksy AI</span>
                <span className="block font-medium text-white/85 leading-tight mt-[1px]" style={{ fontSize: 'clamp(0.6rem, 1.1vw, 1rem)' }}>Your Poultry Health Assistant</span>
              </span>
              <span
                className="shrink-0 flex items-center justify-center rounded-full bg-white text-[#145e44] transition-transform duration-300 group-hover:translate-x-1"
                style={{ height: 'clamp(32px, 4.5vh, 52px)', width: 'clamp(32px, 4.5vh, 52px)' }}
              >
                <ArrowRight style={{ height: 'clamp(16px, 2.2vh, 28px)', width: 'clamp(16px, 2.2vh, 28px)' }} strokeWidth={2.5} />
              </span>
            </Link>

          </div>
        </div>

        {/* Right Column – Feature Cards */}
        <div className="hidden lg:flex flex-col w-[26%] max-w-[300px] z-20 ml-auto" style={{ gap: 'clamp(8px, 1.5vh, 16px)' }}>
          {featureCards.map(({ title, text, icon: Icon }) => (
            <article
              key={title}
              className="group flex items-start rounded-[14px] bg-white/90 backdrop-blur-sm shadow-[0_6px_24px_rgba(0,0,0,0.06)] border border-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
              style={{ padding: 'clamp(10px, 1.5vh, 18px)', gap: 'clamp(8px, 1vw, 14px)' }}
            >
              <div
                className="shrink-0 flex items-center justify-center rounded-full bg-[#e8f5ee] text-[#1a6b52]"
                style={{ height: 'clamp(36px, 5vh, 56px)', width: 'clamp(36px, 5vh, 56px)' }}
              >
                <Icon style={{ height: 'clamp(18px, 2.5vh, 28px)', width: 'clamp(18px, 2.5vh, 28px)' }} strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold leading-tight text-[#1a3c34]" style={{ fontSize: 'clamp(0.7rem, 1.3vw, 1rem)' }}>{title}</p>
                <p className="mt-[3px] font-medium leading-snug text-[#1a3c34]/55" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)' }}>{text}</p>
                <div className="mt-[5px] h-[2.5px] w-5 rounded-full bg-[#2fa97e]" />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ═══════════════ BOTTOM WAVE + STATS BAR ═══════════════ */}
      <div className="relative z-30 w-full shrink-0">
        {/* Wave */}
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute bottom-[100%] left-0 w-full" style={{ height: 'clamp(20px, 4vh, 50px)' }} aria-hidden="true">
          <path fill="white" d="M0 40C130 52 280 22 430 30C570 36 650 56 780 48C920 38 990 10 1120 14C1240 18 1350 45 1440 38V60H0V40Z" />
        </svg>

        {/* Stats bar */}
        <div className="relative bg-white px-[3%] shadow-[0_-6px_20px_rgba(0,0,0,0.03)]" style={{ paddingTop: 'clamp(4px, 1vh, 12px)', paddingBottom: 'clamp(4px, 1vh, 12px)' }}>
          <div className="flex items-center justify-between w-full">

            {/* Stats */}
            <div className="flex flex-1 items-center justify-between mr-[2vw]">
              {stats.map(({ value, label, icon: Icon }, index) => (
                <div key={value} className="flex items-center" style={{ gap: 'clamp(4px, 0.6vw, 12px)' }}>
                  <div
                    className="shrink-0 flex items-center justify-center rounded-full border-[1.5px] border-[#1a6b52]/20 text-[#1a6b52]"
                    style={{ height: 'clamp(28px, 4.5vh, 48px)', width: 'clamp(28px, 4.5vh, 48px)' }}
                  >
                    <Icon style={{ height: 'clamp(14px, 2vh, 24px)', width: 'clamp(14px, 2vh, 24px)' }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-extrabold leading-none text-[#1a6b52]" style={{ fontSize: 'clamp(0.8rem, 1.7vw, 1.4rem)' }}>{value}</p>
                    <p className="font-semibold leading-tight text-[#1a3c34]/55" style={{ fontSize: 'clamp(0.45rem, 0.85vw, 0.7rem)', marginTop: '2px' }}>
                      {label[0]}<br />{label[1]}
                    </p>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="hidden lg:block h-[4vh] w-px bg-[#1a6b52]/12" style={{ margin: '0 clamp(4px, 0.8vw, 16px)' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Trust badge */}
            <div
              className="hidden md:flex shrink-0 items-center rounded-[12px] bg-[#eef6f1] shadow-[0_4px_16px_rgba(0,0,0,0.04)] relative overflow-hidden"
              style={{ height: 'clamp(52px, 8vh, 90px)', width: 'clamp(220px, 24vw, 380px)', padding: '0 clamp(6px, 0.8vw, 16px)', gap: 'clamp(4px, 0.6vw, 12px)' }}
            >
              <div className="relative h-full shrink-0" style={{ width: 'clamp(60px, 7vw, 120px)' }}>
                <img
                  src="/landing-farmers.png"
                  alt="Farmer couple"
                  className="absolute bottom-0 left-[-4px] object-cover object-bottom"
                  style={{ width: 'clamp(70px, 8vw, 140px)', maxHeight: '130%' }}
                />
              </div>
              <p className="font-medium leading-snug text-[#1a3c34] z-10" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 1.3rem)' }}>
                Built for <span className="font-extrabold text-[#1a6b52]">Farmers.</span>
                <br />
                Backed by{' '}
                <span className="relative font-extrabold text-[#2fa97e]">
                  Trust.
                  <svg className="absolute -bottom-[2px] left-0 w-full text-[#2fa97e]" viewBox="0 0 72 10" fill="none">
                    <path d="M2 8C20 2 45 1.5 70 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};
