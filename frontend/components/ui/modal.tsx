"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { DS_TEXT, DS_BG, DS_BORDER } from "@/constants/design-system";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
}: ModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className={`fixed inset-0 ${DS_BG.backdrop} backdrop-blur-none transition-opacity`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative w-full ${maxWidthStyles[maxWidth]} ${DS_BG.surface} rounded-xl border ${DS_BORDER.default} shadow-xl overflow-hidden z-10 my-8`}
      >
        <div className={`flex items-center justify-between p-5 border-b ${DS_BORDER.default} ${DS_BG.app}/75`}>
          <div>
            <h2 id="modal-title" className={`text-base font-bold ${DS_TEXT.primary}`}>
              {title}
            </h2>
            {description && (
              <p className={`text-xs ${DS_TEXT.secondary} mt-0.5`}>{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 ${DS_TEXT.secondary} ${DS_TEXT.primaryHover} ${DS_BG.subtleHover} rounded-md transition-colors cursor-pointer`}
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 max-h-[calc(100vh-12rem)] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
