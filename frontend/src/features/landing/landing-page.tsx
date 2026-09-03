"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FlocksyAssistant } from "@/components/shared/flocksy-assistant";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Camera,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  Smartphone,
  Sparkles,
  Wheat,
} from "lucide-react";

const featureCards = [
  {
    title: "Disease Detection",
    text: "Upload bird symptoms or photos and get early warning guidance in simple language.",
    icon: Camera,
    className: "bg-[#F5E7D8]",
  },
  {
    title: "Smart Feed",
    text: "Plan feed better with age, weather, flock size and health signals in mind.",
    icon: Wheat,
    className: "bg-[#E8EEDC]",
  },
  {
    title: "Flock Management",
    text: "Track birds, batches, vaccinations and daily work without complicated screens.",
    icon: ClipboardList,
    className: "bg-[#FFF3D0]",
  },
  {
    title: "Farm Insights",
    text: "See health trends, alerts and next actions before small problems become costly.",
    icon: BarChart3,
    className: "bg-[#F2D7CE]",
  },
];

const farmerBenefits = [
  { title: "Easy to Understand", icon: CheckCircle2 },
  { title: "Works on Any Device", icon: Smartphone },
  { title: "Simple Recommendations", icon: Sparkles },
];

export function LandingPage() {
  return (
    <main className="overflow-hidden bg-[#FFF9EF] text-[#173F2A]">
      <Hero />
      <Features />
      <FarmerFirst />
      <HowItWorks />
      <FlocksyAssistant />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative">
      <BotanicalAccent className="absolute left-0 top-16 hidden h-48 w-48 text-[#8FAF82]/35 lg:block" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:pt-6">
        <div className="relative z-10 max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#D9C8B6] bg-white px-4 py-2 text-sm font-semibold text-[#4F5F50] shadow-sm">
            <HeartPulse className="h-4 w-4 text-[#A95A43]" />
            AI poultry care for Indian farms
          </p>
          <h1 className="mt-7 max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-normal text-[#173F2A] sm:text-6xl lg:text-7xl">
            Healthy Flock. Stronger Future.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#586B55]">
            Flocksy brings AI-powered poultry intelligence to everyday farm decisions, helping you spot disease risks, improve feeding and understand your flock with calm, clear recommendations.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl" className="bg-[#1E5638] text-white hover:bg-[#173F2A]">
              <Link href="/register">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="border-[#BFAE9C] bg-white text-[#173F2A] hover:bg-[#E8EEDC]"
            >
              <a href="#how">See How It Works</a>
            </Button>
          </div>
          <div className="mt-10 grid max-w-xl gap-3 text-sm font-semibold text-[#4F5F50] sm:grid-cols-3">
            {["No complex setup", "Clear next steps", "Made for poultry"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-[#1E5638]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[28rem] lg:min-h-[40rem]">
          <div className="absolute inset-x-3 bottom-0 top-10 rounded-[2rem] bg-[#E8EEDC] lg:inset-x-6" />
          <div className="absolute inset-x-8 bottom-8 h-24 rounded-[50%] bg-[#D9C8B6]/45 blur-xl" />
          <Image
            src="/images/flocksy-hero-hen.png"
            alt="Friendly hen with two chicks in an Indian poultry farm"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-contain object-bottom drop-shadow-2xl"
          />
          <div className="absolute right-2 top-8 max-w-[15rem] rounded-2xl border border-[#E7D9C8] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#173F2A] shadow-lift sm:right-10 sm:top-14">
            Hi! I&apos;m Flocksy 👋 How can I help today?
            <span className="absolute -bottom-2 right-10 h-4 w-4 rotate-45 border-b border-r border-[#E7D9C8] bg-white" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="border-y border-[#E7D9C8] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#A95A43]">Flocksy tools</p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal text-[#173F2A] sm:text-5xl">
            Everything You Need, All in One Place
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map(({ title, text, icon: Icon, className }) => (
            <article
              key={title}
              className={`rounded-2xl border border-[#E7D9C8] p-6 shadow-soft transition-transform hover:-translate-y-1 hover:shadow-lift ${className}`}
            >
              <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white text-[#1E5638] shadow-sm">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-bold text-[#173F2A]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#60705E]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FarmerFirst() {
  return (
    <section id="farmer-first" className="relative bg-[#FFF9EF]">
      <BotanicalAccent className="absolute right-0 top-8 hidden h-56 w-56 rotate-180 text-[#8FAF82]/30 lg:block" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="relative min-h-[24rem] overflow-hidden rounded-[2rem] border border-[#E7D9C8] bg-[#F5E7D8] shadow-soft sm:min-h-[32rem]">
          <Image
            src="/images/flocksy-farmer-ai.png"
            alt="Indian poultry farmer using Flocksy on a farm"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center"
          />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#A95A43]">Farmer-first AI</p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal text-[#173F2A] sm:text-5xl">
            Built for Farmers. Backed by AI.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#586B55]">
            Flocksy keeps the technology quiet and the advice practical, so farmers can make decisions quickly during real farm work.
          </p>
          <div className="mt-8 grid gap-4">
            {farmerBenefits.map(({ title, icon: Icon }) => (
              <div key={title} className="flex items-center gap-4 rounded-2xl border border-[#E7D9C8] bg-white p-5 shadow-sm">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8EEDC] text-[#1E5638]">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="text-lg font-bold text-[#173F2A]">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    "Tell Flocksy what you see on the farm.",
    "AI checks health, feed, weather and flock signals.",
    "You get one clear recommendation for the next step.",
  ];

  return (
    <section id="how" className="bg-[#E8EEDC]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#A95A43]">Simple flow</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-[#173F2A] sm:text-5xl">
              From concern to clear action.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-[#CAD6BC] bg-[#FFF9EF] p-5 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1E5638] text-base font-bold text-white">
                  {index + 1}
                </span>
                <p className="mt-5 text-base font-semibold leading-7 text-[#173F2A]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BotanicalAccent({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 220" fill="none" className={className} aria-hidden="true">
      <path d="M26 190C60 123 106 73 181 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M65 129c-25 2-41-8-48-27 25-3 42 7 48 27ZM101 90c-21-9-29-25-24-45 23 8 31 25 24 45ZM129 69c11-22 28-31 50-26-9 24-28 33-50 26ZM89 112c16-19 34-24 55-15-16 20-36 25-55 15ZM49 157c18-13 36-14 53-2-19 14-37 14-53 2Z" fill="currentColor" />
    </svg>
  );
}
