"use client";

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
} from "lucide-react";
import {
  motion,
  fadeUp,
  staggerContainer,
  Reveal,
  LineReveal,
  CountUp,
  SectionLabel,
} from "./motion";
import { HeroChat } from "./hero-chat";
import { SkyBackdrop, FoliageCorner } from "./scenery";

export function LandingPage() {
  return (
    <>
      <Hero />
      <TrustRow />
      <Steps />
      <Capabilities />
      <Safety />
      <Impact />
      <Voices />
      <Faq />
      <FinalCta />
    </>
  );
}

/* ============================== Hero ==================================== */

/**
 * Centred hero over painted sky, with foliage hanging into both corners and
 * the product window floating on top — the whole section is one scene rather
 * than text on a flat ground.
 */
function Hero() {
  const t = useTranslations("landing");

  return (
    <section className="relative overflow-hidden">
      <SkyBackdrop />
      <FoliageCorner side="left" className="hidden opacity-90 lg:block" />
      <FoliageCorner side="right" className="hidden opacity-80 lg:block" />

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
            <Button asChild size="lg" className="rounded-xl px-7">
              <Link href="/register">{t("ctaStart")}</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="rounded-xl border bg-card/70 px-7 backdrop-blur"
            >
              <a href="#how">{t("ctaDemo")}</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* product window floats on the same sky, not on a new flat band */}
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
        >
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
    <section className="border-y">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:gap-12">
        <p className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {t("trustedBy")}
        </p>
        <div className="flex flex-wrap gap-x-10 gap-y-3">
          {partners.map((name, i) => (
            <Reveal key={name} delay={i * 0.06}>
              <span className="text-sm text-muted-foreground/80">{name}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================== Steps ================================== */

const steps = [
  { key: "howStep1", bullets: ["howStep1Bullet1", "howStep1Bullet2"] },
  { key: "howStep2", bullets: ["howStep2Bullet1", "howStep2Bullet2"] },
  { key: "howStep3", bullets: ["howStep3Bullet1", "howStep3Bullet2"] },
];

function Steps() {
  const t = useTranslations("landing");
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl leading-[1.05] sm:text-6xl">
          <LineReveal animateOnScroll lines={[t("howTitle")]} />
        </h2>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted-foreground">
            {t("stepsIntro")}
          </p>
        </Reveal>
      </div>

      <div className="mt-16 border-t">
        {steps.map(({ key, bullets }, i) => (
          <Reveal key={key} delay={i * 0.06}>
            <div className="grid gap-6 border-b py-10 md:grid-cols-[5rem_1fr_1fr] md:gap-10">
              <span className="font-display text-3xl leading-none text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-2xl leading-tight sm:text-3xl">
                {t(`${key}Title`)}
              </h3>
              <div>
                <p className="leading-relaxed text-muted-foreground">{t(`${key}Desc`)}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-primary" />
                      {t(b)}
                    </li>
                  ))}
                </ul>
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
  return (
    <section id="features" className="relative overflow-hidden border-t">
      <SkyBackdrop className="opacity-70" />
      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>{t("badge")}</SectionLabel>
          <h2 className="mt-6 font-display text-4xl leading-[1.05] sm:text-6xl">
            <LineReveal animateOnScroll lines={[t("aiShowcaseTitle")]} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted-foreground">
              {t("aiShowcaseSubtitle")}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, key, desc }, i) => (
            <Reveal key={key} delay={(i % 3) * 0.08}>
              <div className="h-full rounded-2xl border bg-card/85 p-7 shadow-lift backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
                <Icon className="h-5 w-5 text-primary" strokeWidth={1.6} />
                <h3 className="mt-4 text-lg font-medium">{t(key)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(desc)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================== Safety ================================= */

const safetyPoints = [
  { icon: UserCheck, title: "safetyPoint1", desc: "safetyPoint1Desc" },
  { icon: ShieldCheck, title: "safetyPoint2", desc: "safetyPoint2Desc" },
];

/**
 * The one inverted section. Flocksy's safety gate is the most trust-critical
 * thing on the page, so it gets the page's only change of ground.
 */
function Safety() {
  const t = useTranslations("landing");
  return (
    <section className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-6xl">
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
          <p className="font-display text-[5rem] leading-none text-primary sm:text-[7rem]">
            <CountUp to={90} suffix="×" />
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{t("impactStatLabel")}</p>

          <dl className="mt-14 grid grid-cols-2 gap-x-10 gap-y-8 border-t pt-10">
            {figures.map(({ to, suffix, key }) => (
              <div key={key}>
                <dt className="font-display text-4xl leading-none">
                  <CountUp to={to} suffix={suffix} />
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground">{t(key)}</dd>
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
    <section className="border-t bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <SectionLabel>{t("testimonialsTitle")}</SectionLabel>
        <div className="mt-14 grid gap-x-12 gap-y-14 md:grid-cols-3">
          {voices.map(({ quote, name, role }, i) => (
            <Reveal key={quote} delay={i * 0.1}>
              <figure className="border-t pt-6">
                <blockquote className="font-display text-xl leading-snug text-pretty">
                  “{t(quote)}”
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

/* =============================== Final CTA ============================== */

function FinalCta() {
  const t = useTranslations("landing");
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-28 text-center sm:py-40">
        <h2 className="mx-auto max-w-3xl font-display text-4xl leading-[1.05] text-balance sm:text-6xl">
          <LineReveal animateOnScroll lines={[t("ctaTitle")]} />
        </h2>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted-foreground text-pretty">
            {t("ctaSubtitle")}
          </p>
          <Button asChild size="lg" className="mt-10 rounded-full px-8">
            <Link href="/register">{t("ctaButton")}</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
