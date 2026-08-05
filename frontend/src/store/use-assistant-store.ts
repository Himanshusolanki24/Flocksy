"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatConversation, ChatMessage } from "@/types";
import { uid } from "@/lib/utils";

interface AssistantState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  pinnedMessageIds: string[];
  isComposing: boolean;

  startConversation: () => string;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (conversationId: string, messageId: string, patch: Partial<ChatMessage>) => void;
  addUserMessage: (content: string, imageUrl?: string) => string;
  appendAssistantMessage: (conversationId: string, message: ChatMessage) => void;
  togglePin: (messageId: string) => void;
  clearConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  setComposing: (composing: boolean) => void;
}

const emptyTitle = "New chat";

/**
 * AI assistant conversations + streaming state.
 * Persisted so chat history survives reloads and offline sessions.
 */
export const useAssistantStore = create<AssistantState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      pinnedMessageIds: [],
      isComposing: false,

      startConversation: () => {
        const active = get().activeConversationId;
        if (active) return active;
        const id = uid("conv");
        const conversation: ChatConversation = {
          id,
          title: emptyTitle,
          messages: [],
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          conversations: [...state.conversations, conversation],
          activeConversationId: id,
        }));
        return id;
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, updatedAt: new Date().toISOString(), messages: [...c.messages, message] }
              : c,
          ),
        })),

      updateMessage: (conversationId, messageId, patch) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
                }
              : c,
          ),
        })),

      addUserMessage: (content, imageUrl) => {
        const id = get().startConversation();
        const message: ChatMessage = {
          id: uid("msg"),
          role: "user",
          content,
          imageUrl,
          timestamp: new Date().toISOString(),
        };
        get().addMessage(id, message);
        return id;
      },

      appendAssistantMessage: (conversationId, message) => {
        get().addMessage(conversationId, message);
      },

      togglePin: (messageId) =>
        set((state) => {
          const pinned = state.pinnedMessageIds.includes(messageId);
          return {
            pinnedMessageIds: pinned
              ? state.pinnedMessageIds.filter((id) => id !== messageId)
              : [...state.pinnedMessageIds, messageId],
          };
        }),

      clearConversation: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, title: emptyTitle, messages: [], updatedAt: new Date().toISOString() }
              : c,
          ),
        })),

      deleteConversation: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== conversationId),
          activeConversationId:
            state.activeConversationId === conversationId ? null : state.activeConversationId,
        })),

      setComposing: (composing) => set({ isComposing: composing }),
    }),
    {
      name: "flocksy-assistant",
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        pinnedMessageIds: state.pinnedMessageIds,
      }),
    },
  ),
);