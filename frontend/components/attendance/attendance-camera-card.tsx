"use client";

import React from "react";
import Link from "next/link";
import { useCamera } from "@/hooks/use-camera";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, AlertCircle, History } from "lucide-react";
import { DS_TEXT, DS_BG, DS_BORDER } from "@/constants/design-system";

interface AttendanceCameraCardProps {
  onPhotoCaptured: (photoBase64: string | null) => void;
  capturedPhoto: string | null;
}

export function AttendanceCameraCard({
  onPhotoCaptured,
  capturedPhoto,
}: AttendanceCameraCardProps) {
  const {
    status,
    errorMessage,
    videoRef,
    isFlipped,
    capturePhoto,
    retakePhoto,
    startCamera,
  } = useCamera();

  const handleCapture = () => {
    const photo = capturePhoto();
    if (photo) {
      onPhotoCaptured(photo);
    }
  };

  const handleRetake = () => {
    retakePhoto();
    onPhotoCaptured(null);
  };

  return (
    <div className={`${DS_BG.surface} border ${DS_BORDER.default} rounded-xl overflow-hidden shadow-xs`}>
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-2">
          <Camera className={`w-4 h-4 ${DS_TEXT.primary}`} />
          <span className={`text-xs font-semibold ${DS_TEXT.primary} uppercase tracking-wide`}>
            Attendance Camera
          </span>
        </div>

        <Link href="/history">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<History className="w-3.5 h-3.5" />}
            className="text-xs font-semibold h-8 px-3"
          >
            History
          </Button>
        </Link>
      </div>

      <div className="p-5 flex flex-col items-center">
        <div
          onClick={!capturedPhoto && status === "ready" ? handleCapture : undefined}
          className={`relative w-full aspect-4/3 ${DS_BG.dark} rounded-lg overflow-hidden flex items-center justify-center border ${DS_BORDER.strong} ${
            !capturedPhoto && status === "ready" ? "cursor-pointer" : ""
          }`}
        >
          {capturedPhoto ? (
            <img
              src={capturedPhoto}
              alt="Attendance Photo"
              className="w-full h-full object-cover select-none"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ transform: isFlipped ? "scaleX(-1)" : "none" }}
                className={`w-full h-full object-cover select-none ${
                  status === "ready" ? "block" : "hidden"
                }`}
              />

              {status === "ready" && (
                <div className="absolute inset-0 flex items-end justify-center p-3 pointer-events-none">
                  <span className={`text-xs font-medium ${DS_TEXT.inverse} px-3 py-1 bg-black/60 rounded-md`}>
                    Tap viewfinder or press button below
                  </span>
                </div>
              )}

              {status === "requesting" && (
                <div className={`text-center p-4 ${DS_TEXT.secondary} text-xs`}>
                  <RefreshCw className={`w-6 h-6 animate-spin mx-auto mb-2 ${DS_TEXT.secondary}`} />
                  Activating device camera...
                </div>
              )}

              {(status === "denied" || status === "error") && (
                <div className={`text-center p-4 ${DS_TEXT.secondary} max-w-xs`}>
                  <AlertCircle className={`w-8 h-8 ${DS_TEXT.inverse} mx-auto mb-2`} />
                  <p className={`text-xs ${DS_TEXT.inverse} font-medium mb-1`}>
                    {errorMessage || "Camera could not be accessed"}
                  </p>
                  <p className={`text-[11px] ${DS_TEXT.secondary} mb-3`}>
                    Please allow camera access in your browser to proceed with attendance
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={startCamera}
                    className={`text-xs ${DS_BG.darkSubtle} ${DS_TEXT.inverse} ${DS_BORDER.dark} hover:${DS_BG.darkSubtleHover}`}
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="w-full mt-3.5">
          {capturedPhoto ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleRetake}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="w-full text-xs font-semibold"
            >
              Retake Photo
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCapture}
              disabled={status !== "ready"}
              leftIcon={<Camera className="w-4 h-4" />}
              className="w-full text-xs font-semibold"
            >
              Take Selfie Photo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
