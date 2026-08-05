import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ChatView } from "@/features/assistant/chat-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("assistant") };
}

export default function AssistantPage() {
  return (
    <div className="px-4 pb-6 sm:px-6">
      <ChatView />
    </div>
  );
}