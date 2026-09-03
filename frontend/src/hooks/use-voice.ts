"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface VoiceState {
  supported: boolean;
  listening: boolean;
  transcript: string;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 * Web Speech API wrapper for Hindi/English dictation.
 * The language is chosen by the user's UI language.
 */
export function useVoice(language = "hi-IN"): VoiceState {
  // Stays false through SSR + first render, so the markup hydrates identically.
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<{ stop: () => void; onresult: unknown } | null>(
    null,
  );

  useEffect(() => {
    setSupported("webkitSpeechRecognition" in window);
  }, []);

  useEffect(() => {
    if (!supported) return;
    const SR = (
      window as unknown as { webkitSpeechRecognition: new () => unknown }
    ).webkitSpeechRecognition;
    const recognition = new SR() as {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: (e: {
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
      }) => void;
      onend: () => void;
      onerror: () => void;
      start: () => void;
      stop: () => void;
    };
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    return () => {
      recognition.stop();
    };
  }, [supported, language]);

  const start = useCallback(() => {
    const recognition = recognitionRef.current as { start?: () => void } | null;
    if (!recognition?.start) return;
    setTranscript("");
    setListening(true);
    try {
      recognition.start();
    } catch {
      // Already started
    }
  }, []);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current as { stop?: () => void } | null;
    recognition?.stop?.();
    setListening(false);
  }, []);

  const reset = useCallback(() => setTranscript(""), []);

  return { supported, listening, transcript, start, stop, reset };
}
