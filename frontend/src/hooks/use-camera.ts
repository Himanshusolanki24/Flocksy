"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export interface CameraOptions {
  facingMode?: "user" | "environment";
}

export interface CameraState {
  supported: boolean;
  streamActive: boolean;
  error: string | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  start: () => Promise<void>;
  stop: () => void;
  capture: () => Promise<File | null>;
}

/**
 * MediaDevices camera wrapper for the "Detect disease" flow.
 * Uses the rear camera by default (ideal for photographing livestock).
 */
export function useCamera({ facingMode = "environment" }: CameraOptions = {}): CameraState {
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const supported =
    typeof window !== "undefined" && "mediaDevices" in navigator && !!navigator.mediaDevices;

  const start = useCallback(async () => {
    if (!supported) return;
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode } },
        audio: false,
      });
      streamRef.current = stream;
      setStreamActive(true);

      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Camera unavailable");
      setStreamActive(false);
    }
  }, [facingMode, supported]);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStreamActive(false);
  }, []);

  const capture = useCallback(async (): Promise<File | null> => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg"),
    );
    return blob ? new File([blob], "capture.jpg", { type: "image/jpeg" }) : null;
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { supported, streamActive, error, videoRef, start, stop, capture };
}