"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { attendanceService } from "@/services/attendance.service";
import { AttendanceRecord } from "@/types/attendance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { formatDateIndonesian, formatTimeOnly } from "@/lib/date-utils";
import {
  ArrowLeft,
  Filter,
  Clock,
  Loader2,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { DS_TEXT, DS_BG, DS_BORDER } from "@/constants/design-system";
import { ATTENDANCE_ORDER_OPTIONS } from "@/constants/dropdown-options";

export function AttendanceHistoryFeed() {
  const { user } = useAuth();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [orderBy, setOrderBy] = useState<"desc" | "asc">("desc");

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = useCallback(
    async (pageToLoad: number, isReset: boolean = false) => {
      if (!user) return;
      try {
        if (isReset) {
          setIsLoadingInitial(true);
        } else {
          setIsLoadingMore(true);
        }

        const res = await attendanceService.getPersonalHistory({
          page: pageToLoad,
          limit: 5,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          sort: orderBy,
        });

        if (isReset) {
          setRecords(res.data);
        } else {
          setRecords((prev) => [...prev, ...res.data]);
        }

        setHasMore(pageToLoad < res.pagination.totalPages);
        setPage(pageToLoad);
      } catch {
        if (isReset) setRecords([]);
        setHasMore(false);
      } finally {
        setIsLoadingInitial(false);
        setIsLoadingMore(false);
      }
    },
    [user, startDate, endDate, orderBy]
  );

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  const loadNextPage = useCallback(() => {
    if (!hasMore || isLoadingMore || isLoadingInitial) return;
    fetchPage(page + 1, false);
  }, [hasMore, isLoadingMore, isLoadingInitial, page, fetchPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadNextPage]);

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setOrderBy("desc");
  };

  if (!user) {
    return (
      <div className="max-w-lg mx-auto">
        <div className={`p-8 ${DS_BG.surface} border ${DS_BORDER.default} rounded-xl text-center shadow-xs space-y-4`}>
          <div className={`w-12 h-12 rounded-full ${DS_BG.muted} flex items-center justify-center mx-auto ${DS_TEXT.secondary}`}>
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className={`text-base font-bold ${DS_TEXT.primary} tracking-tight`}>Authentication Required</h2>
            <p className={`text-xs ${DS_TEXT.secondary}`}>Please sign in from the top navbar to view your personal attendance history.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className={`flex items-center gap-3 ${DS_BG.surface} p-5 rounded-xl border ${DS_BORDER.default} shadow-xs`}>
        <Link
          href="/"
          className={`inline-flex items-center justify-center p-1.5 -ml-1.5 ${DS_TEXT.primary} ${DS_TEXT.secondaryHover} transition-colors`}
          aria-label="Back to Attendance"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className={`text-base font-bold ${DS_TEXT.primary} tracking-tight`}>Attendance History</h1>
      </div>

      <div className={`${DS_BG.surface} border ${DS_BORDER.default} rounded-xl p-5 shadow-xs space-y-4`}>
        <div className={`flex items-center justify-between text-xs font-semibold ${DS_TEXT.primary} uppercase tracking-wider`}>
          <div className="flex items-center gap-1.5">
            <Filter className={`w-3.5 h-3.5 ${DS_TEXT.secondary}`} />
            <span>Filter Date & Order</span>
          </div>
          {(startDate || endDate || orderBy !== "desc") && (
            <button
              onClick={handleResetFilters}
              className={`text-xs ${DS_TEXT.secondary} ${DS_TEXT.primaryHover} underline lowercase`}
            >
              reset filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            type="date"
            placeholder="From Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            type="date"
            placeholder="To Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <SelectField
            value={orderBy}
            onValueChange={(val) => setOrderBy(val as "desc" | "asc")}
            options={ATTENDANCE_ORDER_OPTIONS}
          />
        </div>
      </div>

      {isLoadingInitial ? (
        <div className={`p-12 text-center ${DS_TEXT.secondary} text-sm ${DS_BG.surface} rounded-xl border ${DS_BORDER.default} shadow-xs`}>
          Loading history records...
        </div>
      ) : records.length === 0 ? (
        <div className={`p-12 text-center ${DS_BG.surface} rounded-xl border ${DS_BORDER.default} shadow-xs space-y-3`}>
          <Clock className={`w-8 h-8 ${DS_TEXT.secondary} mx-auto`} />
          <p className={`text-sm font-semibold ${DS_TEXT.primary}`}>No Attendance History Found</p>
          <p className={`text-xs ${DS_TEXT.secondary} max-w-xs mx-auto`}>
            No attendance records match the selected filter criteria.
          </p>
          <div className="pt-2">
            <Link href="/">
              <Button size="sm" variant="secondary" className="text-xs font-semibold">
                Back to Attendance
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((rec) => (
            <div
              key={rec.id}
              className={`${DS_BG.surface} border ${DS_BORDER.default} rounded-xl overflow-hidden shadow-xs hover:${DS_BORDER.strong} transition-colors`}
            >
              <div className={`p-5 ${DS_BG.app}/75 border-b ${DS_BORDER.default} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${DS_BG.dark}`} />
                  <span className={`text-xs font-semibold ${DS_TEXT.primary}`}>
                    {formatDateIndonesian(rec.date)}
                  </span>
                </div>
                <span className={`text-xs font-medium ${DS_TEXT.secondary} ${DS_BG.surface} px-2.5 py-0.5 rounded border ${DS_BORDER.default} tabular-nums`}>
                  {formatTimeOnly(rec.date)} WIB
                </span>
              </div>

              <div className="p-5 space-y-4">
                {rec.photoUrl && (
                  <div className={`w-full aspect-4/3 rounded-lg overflow-hidden border ${DS_BORDER.strong} ${DS_BG.dark}`}>
                    <img
                      src={rec.photoUrl}
                      alt={`Attendance Photo ${formatDateIndonesian(rec.date)}`}
                      style={{ transform: "none" }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end text-xs pt-1">
                  <span className={`flex items-center gap-1.5 font-medium ${DS_TEXT.primary}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${DS_TEXT.primary}`} />
                    Check-in Recorded
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div ref={sentinelRef} className="py-2 text-center">
            {isLoadingMore && (
              <div className={`flex items-center justify-center gap-2 text-xs ${DS_TEXT.secondary} py-3`}>
                <Loader2 className={`w-4 h-4 animate-spin ${DS_TEXT.secondary}`} />
                <span>Loading more records...</span>
              </div>
            )}

            {!hasMore && records.length > 0 && (
              <div className={`text-xs ${DS_TEXT.secondary} py-4 border-t ${DS_BORDER.default} flex items-center justify-center gap-1.5`}>
                <span>All attendance records loaded</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
