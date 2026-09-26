"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { DS_TEXT } from "@/constants/design-system";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const typeStyles: Record<
  ToastType,
  {
    container: string;
    iconBox: string;
    icon: React.ReactNode;
  }
> = {
  success: {
    container: "bg-emerald-50 border-emerald-200 border-l-4 border-l-emerald-500 shadow-md",
    iconBox: "bg-emerald-100",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
  },
  error: {
    container: "bg-red-50 border-red-200 border-l-4 border-l-red-500 shadow-md",
    iconBox: "bg-red-100",
    icon: <AlertCircle className="w-4 h-4 text-red-600" />,
  },
  info: {
    container: "bg-blue-50 border-blue-200 border-l-4 border-l-blue-500 shadow-md",
    iconBox: "bg-blue-100",
    icon: <Info className="w-4 h-4 text-blue-600" />,
  },
  warning: {
    container: "bg-amber-50 border-amber-200 border-l-4 border-l-amber-500 shadow-md",
    iconBox: "bg-amber-100",
    icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description, type }: Omit<ToastItem, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          const style = typeStyles[t.type] || typeStyles.info;
          return (
            <div
              key={t.id}
              role="alert"
              className={`pointer-events-auto relative flex w-full items-start gap-3 p-3.5 rounded-xl border ${style.container} transition-all`}
            >
              <div className={`mt-0.5 p-1 rounded-lg shrink-0 ${style.iconBox}`}>
                {style.icon}
              </div>
              <div className="flex-1 pr-6">
                <p className={`text-xs font-semibold ${DS_TEXT.primary} leading-snug`}>{t.title}</p>
                {t.description && (
                  <p className={`text-xs ${DS_TEXT.secondary} mt-1 leading-relaxed`}>{t.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className={`absolute right-2.5 top-2.5 p-1 ${DS_TEXT.secondary} ${DS_TEXT.primaryHover} hover:bg-black/5 rounded-md transition-colors cursor-pointer`}
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
