"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Bot, User, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/types";
import { useAssistantStore } from "@/store/use-assistant-store";
import { useStreamingReveal } from "./use-streaming-reveal";
import { MarkdownContent } from "./markdown";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function AssistantMessage({
  message,
  streaming,
  revealText,
  isPinned,
  onTogglePin,
}: {
  message: ChatMessage;
  streaming: boolean;
  revealText: string;
  isPinned: boolean;
  onTogglePin: () => void;
}) {
  const t = useTranslations("assistant");

  if (!message.content && streaming) {
    return (
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </div>
        <div className="flex h-8 items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted px-4">
          <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:120ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:240ms]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Bot className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="inline-flex items-center gap-2 text-sm font-medium">
          <span>Flocksy AI</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            <Sparkles className="h-3 w-3" /> AI
          </span>
        </div>
        <div className="mt-2 rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3">
          <MarkdownContent content={streaming ? revealText : message.content} />
        </div>
        <Button variant="ghost" size="sm" className="mt-1 h-7 px-2 text-xs text-muted-foreground" onClick={onTogglePin}>
          {isPinned ? "📌 " : ""}
          {t(isPinned ? "unpin" : "pin")}
        </Button>
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex items-start justify-end gap-3">
      <div className="max-w-[85%] sm:max-w-[75%]">
        {message.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={message.imageUrl} alt="User upload" className="mb-2 w-full max-w-[220px] rounded-2xl object-cover" />
        ) : null}
        <div className="whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm text-primary-foreground">
          {message.content || "…"}
        </div>
      </div>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <User className="h-5 w-5" />
      </div>
    </div>
  );
}

/** Scrollable message list with auto-scroll while streaming. */
export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const pinned = useAssistantStore((s) => s.pinnedMessageIds);
  const togglePin = useAssistantStore((s) => s.togglePin);
  const composing = useAssistantStore((s) => s.isComposing);
  const endRef = useRef<HTMLDivElement>(null);

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const reveal = useStreamingReveal(composing && lastAssistant ? lastAssistant.content : "", 10, 20);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, reveal.length]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-soft">
          <Bot className="h-9 w-9" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Ask Flocksy AI anything</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Your farming co-pilot in Hinglish — health, weather, markets, schemes and more.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-5 sm:px-6">
      {messages.map((m) =>
        m.role === "user" ? (
          <UserMessage key={m.id} message={m} />
        ) : (
          <AssistantMessage
            key={m.id}
            message={m}
            streaming={composing && m.id === lastAssistant?.id}
            revealText={m.id === lastAssistant?.id ? reveal : m.content}
            isPinned={pinned.includes(m.id)}
            onTogglePin={() => togglePin(m.id)}
          />
        ),
      )}
      <div ref={endRef} className={cn("h-px shrink-0", composing ? "h-2" : "")} />
    </div>
  );
}