"use client";

import * as React from "react";
import { DS_TEXT, DS_BG } from "@/constants/design-system";

export function NavigationMenu({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={`relative z-10 flex max-w-max flex-1 items-center justify-center ${className}`} {...props}>
      {children}
    </nav>
  );
}

export function NavigationMenuList({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={`group flex flex-1 list-none items-center justify-center gap-1 ${className}`} {...props}>
      {children}
    </ul>
  );
}

export function NavigationMenuItem({
  className = "",
  children,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li className={`flex items-center ${className}`} {...props}>
      {children}
    </li>
  );
}

export function navigationMenuTriggerStyle() {
  return `inline-flex h-8 w-max items-center justify-center rounded-md px-3 text-xs font-medium transition-colors ${DS_BG.mutedHover} ${DS_TEXT.primaryHover} ${DS_BG.mutedFocus} ${DS_TEXT.primaryFocus} focus:outline-none disabled:pointer-events-none disabled:opacity-50`;
}
