import * as React from "react";
import { DS_BG } from "@/constants/design-system";

export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md ${DS_BG.subtle} ${className}`}
      {...props}
    />
  );
}
