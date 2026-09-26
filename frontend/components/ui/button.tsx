import React from "react";
import { Loader2 } from "lucide-react";
import { DS_TEXT, DS_BG, DS_BORDER, DS_FOCUS, DS_STATUS } from "@/constants/design-system";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost" | "subtle";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: `${DS_BG.dark} ${DS_TEXT.inverse} border-transparent ${DS_BG.darkHover} ${DS_FOCUS.ring}`,
    secondary: `${DS_BG.muted} ${DS_TEXT.primary} ${DS_BORDER.strong} ${DS_BG.subtleHover} ${DS_FOCUS.ringSubtle}`,
    outline: `${DS_BG.surface} ${DS_TEXT.primary} ${DS_BORDER.strong} ${DS_BG.appHover} ${DS_FOCUS.ringSubtle}`,
    danger: `${DS_BG.danger} ${DS_TEXT.inverse} border-transparent ${DS_BG.dangerHover} ${DS_FOCUS.ring}`,
    ghost: `bg-transparent ${DS_TEXT.primary} border-transparent ${DS_BG.mutedHover} ${DS_FOCUS.ringSubtle}`,
    subtle: `${DS_BG.subtle} ${DS_TEXT.primary} border-transparent ${DS_BG.strongHover} ${DS_FOCUS.ringSubtle}`,
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
    md: "px-4 py-2 text-sm rounded-md gap-2",
    lg: "px-5 py-2.5 text-base rounded-lg gap-2.5",
    icon: "p-2 rounded-md",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
