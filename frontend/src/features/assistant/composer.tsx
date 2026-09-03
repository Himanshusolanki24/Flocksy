"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Mic, Square, ImagePlus, SendHorizontal, Bot } from "lucide-react";
import { useVoice } from "@/hooks/use-voice";
import { useAssistantStore } from "@/store/use-assistant-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ComposerProps {
  onSend: (text: string, imageUrl?: string) => void;
  busy: boolean;
}

/** Bottom input bar: text, voice, image upload and send. */
export function Composer({ onSend, busy }: ComposerProps) {
  const t = useTranslations("assistant");
  const setComposing = useAssistantStore((s) => s.setComposing);
  const locale = useLocale();
  const {
    supported: voiceSupported,
    listening,
    transcript,
    start,
    stop,
    reset,
  } = useVoice(locale === "hi" ? "hi-IN" : "en-IN");

  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  const effectiveText = listening ? transcript : text;

  const send = () => {
    const content = effectiveText.trim();
    if ((!content && !imageUrl) || busy) return;
    onSend(content, imageUrl);
    setText("");
    setImageUrl(undefined);
    reset();
    setComposing(false);
  };

  const toggleMic = () => {
    if (listening) {
      stop();
      setText(transcript);
      reset();
    } else {
      start();
    }
  };

  const onPickImage = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  return (
    <div className="border-t bg-background/80 p-3 backdrop-blur sm:p-4">
      {imageUrl ? (
        <div className="mb-3 flex items-center gap-3 rounded-lg border p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Attachment"
            className="h-12 w-12 rounded-md object-cover"
          />
          <span className="flex-1 text-sm text-muted-foreground">
            Analyzing your photo…
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setImageUrl(undefined)}
          >
            ✕
          </Button>
        </div>
      ) : null}

      <div className="flex items-end gap-2 rounded-2xl border bg-background p-2 shadow-soft focus-within:ring-2 focus-within:ring-ring">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          aria-label={t("uploadImage")}
          onClick={() => fileRef.current?.click()}
        >
          <ImagePlus className="h-5 w-5" />
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onPickImage(e.target.files?.[0])}
        />

        <Textarea
          value={effectiveText}
          rows={1}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={listening ? t("listening") : t("placeholder")}
          className="max-h-36 min-h-0 flex-1 resize-none border-0 text-base focus-visible:ring-0 md:text-sm"
          aria-label={t("placeholder")}
        />

        {voiceSupported ? (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className={cn(
              listening && "bg-destructive text-destructive-foreground",
            )}
            aria-label={t("voiceHint")}
            onClick={toggleMic}
          >
            {listening ? (
              <Square className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
        ) : null}

        <Button
          type="button"
          size="icon"
          className="h-10 w-10 rounded-xl"
          onClick={send}
          disabled={(!effectiveText.trim() && !imageUrl) || busy}
          aria-label="Send"
        >
          {busy ? (
            <Bot className="h-5 w-5 animate-pulse" />
          ) : (
            <SendHorizontal className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
