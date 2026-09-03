"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  Stethoscope,
  Syringe,
  Salad,
  ClipboardList,
  HelpCircle,
  Sprout,
  Bot,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
  actions?: string[];
  time?: string;
}

const initialMessages: Message[] = [
  {
    id: "msg-1",
    role: "assistant",
    text: "Hi! I'm Flocksy AI.\nHow can I help you today?",
  },
  {
    id: "msg-2",
    role: "user",
    text: "Some birds are not eating and look weak.",
  },
  {
    id: "msg-3",
    role: "assistant",
    text: "It could be due to heat stress or coccidiosis.\n\nWould you like me to run a health check or show possible causes?",
    actions: ["Run Health Check", "Possible Causes", "Talk to Vet"],
  },
];

const topics = [
  { icon: Stethoscope, label: "Symptoms & Diseases" },
  { icon: Syringe, label: "Vaccination Schedule" },
  { icon: Salad, label: "Nutrition Tips" },
  { icon: ClipboardList, label: "Farm Management" },
  { icon: HelpCircle, label: "General Queries" },
];

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    // Simulate smart AI response
    setTimeout(() => {
      let reply = "I'm analyzing that for your flock. Ensure adequate shade and fresh water immediately.";
      let actions: string[] | undefined = ["Run Health Check", "Talk to Vet"];

      if (text.toLowerCase().includes("vaccin")) {
        reply = "For broilers: Lasota (Newcastle) on Day 5-7, IBD (Gumboro) on Day 12-14, booster on Day 21.";
        actions = ["Download Schedule", "Set Reminder"];
      } else if (text.toLowerCase().includes("health") || text.toLowerCase().includes("symptom")) {
        reply = "Based on symptoms, check flock temperature and water intake. Would you like to upload a photo for disease detection?";
        actions = ["Upload Image", "Talk to Vet"];
      } else if (text.toLowerCase().includes("nutrition") || text.toLowerCase().includes("feed")) {
        reply = "Maintain high protein starter feed (22-24% CP) for chicks, transition to finisher (19% CP) after week 3.";
        actions = ["Calculate Feed", "View Suppliers"];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          text: reply,
          actions,
        },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EAF3EA] to-[#D5E9D5] text-[#225424] shadow-xs border border-[#CDE3CD]/80 ring-2 ring-white">
          <Bot className="h-6 w-6" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2922] sm:text-3xl">AI Assistant</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Your 24/7 intelligent poultry farm copilot.</p>
        </div>
      </div>

      {/* Main Grid: Left Chat, Right Topics */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Chat Thread */}
        <div className="flex h-[430px] flex-col justify-between rounded-xl border border-border/80 bg-white p-5 shadow-soft">
          {/* Scrollable messages area */}
          <div className="flex-1 space-y-3.5 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex items-start gap-3", m.role === "user" ? "justify-end" : "justify-start")}
              >
                {m.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF3EA] text-[#225424]">
                    <Sprout className="h-4 w-4" />
                  </div>
                )}

                <div className={cn("max-w-[80%] space-y-2.5", m.role === "user" ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      m.role === "user"
                        ? "relative rounded-br-sm bg-[#E5F2E5] text-foreground"
                        : "rounded-tl-sm border border-border/60 bg-[#F9FAF8] text-foreground"
                    )}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    {m.role === "user" && (
                      <span className="mt-1 flex justify-end text-[#225424]">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Suggestion pills under assistant message */}
                  {m.actions && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {m.actions.map((act) => (
                        <button
                          key={act}
                          type="button"
                          onClick={() => handleSend(act)}
                          className="rounded-lg border border-border/90 bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-2xs transition-colors hover:border-[#225424] hover:bg-[#EAF3EA] hover:text-[#225424]"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="mt-4 pt-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 rounded-full border border-border/80 bg-white px-4 py-1.5 shadow-soft focus-within:border-[#225424] focus-within:ring-1 focus-within:ring-[#225424]"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#205223] text-white transition-opacity hover:bg-[#18401a] disabled:opacity-40"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel: You can ask me about */}
        <div>
          <div className="rounded-xl border border-border/80 bg-white p-5 shadow-soft">
            <h2 className="mb-4 text-sm font-semibold text-foreground">You can ask me about</h2>
            <div className="space-y-2">
              {topics.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleSend(`Tell me about ${label}`)}
                  className="flex w-full items-center gap-3 rounded-xl border border-transparent p-3 text-left transition-colors hover:border-border/60 hover:bg-[#F6F8F5]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F5EF] text-[#225424]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground/90">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}