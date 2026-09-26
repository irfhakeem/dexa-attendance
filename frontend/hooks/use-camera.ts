"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type CameraStatus = "idle" | "requesting" | "ready" | "captured" | "error" | "denied";

export function useCamera() {
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setErrorMessage("Camera is not supported on this browser");
      return;
    }

    try {
      setStatus("requesting");
      setErrorMessage(null);
      stopStream();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
      }

      setStatus("ready");
    } catch (err: unknown) {
      const error = err as { name?: string };
      if (error?.name === "NotAllowedError" || error?.name === "PermissionDeniedError") {
        setStatus("denied");
        setErrorMessage("Camera access permission was denied by user");
      } else {
        setStatus("error");
        setErrorMessage("Unable to access device camera");
      }
    }
  }, [stopStream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    if (isFlipped) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

    setCapturedPhoto(dataUrl);
    setStatus("captured");
    stopStream();
    return dataUrl;
  }, [stopStream, isFlipped]);

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    startCamera();
  }, [startCamera]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const flipCapturedPhoto = useCallback((newPhotoUrl: string) => {
    setCapturedPhoto(newPhotoUrl);
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopStream();
    };
  }, [startCamera, stopStream]);

  return {
    status,
    capturedPhoto,
    errorMessage,
    videoRef,
    isFlipped,
    toggleFlip,
    flipCapturedPhoto,
    startCamera,
    capturePhoto,
    retakePhoto,
  };
}
