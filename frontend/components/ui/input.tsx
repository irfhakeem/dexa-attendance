import React, { forwardRef } from "react";
import { DS_TEXT, DS_BG, DS_BORDER, DS_FOCUS } from "@/constants/design-system";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, id, className = "", ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className={`text-xs font-semibold ${DS_TEXT.primary}`}>
            {label}
            {props.required && <span className={`${DS_TEXT.required} ml-0.5`}>*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className={`absolute left-3 ${DS_TEXT.secondary} pointer-events-none flex items-center`}>
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full h-9 px-3 py-2 text-xs ${DS_BG.surface} border rounded-lg ${DS_TEXT.primary} placeholder:${DS_TEXT.secondary} transition-colors ${DS_FOCUS.ring} ${
              leftIcon ? "pl-9" : ""
            } ${
              error
                ? `${DS_BORDER.darkContainer} ${DS_BORDER.darkestFocus}`
                : `${DS_BORDER.strong} ${DS_BORDER.darkestFocus}`
            } ${props.disabled ? `${DS_BG.muted} cursor-not-allowed opacity-75` : ""} ${className}`}
            {...props}
          />
        </div>
        {error && <span className={`text-xs ${DS_TEXT.primary} font-medium`}>{error}</span>}
        {!error && helperText && <span className={`text-xs ${DS_TEXT.secondary}`}>{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
