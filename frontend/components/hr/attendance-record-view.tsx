"use client";

import React, { useState, useEffect, useCallback } from "react";
import { attendanceService } from "@/services/attendance.service";
import { departmentService } from "@/services/department.service";
import { AttendanceRecord } from "@/types/attendance";
import { DepartmentDropdownItem } from "@/types/department";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { formatDateTime, formatDateIndonesian } from "@/lib/date-utils";
import { Search, Eye, Clock } from "lucide-react";
import { DS_TEXT, DS_BG, DS_BORDER, DS_FOCUS } from "@/constants/design-system";
import { ALL_DEPARTMENTS_OPTION } from "@/constants/dropdown-options";
import { useDebounce } from "@/hooks/use-debounce";

export function AttendanceRecordView() {
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [departments, setDepartments] = useState<DepartmentDropdownItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    departmentService
      .getDropdown()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDepartments(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await attendanceService.getAllAttendances({
        search: debouncedSearch.trim() || undefined,
        department: selectedDept || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        limit: 100,
      });
      setAttendances(res.data);
    } catch {
      setAttendances([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedDept, startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedDept("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-4">
      <Card className={`shadow-xs ${DS_BORDER.default}`}>
        <CardHeader className="flex flex-row items-center justify-between gap-3 p-5 min-h-[76px]">
          <div>
            <CardTitle className={`text-base font-bold ${DS_TEXT.primary} tracking-tight`}>
              Employee Attendance Records
            </CardTitle>
            <CardDescription className={`text-xs ${DS_TEXT.secondary} mt-1`}>
              View all employee attendance records.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card className={`p-5 shadow-xs ${DS_BORDER.default} space-y-4`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className={`text-xs font-medium ${DS_TEXT.primary} mb-1.5 block`}>
              Search Keywords
            </label>
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-2.5 ${DS_TEXT.secondary}`} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, NIP, or Department..."
                className={`w-full h-9 pl-9 pr-3 py-2 text-xs border ${DS_BORDER.strong} rounded-lg ${DS_TEXT.primary} ${DS_FOCUS.ring} ${DS_BG.surface}`}
              />
            </div>
          </div>

          <SelectField
            label="Department"
            placeholder="All Departments"
            value={selectedDept}
            onValueChange={setSelectedDept}
            options={[
              ALL_DEPARTMENTS_OPTION,
              ...departments.map((dept) => ({
                value: dept.code,
                label: `${dept.name} (${dept.code})`,
              })),
            ]}
          />

          <div>
            <label className={`text-xs font-medium ${DS_TEXT.primary} mb-1.5 block`}>
              Start Date
            </label>
            <div className="relative">
              <Input
                type="date"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={`text-xs font-medium ${DS_TEXT.primary} mb-1.5 block`}>
              End Date
            </label>
            <div className="relative">
              <Input
                type="date"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {(search || selectedDept || startDate || endDate) && (
          <button
            onClick={handleResetFilters}
            className={`text-xs ${DS_TEXT.secondary} ${DS_TEXT.primaryHover} underline font-normal lowercase`}
          >
            reset filter
          </button>
        )}
      </Card>

      {isLoading ? (
        <Card className={`p-12 text-center ${DS_TEXT.secondary} text-sm shadow-xs ${DS_BORDER.default}`}>
          Loading attendance records...
        </Card>
      ) : attendances.length === 0 ? (
        <Card className={`p-12 text-center shadow-xs ${DS_BORDER.default} space-y-2`}>
          <Clock className={`w-8 h-8 ${DS_TEXT.secondary} mx-auto`} />
          <p className={`text-sm font-semibold ${DS_TEXT.primary}`}>No Attendance Records Found</p>
          <p className={`text-xs ${DS_TEXT.secondary}`}>
            No attendance records match your filter criteria.
          </p>
        </Card>
      ) : (
        <>
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
                {attendances.map((rec) => (
                  <TableRow key={rec.id} className="cursor-pointer" onClick={() => setSelectedRecord(rec)}>
                    <TableCell className="whitespace-nowrap">
                      <span className={`font-semibold ${DS_TEXT.primary} block`}>{rec.user?.name || "-"}</span>
                      <span className={`text-[11px] ${DS_TEXT.secondary} block tabular-nums`}>NIP: {rec.user?.nip || "-"}</span>
                    </TableCell>
                    <TableCell className={`${DS_TEXT.primary} font-medium text-center`}>
                      {rec.user?.department?.name || rec.user?.department?.code || "-"}
                    </TableCell>
                    <TableCell className={`${DS_TEXT.primary} whitespace-nowrap tabular-nums text-center`}>
                      {formatDateTime(rec.date)} WIB
                    </TableCell>
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setSelectedRecord(rec)}
                          title="View User Details"
                          className="h-8 w-8 p-1.5"
                        >
                          <Eye className={`w-5 h-5 ${DS_TEXT.secondary} ${DS_TEXT.primaryHover} transition-colors`} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:hidden">
            {attendances.map((rec) => (
              <Card
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className={`p-5 shadow-xs ${DS_BORDER.default} cursor-pointer active:${DS_BG.app} space-y-3`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`text-sm font-bold ${DS_TEXT.primary}`}>{rec.user?.name || "-"}</h4>
                    <p className={`text-xs ${DS_TEXT.secondary} tabular-nums`}>ID: {rec.user?.nip || "-"}</p>
                  </div>
                  <span className={`text-[11px] font-medium ${DS_TEXT.primary} tabular-nums ${DS_BG.muted} px-2 py-0.5 rounded`}>
                    {formatDateTime(rec.date)} WIB
                  </span>
                </div>

                <div className={`flex items-center justify-between text-xs ${DS_TEXT.primary} ${DS_BORDER.subtle}`}>
                  <span>{rec.user?.department?.name || "-"}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRecord(rec);
                    }}
                    className={`text-xs h-6 px-2 ${DS_TEXT.primary}`}
                  >
                    See Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title="Attendance Record Details"
          description={formatDateIndonesian(selectedRecord.date)}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className={`w-full aspect-4/3 max-w-sm mx-auto rounded-xl overflow-hidden border ${DS_BORDER.strong} ${DS_BG.dark} shadow-xs`}>
              <img
                src={selectedRecord.photoUrl}
                alt="Employee Selfie Photo"
                style={{ transform: "none" }}
                className="w-full h-full object-cover"
              />
            </div>

            <div className={`p-5 ${DS_BG.app} rounded-xl border ${DS_BORDER.default} space-y-2`}>
              <div className="flex justify-between">
                <span className={DS_TEXT.secondary}>Employee Name:</span>
                <span className={`font-bold ${DS_TEXT.primary}`}>{selectedRecord.user?.name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className={DS_TEXT.secondary}>Employee ID:</span>
                <span className={`font-medium ${DS_TEXT.primary} tabular-nums`}>{selectedRecord.user?.nip || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className={DS_TEXT.secondary}>Department:</span>
                <span className={`font-semibold ${DS_TEXT.primary}`}>
                  {selectedRecord.user?.department?.name || selectedRecord.user?.department?.code || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={DS_TEXT.secondary}>Gender:</span>
                <span className={DS_TEXT.primary}>
                  {selectedRecord.user?.gender === "M" ? "Male" : "Female"}
                </span>
              </div>
              <div className={`flex justify-between border-t ${DS_BORDER.default} pt-1.5`}>
                <span className={DS_TEXT.secondary}>Attendance Time:</span>
                <span className={`font-semibold ${DS_TEXT.primary} tabular-nums`}>
                  {formatDateTime(selectedRecord.date)} WIB
                </span>
              </div>
            </div>

            <div className={`flex items-center justify-between pt-2 border-t ${DS_BORDER.default}`}>
              <span className={`text-[11px] ${DS_TEXT.secondary}`}>This attendance record is view-only</span>
              <Button size="sm" variant="secondary" onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
