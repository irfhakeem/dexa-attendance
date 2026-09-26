"use client";

import * as React from "react";
import { X } from "lucide-react";
import { DS_TEXT, DS_BG, DS_BORDER } from "@/constants/design-system";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  description,
  children,
}: SheetProps) {
  React.useEffect(() => {
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className={`fixed inset-0 ${DS_BG.backdropSubtle} backdrop-blur-xs transition-opacity duration-200`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`relative z-50 flex flex-col w-72 max-w-[85vw] h-full ${DS_BG.surface} border-l ${DS_BORDER.default} shadow-2xl duration-200`}>
        <div className={`flex items-center justify-between p-4 border-b ${DS_BORDER.default}`}>
          <div>
            {title && <h2 className={`text-sm font-bold ${DS_TEXT.primary}`}>{title}</h2>}
            {description && <p className={`text-xs ${DS_TEXT.secondary} mt-0.5`}>{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 ${DS_TEXT.secondary} ${DS_TEXT.primaryHover} ${DS_BG.mutedHover} rounded-lg transition-colors cursor-pointer`}
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
