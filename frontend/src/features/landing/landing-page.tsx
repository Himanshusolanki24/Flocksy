"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ScanSearch,
  CloudSun,
  Store,
  Stethoscope,
  Landmark,
  Mic,
  MessageCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  WifiOff,
  IndianRupee,
  MapPin,
  HeartPulse,
} from "lucide-react";
import { fadeUp, staggerContainer, Reveal, SectionHeading } from "./motion";

export function LandingPage() {
  return (
    <>
      <Hero />
      <Stats />
      <AiShowcase />
      <Benefits />
      <HowItWorks />
      <FarmTypes />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}

/* ============================== Hero ==================================== */

function Hero() {
  const t = useTranslations("landing");
  return (
    <section className="relative overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px] animate-aurora" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-harvest/20 blur-[120px] animate-aurora [animation-delay:4s]" />
      </div>

      <motion.div
        className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-sm font-medium shadow-soft">
            <Sparkles className="h-4 w-4 text-primary" />
            {t("badge")}
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mx-auto mt-6 max-w-4xl text-center text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
        >
          {t("heroTitle1")} <span className="text-primary">{t("heroTitle2")}</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground text-pretty"
        >
          {t("heroSubtitle")}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="xl" className="w-full sm:w-auto">
            <Link href="/register">
              {t("ctaStart")} <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="w-full sm:w-auto">
            <a href="#features">{t("ctaDemo")}</a>
          </Button>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-14">
          <HeroPreview />
        </motion.div>
      </motion.div>
    </section>
  );
}

/** Phone-style AI assistant preview. */
function HeroPreview() {
  const t = useTranslations("landing");
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-b from-primary/15 via-transparent to-harvest/15 blur-2xl" />
      <div className="rounded-[2rem] border bg-card p-4 shadow-lift">
        <div className="mb-3 flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
              <Sparkles className="h-4 w-4 text-primary" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-none">{t("heroPhone")}</p>
              <p className="text-xs text-muted-foreground">हिन्दी · English</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Online
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-3.5 py-2.5">
            मेरी मुर्गियाँ खाना नहीं खा रहीं, क्या करूँ?
          </div>
          <div className="ml-auto max-w-[92%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-primary-foreground shadow-sm">
            <p>Sounds like possible <strong>Coccidiosis</strong>.</p>
            <p className="mt-1 opacity-90">Isolate sick birds, keep water clean, and give a coccidiostat. Want me to connect you with a vet?</p>
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-3.5 py-2.5">हाँ, कृपया।</div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full border bg-background px-4 py-3">
          <Mic className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-xs text-muted-foreground">Ask anything…</span>
          <ScanSearch className="h-4 w-4 text-muted-foreground" />
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================== Stats =================================== */

const stats = [
  { key: "statFarms", value: "25,000+", icon: MapPin },
  { key: "statBirds", value: "3M+", icon: HeartPulse },
  { key: "statUptime", value: "96%", icon: ScanSearch },
  { key: "statStates", value: "12", icon: MapPin },
];

function Stats() {
  const t = useTranslations("landing");
  return (
    <section className="border-y bg-muted/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-14 sm:px-6 lg:grid-cols-4">
        {stats.map(({ key, value, icon: Icon }, i) => (
          <Reveal key={key} delay={i * 0.08} className="text-center">
            <div className="flex items-center justify-center gap-3">
              <Icon className="h-6 w-6 text-primary" />
              <p className="text-3xl font-bold tracking-tight sm:text-4xl">{value}</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t(key)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* =========================== AI Showcase ================================ */

const showcaseFeatures = [
  { icon: ScanSearch, key: "featureHealth", desc: "featureHealthDesc" },
  { icon: CloudSun, key: "featureWeather", desc: "featureWeatherDesc" },
  { icon: Store, key: "featureMarket", desc: "featureMarketDesc" },
  { icon: Stethoscope, key: "featureVet", desc: "featureVetDesc" },
  { icon: Landmark, key: "featureSchemes", desc: "featureSchemesDesc" },
  { icon: Mic, key: "featureVoice", desc: "featureVoiceDesc" },
];

function AiShowcase() {
  const t = useTranslations("landing");
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading eyebrow={t("badge")} title={t("aiShowcaseTitle")} subtitle={t("aiShowcaseSubtitle")} />
      <motion.div
        className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {showcaseFeatures.map(({ icon: Icon, key, desc }) => (
          <motion.div
            key={key}
            variants={fadeUp}
            className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{t(key)}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{t(desc)}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ============================== Benefits ================================ */

const benefits = [
  { icon: MessageCircle, key: "benefitSimple", desc: "benefitSimpleDesc" },
  { icon: WifiOff, key: "benefitOffline", desc: "benefitOfflineDesc" },
  { icon: IndianRupee, key: "benefitCheap", desc: "benefitCheapDesc" },
  { icon: ShieldCheck, key: "benefitLocal", desc: "benefitLocalDesc" },
];

function Benefits() {
  const t = useTranslations("landing");
  return (
    <section className="border-y bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading title={t("benefitsTitle")} />
        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {benefits.map(({ icon: Icon, key, desc }) => (
            <motion.div key={key} variants={fadeUp} className="rounded-2xl border bg-background p-6 shadow-soft">
              <Icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-base font-semibold">{t(key)}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t(desc)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================= How It Works ============================= */

const steps = ["howStep1", "howStep2", "howStep3"];

function HowItWorks() {
  const t = useTranslations("landing");
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading title={t("howTitle")} />
      <motion.div
        className="relative mt-14 grid gap-8 md:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {steps.map((step, i) => (
          <motion.div key={step} variants={fadeUp} className="relative">
            {i < steps.length - 1 ? (
              <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-border via-primary/40 to-border md:block" />
            ) : null}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-glow">
              {i + 1}
            </div>
            <h3 className="mt-5 text-lg font-semibold">{t(`${step}Title`)}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{t(`${step}Desc`)}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ============================= Farm Types =============================== */

const farmTypes = [
  { emoji: "🐔", key: "poultry", desc: "poultryDesc" },
  { emoji: "🐄", key: "dairy", desc: "dairyDesc" },
  { emoji: "🐐", key: "livestock", desc: "livestockDesc" },
  { emoji: "🌾", key: "crops", desc: "cropsDesc" },
];

function FarmTypes() {
  const t = useTranslations("landing");
  return (
    <section id="farm-types" className="border-y bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading title={t("farmTypesTitle")} />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {farmTypes.map(({ emoji, key, desc }, i) => (
            <Reveal key={key} delay={i * 0.08}>
              <div className="flex h-full flex-col items-center rounded-2xl border bg-background p-8 text-center shadow-soft transition-shadow hover:shadow-lift">
                <span className="text-5xl" aria-hidden>
                  {emoji}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{t(key)}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t(desc)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ Testimonials ============================== */

const testimonials = [
  { quote: "testimonial1", name: "testimonial1Name", role: "testimonial1Role", initials: "RP" },
  { quote: "testimonial2", name: "testimonial2Name", role: "testimonial2Role", initials: "SD" },
  { quote: "testimonial3", name: "testimonial3Name", role: "testimonial3Role", initials: "GS" },
];

function Testimonials() {
  const t = useTranslations("landing");
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading title={t("testimonialsTitle")} />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map(({ quote, name, role, initials }, i) => (
          <Reveal key={quote} delay={i * 0.1}>
            <figure className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-soft">
              <div className="mb-3 flex gap-1 text-harvest">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j}>★</span>
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                “{t(quote)}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {initials}
                </span>
                <div>
                  <p className="text-sm font-semibold">{t(name)}</p>
                  <p className="text-xs text-muted-foreground">{t(role)}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================================ FAQ =================================== */

const faqKeys = ["faq1", "faq2", "faq3", "faq4", "faq5"];

function Faq() {
  const t = useTranslations("landing");
  return (
    <section id="faq" className="border-t">
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <SectionHeading title={t("faqTitle")} />
        <Reveal className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {faqKeys.map((key) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="text-base">{t(`${key}Q`)}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{t(`${key}A`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

/* =============================== Final CTA ============================== */

function FinalCta() {
  const t = useTranslations("landing");
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-16">
          <div className="pointer-events-none absolute inset-0 -z-0">
            <div className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-harvest/30 blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">{t("ctaSubtitle")}</p>
            <Button
              asChild
              size="xl"
              className="mt-8 bg-foreground text-background hover:bg-foreground/90"
            >
              <Link href="/register">{t("ctaButton")}</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}