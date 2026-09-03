"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageSquarePlus, Trash2, Sparkles } from "lucide-react";
import { useAssistantStore } from "@/store/use-assistant-store";
import { useAiChat } from "@/lib/queries";
import { uid } from "@/lib/utils";
import { generateReply } from "./reply";
import { MessageList } from "./message-list";
import { Composer } from "./composer";
import { Button } from "@/components/ui/button";
import { newChat } from "./history";

const suggestions = [
  "My chicken is not eating, what should I do?",
  "Best feed mix for dairy cows",
  "Monsoon readiness checklist",
  "Broiler vaccination schedule",
];

export function ChatView() {
  const t = useTranslations("assistant");
  const conversations = useAssistantStore((s) => s.conversations);
  const activeId = useAssistantStore((s) => s.activeConversationId);
  const addUserMessage = useAssistantStore((s) => s.addUserMessage);
  const appendAssistantMessage = useAssistantStore(
    (s) => s.appendAssistantMessage,
  );
  const setComposing = useAssistantStore((s) => s.setComposing);
  const clearConversation = useAssistantStore((s) => s.clearConversation);
  const aiChat = useAiChat();
  const [busy, setBusy] = useState(false);

  const active = conversations.find((c) => c.id === activeId);
  const isComposing = useAssistantStore((s) => s.isComposing);

  const send = async (text: string, imageUrl?: string) => {
    if (busy) return;
    const conversationId = addUserMessage(
      text || (imageUrl ? "Analyze this photo" : ""),
      imageUrl,
    );
    setBusy(true);
    setComposing(true);

    let reply = generateReply(text);
    try {
      const res = await aiChat.mutateAsync({ query: text || "diagnose image" });
      if (res?.advice) reply = res.advice;
    } catch {
      // fallback to local reply — backend offline
    }

    const assistantMessage = {
      id: uid("msg"),
      role: "assistant" as const,
      content: reply,
      timestamp: new Date().toISOString(),
    };
    setTimeout(() => {
      appendAssistantMessage(conversationId, assistantMessage);
      setComposing(false);
      setBusy(false);
    }, 350);
  };

  return (
    <section className="flex h-[calc(100dvh-3.5rem)] min-w-0 flex-col overflow-hidden rounded-xl border bg-background sm:h-[calc(100dvh-4.5rem)]">
      <header className="flex items-center gap-3 border-b px-4 py-2.5">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={newChat}
        >
          <MessageSquarePlus className="h-4 w-4" />
          {t("newChat")}
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold sm:text-base">
            {active && active.messages.length > 0
              ? (active.messages
                  .find((m) => m.role === "user")
                  ?.content.slice(0, 48) ?? "Chat")
              : t("welcome")}
          </h1>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> {t("online")}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => activeId && clearConversation(activeId)}
          disabled={!active || active.messages.length === 0}
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">{t("clearChat")}</span>
        </Button>
      </header>

      <MessageList messages={active?.messages ?? []} />

      {!active || active.messages.length === 0 ? (
        <div className="grid grid-cols-1 gap-2 px-4 pb-2 sm:grid-cols-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => send(s)}
              className="rounded-xl border bg-card px-4 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      <Composer onSend={send} busy={busy || isComposing} />
    </section>
  );
}
