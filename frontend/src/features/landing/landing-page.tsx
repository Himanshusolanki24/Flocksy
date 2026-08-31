"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
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
  ArrowRight,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Clock,
  BookOpen,
  TrendingDown,
  Eye,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import {
  motion,
  fadeUp,
  staggerContainer,
  Reveal,
  LineReveal,
  CountUp,
  SectionLabel,
  CurtainPanel,
  useSectionScroll,
  ParallaxLayer,
  HorizontalReveal,
} from "./motion";
import { HeroChat } from "./hero-chat";
import { SkyBackdrop, FoliageCorner, ForestCurtain, ElegantDivider } from "./scenery";

/* =============================== Page ================================== */

export function LandingPage() {
  return (
    <>
      <Hero />
      <TrustRow />
      <Problem />
      <Process />
      <Capabilities />
      <ProductShowcase />
      <Safety />
      <Impact />
      <Voices />
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
      <SkyBackdrop />

      {/* Foliage corners — animated entrance */}
      <motion.div
        initial={{ x: "-12%", opacity: 0 }}
        animate={{ x: "0%", opacity: 0.9 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="hidden lg:block"
      >
        <FoliageCorner side="left" />
      </motion.div>
      <motion.div
        initial={{ x: "12%", opacity: 0 }}
        animate={{ x: "0%", opacity: 0.8 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
        className="hidden lg:block"
      >
        <FoliageCorner side="right" />
      </motion.div>

      <div className="relative mx-auto max-w-4xl px-6 pb-10 pt-20 text-center sm:pt-28">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} className="flex justify-center">
            <SectionLabel>{t("heroKicker")}</SectionLabel>
          </motion.div>

          <h1 className="mt-7 font-display text-[3.25rem] leading-[1.02] tracking-[-0.015em] sm:text-6xl lg:text-7xl">
            <LineReveal
              lines={[
                t("heroTitle1"),
                <em key="2" className="italic text-primary">
                  {t("heroTitle2")}
                </em>,
              ]}
              delay={0.15}
            />
          </h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild size="lg" className="rounded-xl px-7 shadow-glow">
              <Link href="/register">{t("ctaStart")}</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="rounded-xl border bg-card/70 px-7 backdrop-blur"
            >
              <a href="#problem">{t("ctaDemo")}</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Product window — floats on the sky */}
      <div className="relative mx-auto max-w-5xl px-6 pb-24">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-5 text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          {t("demoLabel")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Premium frame glow */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/20 via-transparent to-transparent pointer-events-none" />
          <HeroChat />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mx-auto mt-6 max-w-md text-center text-sm leading-relaxed text-muted-foreground"
        >
          {t("demoSubtitle")}
        </motion.p>
      </div>
    </section>
  );
}

/* ============================= Trust row ================================ */

const partners = [
  "Nashik Poultry Co-op",
  "ICAR Advisory",
  "Bihar Dairy Union",
  "Krishi Vigyan Kendra",
  "Punjab Livestock Board",
];

function TrustRow() {
  const t = useTranslations("landing");
  return (
    <section className="border-y bg-background/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-7 md:flex-row md:items-center md:gap-12">
        <p className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {t("trustedBy")}
        </p>
        <div className="flex flex-wrap gap-x-10 gap-y-3">
          {partners.map((name, i) => (
            <Reveal key={name} delay={i * 0.06}>
              <span className="text-sm font-medium text-foreground/50 hover:text-foreground/70 transition-colors">
                {name}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== Problem ================================= */

const problems = [
  {
    icon: AlertTriangle,
    titleKey: "problem1Title",
    descKey: "problem1Desc",
  },
  {
    icon: Clock,
    titleKey: "problem2Title",
    descKey: "problem2Desc",
  },
  {
    icon: BookOpen,
    titleKey: "problem3Title",
    descKey: "problem3Desc",
  },
  {
    icon: TrendingDown,
    titleKey: "problem4Title",
    descKey: "problem4Desc",
  },
];

function Problem() {
  const t = useTranslations("landing");
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionScroll(sectionRef as React.RefObject<HTMLElement | null>, [
    "start 90%",
    "center center",
  ]);

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative overflow-hidden border-t py-24 sm:py-32"
    >
      {/* Subtle curtain */}
      <ForestCurtain
        sectionRef={sectionRef as React.RefObject<HTMLElement | null>}
        travelVw={22}
        className="opacity-70"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <SectionLabel>{t("problemSectionLabel")}</SectionLabel>
          </Reveal>
          <h2 className="mt-6 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            <LineReveal animateOnScroll lines={[t("problemTitle")]} delay={0.05} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted-foreground text-pretty">
              {t("problemBody")}
            </p>
          </Reveal>
        </div>

        {/* Problem grid */}
        <div className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2">
          {problems.map(({ icon: Icon, titleKey, descKey }, i) => (
            <HorizontalReveal
              key={titleKey}
              progress={progress}
              from={i % 2 === 0 ? "left" : "right"}
              distance={40}
              inputRange={[0.05 + i * 0.05, 0.35 + i * 0.05]}
            >
              <div className="group relative flex flex-col gap-5 bg-background p-8 transition-colors duration-300 hover:bg-card">
                {/* Problem number */}
                <span className="font-display text-[3rem] leading-none text-border group-hover:text-muted/60 transition-colors select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-muted/50">
                    <Icon className="h-4 w-4 text-harvest" strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="font-display text-xl leading-snug">{t(titleKey)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t(descKey)}
                    </p>
                  </div>
                </div>
              </div>
            </HorizontalReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== Process ================================= */

const processSteps = [
  {
    numKey: "processStep1Num",
    titleKey: "processStep1Title",
    descKey: "processStep1Desc",
    icon: Eye,
  },
  {
    numKey: "processStep2Num",
    titleKey: "processStep2Title",
    descKey: "processStep2Desc",
    icon: ScanSearch,
  },
  {
    numKey: "processStep3Num",
    titleKey: "processStep3Title",
    descKey: "processStep3Desc",
    icon: CheckCircle2,
  },
  {
    numKey: "processStep4Num",
    titleKey: "processStep4Title",
    descKey: "processStep4Desc",
    icon: ArrowRight,
  },
];

function Process() {
  const t = useTranslations("landing");

  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      {/* Header */}
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <SectionLabel>{t("processSectionLabel")}</SectionLabel>
        </Reveal>
        <h2 className="mt-6 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
          <LineReveal animateOnScroll lines={[t("howTitle")]} delay={0.05} />
        </h2>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            {t("stepsIntro")}
          </p>
        </Reveal>
      </div>

      {/* Steps — large numbered list */}
      <div className="mt-20 border-t">
        {processSteps.map(({ numKey, titleKey, descKey, icon: Icon }, i) => (
          <Reveal key={titleKey} delay={i * 0.07}>
            <div className="group grid items-start gap-6 border-b py-10 transition-colors duration-200 hover:bg-muted/20 md:grid-cols-[5rem_1fr_1fr] md:gap-12 md:px-2">
              {/* Step number */}
              <div className="flex items-center gap-4 md:block">
                <span className="font-display text-4xl leading-none text-primary/25 group-hover:text-primary/40 transition-colors tabular-nums">
                  {t(numKey)}
                </span>
              </div>

              {/* Step title + icon */}
              <div className="flex items-start gap-4">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="font-display text-2xl leading-tight sm:text-3xl">{t(titleKey)}</h3>
              </div>

              {/* Step description */}
              <div>
                <p className="leading-relaxed text-muted-foreground">{t(descKey)}</p>
                {/* Connector line */}
                {i < processSteps.length - 1 && (
                  <span
                    aria-hidden
                    className="mt-5 block h-px w-8 bg-primary/30 group-hover:w-12 transition-all duration-300"
                  />
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ============================ Capabilities ============================== */

const capabilities = [
  { icon: ScanSearch, key: "featureHealth", desc: "featureHealthDesc" },
  { icon: Stethoscope, key: "featureVet", desc: "featureVetDesc" },
  { icon: CloudSun, key: "featureWeather", desc: "featureWeatherDesc" },
  { icon: Store, key: "featureMarket", desc: "featureMarketDesc" },
  { icon: Landmark, key: "featureSchemes", desc: "featureSchemesDesc" },
  { icon: Mic, key: "featureVoice", desc: "featureVoiceDesc" },
];

function Capabilities() {
  const t = useTranslations("landing");
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-hidden border-t"
    >
      <SkyBackdrop className="opacity-60" />

      {/* Subtle curtain effect for this section */}
      <ForestCurtain
        sectionRef={sectionRef as React.RefObject<HTMLElement | null>}
        travelVw={18}
        withHens
        className="opacity-55"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <SectionLabel>{t("badge")}</SectionLabel>
          </Reveal>
          <h2 className="mt-6 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            <LineReveal animateOnScroll lines={[t("aiShowcaseTitle")]} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted-foreground">
              {t("aiShowcaseSubtitle")}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, key, desc }, i) => (
            <Reveal key={key} delay={(i % 3) * 0.08}>
              <div className="group h-full overflow-hidden rounded-2xl border bg-card/85 p-7 shadow-lift backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                {/* Icon with accent background */}
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 transition-colors group-hover:bg-primary/14">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-display text-xl leading-tight">{t(key)}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{t(desc)}</p>
                {/* Subtle bottom accent */}
                <div className="mt-6 h-px w-0 bg-primary/30 transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================== Product Showcase ============================ */

function ProductShowcase() {
  const t = useTranslations("landing");
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionScroll(sectionRef as React.RefObject<HTMLElement | null>, [
    "start end",
    "center center",
  ]);

  return (
    <section ref={sectionRef} className="relative border-t bg-ink text-ink-foreground overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(92,124,104,0.12) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Reveal>
            <SectionLabel light>{t("showcaseSectionLabel")}</SectionLabel>
          </Reveal>
          <h2 className="mt-6 font-display text-4xl leading-[1.05] text-ink-foreground sm:text-5xl lg:text-6xl">
            <LineReveal
              animateOnScroll
              lines={[t("showcaseTitle")]}
              lineClassName="text-ink-foreground"
            />
          </h2>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-lg leading-relaxed opacity-70 text-pretty">
              {t("showcaseBody")}
            </p>
          </Reveal>
        </div>

        {/* Chat panel with cinematic frame */}
        <HorizontalReveal
          progress={progress}
          from="left"
          distance={60}
          inputRange={[0.05, 0.55]}
          className="mx-auto max-w-3xl"
        >
          <div className="relative">
            {/* Outer glow ring */}
            <div
              className="absolute -inset-px rounded-3xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(92,124,104,0.4) 0%, transparent 50%, rgba(184,98,47,0.2) 100%)",
              }}
            />
            {/* Premium inset frame */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-lift">
              <HeroChat />
            </div>
          </div>
        </HorizontalReveal>

        {/* Supporting claim */}
        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-sm text-center text-sm opacity-55">
            {t("demoSubtitle")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* =============================== Safety ================================= */

const safetyPoints = [
  { icon: UserCheck, title: "safetyPoint1", desc: "safetyPoint1Desc" },
  { icon: ShieldCheck, title: "safetyPoint2", desc: "safetyPoint2Desc" },
];

function Safety() {
  const t = useTranslations("landing");
  return (
    <section className="bg-ink text-ink-foreground border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              <LineReveal
                animateOnScroll
                lines={[
                  t("safetyTitle1"),
                  <em key="2" className="italic opacity-90">
                    {t("safetyTitle2")}
                  </em>,
                ]}
              />
            </h2>
          </div>
          <div>
            <Reveal>
              <p className="text-lg leading-relaxed opacity-80">{t("safetyBody")}</p>
            </Reveal>
            <div className="mt-12 space-y-10">
              {safetyPoints.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={0.1 + i * 0.1}>
                  <div className="border-t border-current/15 pt-6">
                    <Icon className="h-5 w-5 opacity-70" strokeWidth={1.6} />
                    <h3 className="mt-4 text-lg font-medium">{t(title)}</h3>
                    <p className="mt-2 leading-relaxed opacity-70">{t(desc)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================== Impact ================================= */

const figures = [
  { to: 25000, suffix: "+", key: "statFarms" },
  { to: 3, suffix: "M+", key: "statBirds" },
  { to: 96, suffix: "%", key: "statUptime" },
  { to: 12, suffix: "", key: "statStates" },
];

function Impact() {
  const t = useTranslations("landing");
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">
            <LineReveal animateOnScroll lines={[t("impactTitle")]} />
          </h2>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              {t("impactBody")}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <p className="font-display text-[5.5rem] leading-none text-primary sm:text-[7rem]">
            <CountUp to={90} suffix="×" />
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{t("impactStatLabel")}</p>

          <dl className="mt-14 grid grid-cols-2 gap-x-10 gap-y-8 border-t pt-10">
            {figures.map(({ to, suffix, key }) => (
              <div key={key} className="group">
                <dt className="font-display text-4xl leading-none text-foreground">
                  <CountUp to={to} suffix={suffix} />
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground">{t(key)}</dd>
                <div className="mt-3 h-px w-6 bg-primary/30 transition-all duration-300 group-hover:w-10" />
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

/* =============================== Voices ================================= */

const voices = [
  { quote: "testimonial1", name: "testimonial1Name", role: "testimonial1Role" },
  { quote: "testimonial2", name: "testimonial2Name", role: "testimonial2Role" },
  { quote: "testimonial3", name: "testimonial3Name", role: "testimonial3Role" },
];

function Voices() {
  const t = useTranslations("landing");
  return (
    <section className="border-t bg-muted/25">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Reveal>
          <SectionLabel>{t("testimonialsTitle")}</SectionLabel>
        </Reveal>
        <div className="mt-14 grid gap-x-12 gap-y-14 md:grid-cols-3">
          {voices.map(({ quote, name, role }, i) => (
            <Reveal key={quote} delay={i * 0.1}>
              <figure className="border-t pt-6">
                <blockquote className="font-display text-xl leading-snug text-pretty">
                  "{t(quote)}"
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-medium">{t(name)}</span>
                  <span className="mt-0.5 block text-muted-foreground">{t(role)}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
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
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 sm:py-32 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">
          <LineReveal animateOnScroll lines={[t("faqTitle")]} />
        </h2>
        <Reveal>
          <Accordion type="single" collapsible className="w-full">
            {faqKeys.map((key) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline">
                  {t(`${key}Q`)}
                </AccordionTrigger>
                <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">
                  {t(`${key}A`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================== Final CTA ================================ */

function FinalCta() {
  const t = useTranslations("landing");
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative border-t overflow-hidden">
      {/* Environment returns */}
      <SkyBackdrop className="opacity-50" />
      <ForestCurtain
        sectionRef={sectionRef as React.RefObject<HTMLElement | null>}
        travelVw={15}
        withHens
        className="opacity-60"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-28 text-center sm:py-40">
        <Reveal>
          <SectionLabel>{t("ctaEnvLabel")}</SectionLabel>
        </Reveal>
        <h2 className="mx-auto mt-8 max-w-3xl font-display text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
          <LineReveal animateOnScroll lines={[t("ctaTitle")]} />
        </h2>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted-foreground text-pretty">
            {t("ctaSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 shadow-glow">
              <Link href="/register">{t("ctaButton")}</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-full px-8">
              <Link href="/login">
                {t("signIn")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>

        {/* Botanical divider at the bottom */}
        <div className="mt-20 flex justify-center opacity-50">
          <ElegantDivider />
        </div>
      </div>
    </section>
  );
}
