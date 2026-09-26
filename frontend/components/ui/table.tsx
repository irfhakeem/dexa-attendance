import * as React from "react";
import { DS_TEXT, DS_BG, DS_BORDER } from "@/constants/design-system";

export function Table({ className = "", ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={`w-full caption-bottom text-xs text-left ${className}`} {...props} />
    </div>
  );
}

export function TableHeader({ className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={`border-b ${DS_BORDER.default} ${DS_BG.app}/75 ${DS_TEXT.secondary} uppercase font-semibold ${className}`} {...props} />;
}

export function TableBody({ className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`divide-y ${DS_BORDER.default} ${className}`} {...props} />;
}

export function TableFooter({ className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tfoot className={`border-t ${DS_BORDER.default} ${DS_BG.app}/50 font-medium ${className}`} {...props} />;
}

export function TableRow({ className = "", ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`border-b ${DS_BORDER.default} transition-colors hover:${DS_BG.app} data-[state=selected]:${DS_BG.app} ${className}`} {...props} />;
}

export function TableHead({ className = "", ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`h-10 px-4 text-center align-middle font-semibold ${DS_TEXT.secondary} [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />;
}

export function TableCell({ className = "", ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />;
}

export function TableCaption({ className = "", ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={`mt-4 text-xs ${DS_TEXT.secondary} ${className}`} {...props} />;
}
