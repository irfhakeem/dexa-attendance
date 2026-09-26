"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AttendanceHistoryFeed } from "@/components/attendance/attendance-history-feed";

export default function HistoryPage() {
  return (
    <AppShell>
      <AttendanceHistoryFeed />
    </AppShell>
  );
}
