"use client";

import { useTranslations } from "next-intl";
import { MessageSquarePlus, History, Trash2 } from "lucide-react";
import { useAssistantStore } from "@/store/use-assistant-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function newChat() {
  // Force a brand-new conversation regardless of current state.
  useAssistantStore.setState({ activeConversationId: null });
  useAssistantStore.getState().startConversation();
}

/** New chat button + conversation history, rendered inside the main app sidebar. */
export function AssistantHistory() {
  const t = useTranslations("assistant");
  // ponytail: empty conversations are noise in history — only show ones with messages.
  const conversations = useAssistantStore((s) => s.conversations).filter(
    (c) => c.messages.length > 0,
  );
  const activeId = useAssistantStore((s) => s.activeConversationId);
  const setActive = useAssistantStore((s) => s.setActiveConversation);
  const deleteConversation = useAssistantStore((s) => s.deleteConversation);

  return (
    <div className="flex flex-col gap-1">
      <Button
        size="sm"
        className="mb-1 w-full justify-start gap-2"
        onClick={newChat}
      >
        <MessageSquarePlus className="h-4 w-4" />
        {t("newChat")}
      </Button>
      {conversations.length === 0 ? (
        <p className="px-3 py-3 text-xs text-muted-foreground">
          {t("noHistory")}
        </p>
      ) : (
        [...conversations].reverse().map((c) => {
          const title =
            c.title === "New chat"
              ? (c.messages
                  .find((m) => m.role === "user")
                  ?.content.slice(0, 32) ?? c.title)
              : c.title;
          return (
            <div
              key={c.id}
              className={cn(
                "group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                activeId === c.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <button
                type="button"
                onClick={() => setActive(c.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <History className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{title}</span>
              </button>
              <button
                type="button"
                onClick={() => deleteConversation(c.id)}
                aria-label="Delete"
                className="hidden shrink-0 group-hover:block"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
