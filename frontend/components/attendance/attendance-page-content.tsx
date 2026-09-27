"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { attendanceService } from "@/services/attendance.service";
import { AttendanceRecord } from "@/types/attendance";
import { AttendanceCameraCard } from "./attendance-camera-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AttendanceCheckInSkeleton } from "@/components/skeletons/page-skeletons";
import { formatDateTime } from "@/lib/date-utils";
import { CheckCircle2, History, Send, Lock } from "lucide-react";
import { DS_TEXT, DS_BG, DS_BORDER } from "@/constants/design-system";

export function AttendancePageContent() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const checkStatus = useCallback(async () => {
    if (!user) {
      setIsLoadingStatus(false);
      setHasCheckedInToday(false);
      setTodayRecord(null);
      return;
    }
    try {
      setIsLoadingStatus(true);
      const res = await attendanceService.checkTodayAttendance(user.id);
      setHasCheckedInToday(res.data.hasCheckedInToday);
      setTodayRecord(res.data.todayRecord);
    } catch {
      setHasCheckedInToday(false);
      setTodayRecord(null);
    } finally {
      setIsLoadingStatus(false);
    }
  }, [user]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast({
        title: "Session Not Found",
        description: "Please sign in to continue",
        type: "error",
      });
      return;
    }

    if (!photoBase64) {
      showToast({
        title: "Photo Required",
        description: "Please take a selfie photo before submitting",
        type: "warning",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const blobRes = await fetch(photoBase64);
      const blob = await blobRes.blob();
      const res = await attendanceService.submitAttendance(blob);

      showToast({
        title: "Attendance Recorded",
        description: "Your WFH attendance for today has been recorded",
        type: "success",
      });

      setHasCheckedInToday(true);
      setTodayRecord(res.data);
      setPhotoBase64(null);
    } catch (err: unknown) {
      const error = err as { error?: { message?: string } };
      showToast({
        title: "Submission Failed",
        description: error?.error?.message || "Failed to process attendance",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingStatus) {
    return <AttendanceCheckInSkeleton />;
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto">
        <div className={`p-8 ${DS_BG.surface} border ${DS_BORDER.default} rounded-xl text-center shadow-xs space-y-4`}>
          <div className={`w-12 h-12 rounded-full ${DS_BG.muted} flex items-center justify-center mx-auto ${DS_TEXT.secondary}`}>
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className={`text-base font-bold ${DS_TEXT.primary} tracking-tight`}>Authentication Required</h2>
            <p className={`text-xs ${DS_TEXT.secondary}`}>Please sign in from the top navbar to record your daily attendance.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {hasCheckedInToday && todayRecord ? (
        <div className={`${DS_BG.surface} border ${DS_BORDER.default} rounded-xl p-5 shadow-xs space-y-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h2 className={`text-sm font-bold ${DS_TEXT.primary}`}>
                Attendance Completed
              </h2>
            </div>
            <Badge variant="success">Checked In</Badge>
          </div>

          {todayRecord.photoUrl && (
            <div className={`w-36 h-36 mx-auto rounded-lg overflow-hidden border ${DS_BORDER.strong} ${DS_BG.dark} shadow-xs`}>
              <img
                src={todayRecord.photoUrl}
                alt="Today's Attendance Photo"
                style={{ transform: "none" }}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className={DS_TEXT.secondary}>Attendance Time</span>
              <span className={`font-semibold ${DS_TEXT.primary} tabular-nums`}>
                {formatDateTime(todayRecord.date)} WIB
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={DS_TEXT.secondary}>Employee Name</span>
              <span className={`font-medium ${DS_TEXT.primary}`}>
                {todayRecord.user?.name || user?.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={DS_TEXT.secondary}>Employee ID</span>
              <span className={`font-medium ${DS_TEXT.primary} tabular-nums`}>
                {todayRecord.user?.nip || user?.nip}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={DS_TEXT.secondary}>Department</span>
              <span className={`font-medium ${DS_TEXT.primary}`}>
                {todayRecord.user?.department?.name || user?.department?.name || "-"}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/history">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<History className="w-4 h-4" />}
                className="w-full font-semibold text-sm py-3 h-11 shadow-xs"
              >
                View Attendance History
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <AttendanceCameraCard
            capturedPhoto={photoBase64}
            onPhotoCaptured={(photo) => setPhotoBase64(photo)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={!photoBase64 || isSubmitting}
            leftIcon={<Send className="w-4 h-4" />}
            className={`w-full font-semibold text-sm py-3 h-11 shadow-xs ${DS_TEXT.inverse}`}
          >
            Submit Attendance
          </Button>
        </form>
      )}
    </div>
  );
}
