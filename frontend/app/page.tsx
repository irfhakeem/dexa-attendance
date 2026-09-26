"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AttendancePageContent } from "@/components/attendance/attendance-page-content";

export default function HomePage() {
  return (
    <AppShell>
      <AttendancePageContent />
    </AppShell>
  );
}
