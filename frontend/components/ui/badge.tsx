import React from "react";
import { DS_TEXT, DS_BG, DS_BORDER, DS_STATUS } from "@/constants/design-system";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    default: `${DS_BG.dark} ${DS_TEXT.inverse} ${DS_BORDER.darkest}`,
    secondary: `${DS_BG.muted} ${DS_TEXT.primary} ${DS_BORDER.default}`,
    outline: `bg-transparent ${DS_TEXT.primary} ${DS_BORDER.default}`,
    success: `${DS_STATUS.success.bg} ${DS_STATUS.success.text} ${DS_STATUS.success.border}`,
    warning: `${DS_STATUS.warning.bg} ${DS_STATUS.warning.text} ${DS_STATUS.warning.border}`,
    danger: `${DS_STATUS.danger.bg} ${DS_STATUS.danger.text} ${DS_STATUS.danger.border}`,
    info: `${DS_STATUS.info.bg} ${DS_STATUS.info.text} ${DS_STATUS.info.border}`,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
