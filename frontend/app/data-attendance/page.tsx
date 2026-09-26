"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { AttendanceRecordView } from "@/components/hr/attendance-record-view";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { DS_TEXT, DS_BG, DS_BORDER } from "@/constants/design-system";

export default function DataAttendancePage() {
  const { isHR, isLoading } = useAuth();

  return (
    <AppShell>
      {isLoading ? (
        <div className={`p-12 text-center ${DS_TEXT.secondary} text-sm`}>Loading page...</div>
      ) : !isHR ? (
        <div className={`max-w-md mx-auto p-5 ${DS_BG.surface} border ${DS_BORDER.default} rounded-xl text-center shadow-xs space-y-3`}>
          <ShieldAlert className={`w-10 h-10 ${DS_TEXT.secondary} mx-auto`} />
          <h2 className={`text-base font-bold ${DS_TEXT.primary}`}>Restricted Access</h2>
          <p className={`text-xs ${DS_TEXT.secondary}`}>
            Attendance Records are accessible only to HR personnel.
          </p>
          <Link href="/">
            <Button size="sm" variant="primary">
              Back to Attendance
            </Button>
          </Link>
        </div>
      ) : (
        <AttendanceRecordView />
      )}
    </AppShell>
  );
}
