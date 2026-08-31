"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { ArrowUp, Camera, Mic, Stethoscope } from "lucide-react";
import { Meter } from "./motion";

/**
 * Scripted assistant transcript that plays itself.
 *
 * This is the page's proof-of-product: a Hindi question with a photo turns
 * into a ranked diagnosis and a vet handoff without the visitor touching
 * anything. It loops, pauses when scrolled off-screen, and collapses to a
 * static transcript under reduced motion.
 */

type Step =
  | { from: "user"; text: string; photo?: boolean }
  | { from: "ai"; kind: "diagnosis" }
  | { from: "ai"; kind: "vet" };

const SCRIPT: Step[] = [
  {
    from: "user",
    text: "मेरी मुर्गियाँ खाना नहीं खा रहीं। क्या करूँ?",
    photo: true,
  },
  { from: "ai", kind: "diagnosis" },
  { from: "user", text: "हाँ, कृपया वेट से बात कराइए।" },
  { from: "ai", kind: "vet" },
];

/** How long the assistant "thinks" before each reply. */
const THINK_MS = [700, 1500, 700, 1300];
/** Beat before the transcript clears and the loop restarts. */
const HOLD_MS = 4600;

export function HeroChat() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();

  const [shown, setShown] = useState(0);
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    if (reduced) {
      setShown(SCRIPT.length);
      return;
    }
    // Pause the loop while the panel is scrolled away — no timers burning in
    // the background, and returning visitors always catch it from the top.
    if (!inView) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => timers.push(setTimeout(resolve, ms)));

    const play = async () => {
      while (!cancelled) {
        for (let i = 0; i < SCRIPT.length; i += 1) {
          if (cancelled) return;
          if (SCRIPT[i].from === "ai") setThinking(true);
          await wait(THINK_MS[i] ?? 900);
          if (cancelled) return;
          setThinking(false);
          setShown(i + 1);
        }
        await wait(HOLD_MS);
        if (cancelled) return;
        setShown(0);
        await wait(600);
      }
    };

    void play();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      setThinking(false);
    };
  }, [inView, reduced]);

  return (
    <div ref={ref} className="mx-auto w-full max-w-3xl">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-lift">
        <WindowBar />

        <div className="grid md:grid-cols-[1fr_15rem]">
          {/* transcript */}
          <div className="flex min-h-[21rem] flex-col justify-end gap-3 p-5 text-sm">
            <AnimatePresence mode="popLayout" initial={false}>
              {SCRIPT.slice(0, shown).map((step, i) => (
                <motion.div
                  key={`${i}-${step.from}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  {step.from === "user" ? (
                    <UserBubble text={step.text} photo={step.photo} />
                  ) : step.kind === "diagnosis" ? (
                    <DiagnosisBubble />
                  ) : (
                    <VetBubble />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {thinking ? (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ml-auto flex w-fit items-center gap-1.5 rounded-full bg-secondary px-3.5 py-2.5"
                >
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-typing"
                      style={{ animationDelay: `${d * 0.18}s` }}
                    />
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <Composer />
          </div>

          {/* evidence rail — what the orchestrator consulted */}
          <EvidenceRail active={shown >= 2} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- pieces -------------------------------- */

function WindowBar() {
  return (
    <div className="flex items-center gap-3 border-b bg-muted/60 px-4 py-2.5">
      <span className="flex gap-1.5" aria-hidden>
        {["bg-harvest/50", "bg-muted-foreground/30", "bg-primary/40"].map(
          (c) => (
            <span key={c} className={`h-2.5 w-2.5 rounded-full ${c}`} />
          ),
        )}
      </span>
      <span className="mx-auto rounded-md bg-background px-3 py-1 text-[11px] text-muted-foreground">
        app.flocksy.ai
      </span>
    </div>
  );
}

function UserBubble({ text, photo }: { text: string; photo?: boolean }) {
  return (
    <div className="ml-auto max-w-[85%] space-y-2 text-right">
      {photo ? (
        <div className="relative ml-auto h-20 w-28 overflow-hidden rounded-lg border bg-secondary">
          {/* The bird the farmer photographed — the thing being diagnosed. An
              empty rectangle made the demo read as a wireframe. */}
          <Image
            src="/images/demo-hen.jpg"
            alt=""
            aria-hidden
            fill
            sizes="112px"
            className="object-cover"
          />
          {/* vision "scan" pass — decorative, pure CSS */}
          <span className="absolute inset-x-0 top-0 h-px bg-primary/70 animate-scan" />
          {/* The label needs its own ground now that it sits on a photo. */}
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2 pb-1 pt-3 text-left text-[10px] text-white/90">
            IMG_0421.jpg
          </span>
        </div>
      ) : null}
      <p className="inline-block rounded-2xl rounded-br-sm bg-secondary px-3.5 py-2.5 text-left">
        {text}
      </p>
    </div>
  );
}

function DiagnosisBubble() {
  return (
    <div className="max-w-[92%] rounded-2xl rounded-bl-sm border bg-background px-4 py-3.5">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
        Likely diagnosis
      </p>
      <p className="mt-1 font-display text-2xl leading-none">कॉक्सीडियोसिस</p>
      {/* The Latin name stays: it is what the label on the medicine says. */}
      <p className="mt-1 text-[11px] text-muted-foreground">Coccidiosis</p>

      <Meter value={87} label="Confidence" className="mt-3" />

      <ul className="mt-3 space-y-1.5 text-[13px] leading-snug text-muted-foreground">
        {[
          "बीमार मुर्गियों को आज ही अलग कर दें",
          "पानी की सभी लाइनें साफ़ करें और दोबारा भरें",
          "दाने में कॉक्सीडियोस्टेट देना शुरू करें",
        ].map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className="mt-2 h-px w-2.5 shrink-0 bg-primary" />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px]">क्या मैं आपको पशु-चिकित्सक से जोड़ूँ?</p>
    </div>
  );
}

function VetBubble() {
  return (
    <div className="flex max-w-[92%] items-center gap-3 rounded-2xl rounded-bl-sm border bg-background px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
        <Stethoscope className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">डॉ. अंजली राव</p>
        <p className="truncate text-xs text-muted-foreground">
          पोल्ट्री वेट · अभी उपलब्ध
        </p>
      </div>
      <span className="ml-auto rounded-full bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground">
        कॉल करें
      </span>
    </div>
  );
}

const EVIDENCE = [
  { label: "Vision model", value: "Coccidiosis · 0.87" },
  { label: "Symptom agent", value: "Matches 4 of 5" },
  { label: "Environment", value: "31°C · 74% RH" },
  { label: "Farm memory", value: "Recurrence, 41 days" },
  { label: "Safety gate", value: "Passed" },
];

/**
 * Shows the agent trace behind the answer. This is the honesty of the
 * product made visible — the reason a farmer should believe the bubble.
 */
function EvidenceRail({ active }: { active: boolean }) {
  return (
    <aside className="hidden border-l bg-muted/30 p-5 md:block">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
        Evidence
      </p>
      <ul className="mt-4 space-y-4">
        {EVIDENCE.map((row, i) => (
          <motion.li
            key={row.label}
            initial={{ opacity: 0, x: 8 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
            transition={{ duration: 0.5, delay: active ? i * 0.1 : 0 }}
          >
            <p className="text-[11px] text-muted-foreground">{row.label}</p>
            <p className="mt-0.5 text-[13px] font-medium">{row.value}</p>
          </motion.li>
        ))}
      </ul>
    </aside>
  );
}

function Composer() {
  return (
    <div className="mt-2 flex items-center gap-2.5 rounded-full border bg-background px-4 py-2.5">
      <Mic className="h-4 w-4 shrink-0 text-muted-foreground" />
      <Camera className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="flex-1 truncate text-xs text-muted-foreground">
        Ask in Hindi or English…
      </span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <ArrowUp className="h-3.5 w-3.5" />
      </span>
    </div>
  );
}
