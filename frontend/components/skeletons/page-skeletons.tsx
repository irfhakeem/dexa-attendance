import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { DS_BG, DS_BORDER } from "@/constants/design-system";

export function MasterUserPageSkeleton() {
  return (
    <div className="space-y-4">
      <Card className={`shadow-xs ${DS_BORDER.default}`}>
        <div className="flex flex-row items-center justify-between gap-3 p-5 min-h-[76px]">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-60" />
          </div>
          <Skeleton className="h-9 w-28 rounded-lg shrink-0" />
        </div>
      </Card>

      <Card className={`p-5 shadow-xs ${DS_BORDER.default}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>
      </Card>

      <div className={`hidden lg:block ${DS_BG.surface} border ${DS_BORDER.default} rounded-xl overflow-hidden shadow-xs`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 px-3 text-center">
                <Skeleton className="h-4 w-4 mx-auto rounded" />
              </TableHead>
              <TableHead className="text-center">Name & ID</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Department</TableHead>
              <TableHead className="text-center">Gender</TableHead>
              <TableHead className="text-center">Today Attendance</TableHead>
              <TableHead className={`text-center sticky right-0 z-20 ${DS_BG.app} min-w-[140px]`}>
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell className="w-12 px-3 text-center">
                  <Skeleton className="h-4 w-4 mx-auto rounded" />
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-16 mx-auto rounded-full" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-24 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-16 mx-auto rounded-full" />
                </TableCell>
                <TableCell className={`text-center sticky right-0 z-10 min-w-[140px] ${DS_BG.surface}`}>
                  <div className="flex items-center justify-center gap-1.5">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:hidden">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className={`p-5 shadow-xs ${DS_BORDER.default} space-y-3`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className={`p-2.5 rounded-lg border ${DS_BORDER.subtle} ${DS_BG.app} space-y-2`}>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
            </div>
            <div className="flex justify-end gap-1.5 pt-2">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AttendanceRecordPageSkeleton() {
  return (
    <div className="space-y-4">
      <Card className={`shadow-xs ${DS_BORDER.default}`}>
        <div className="flex flex-row items-center justify-between gap-3 p-5 min-h-[76px]">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3.5 w-64" />
          </div>
        </div>
      </Card>

      <Card className={`p-5 shadow-xs ${DS_BORDER.default}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>
      </Card>

      <div className={`hidden lg:block ${DS_BG.surface} border ${DS_BORDER.default} rounded-xl overflow-hidden shadow-xs`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Name & ID</TableHead>
              <TableHead className="text-center">Department</TableHead>
              <TableHead className="text-center">Attendance Time</TableHead>
              <TableHead className="text-center w-28">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-28 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-32 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-8 w-8 rounded-lg mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:hidden">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className={`p-5 shadow-xs ${DS_BORDER.default} space-y-3`}>
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-5 w-24 rounded" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-20 rounded" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AttendanceCheckInSkeleton() {
  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className={`${DS_BG.surface} border ${DS_BORDER.default} rounded-xl overflow-hidden shadow-xs`}>
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>

        <div className="p-5 flex flex-col items-center space-y-4">
          <Skeleton className="w-full aspect-4/3 rounded-lg" />
          <div className="flex items-center justify-center gap-4 pt-1">
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
        </div>
      </div>

      <Skeleton className="w-full h-11 rounded-lg" />
    </div>
  );
}

export function AttendanceHistoryPageSkeleton() {
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className={`flex items-center gap-3 ${DS_BG.surface} p-5 rounded-xl border ${DS_BORDER.default} shadow-xs`}>
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="h-5 w-36" />
      </div>

      <Card className={`p-5 shadow-xs ${DS_BORDER.default}`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`${DS_BG.surface} border ${DS_BORDER.default} rounded-xl overflow-hidden shadow-xs`}
          >
            <div className={`p-5 ${DS_BG.app}/75 border-b ${DS_BORDER.default} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Skeleton className="w-2 h-2 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-5 w-20 rounded" />
            </div>
            <div className="p-5 space-y-4">
              <Skeleton className="w-full aspect-4/3 rounded-lg" />
              <div className="flex items-center justify-end pt-1">
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoginPageSkeleton() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4">
        <Skeleton className="h-10 w-10 rounded-xl mx-auto" />
        <Skeleton className="h-6 w-44 mx-auto pb-1" />
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-10" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
