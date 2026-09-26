export const DS_TEXT = {
  primary: "text-slate-900",
  secondary: "text-slate-500",
  inverse: "text-white",
  primaryHover: "hover:text-slate-900",
  secondaryHover: "hover:text-slate-500",
  primaryFocus: "focus:text-slate-900",
  required: "text-red-600",
} as const;

export const DS_BG = {
  app: "bg-slate-50",
  surface: "bg-white",
  muted: "bg-slate-100",
  subtle: "bg-slate-200",
  dark: "bg-slate-900",
  darkHover: "hover:bg-slate-800",
  darkSubtle: "bg-slate-800",
  darkSubtleHover: "hover:bg-slate-700",
  mutedHover: "hover:bg-slate-100",
  subtleHover: "hover:bg-slate-200",
  strongHover: "hover:bg-slate-300",
  appHover: "hover:bg-slate-50",
  mutedFocus: "focus:bg-slate-100",
  backdrop: "bg-slate-900/60",
  backdropSubtle: "bg-slate-900/40",
  danger: "bg-red-700",
  dangerHover: "hover:bg-red-600",
} as const;

export const DS_BORDER = {
  default: "border-slate-200",
  subtle: "border-slate-100",
  strong: "border-slate-300",
  medium: "border-slate-400",
  dark: "border-slate-700",
  darkContainer: "border-slate-800",
  darkest: "border-slate-900",
  darkestFocus: "focus:border-slate-900",
  danger: "border-red-800",
  dangerFocus: "focus:border-red-800",
} as const;

export const DS_FOCUS = {
  ring: "focus:ring-1 focus:ring-slate-900 focus:outline-none",
  ringSubtle: "focus:ring-slate-400",
  checkbox: "focus:ring-slate-900",
} as const;

export const DS_STATUS = {
  success: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  warning: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  danger: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  info: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
} as const;

export const DESIGN_SYSTEM = {
  text: DS_TEXT,
  bg: DS_BG,
  border: DS_BORDER,
  focus: DS_FOCUS,
  status: DS_STATUS,
} as const;
