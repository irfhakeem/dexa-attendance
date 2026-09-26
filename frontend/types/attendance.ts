import { User } from "./user";

export interface AttendanceRecord {
  id: number;
  date: string;
  photoKey: string;
  photoUrl?: string;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  stagingKey: string;
  expiresIn: number;
}

export interface CreateAttendanceDTO {
  stagingKey: string;
}

export interface AttendanceFilter {
  startDate?: string;
  endDate?: string;
  sort?: "latest" | "earliest" | "asc" | "desc";
  order?: "latest" | "earliest" | "asc" | "desc";
}

export interface TodayAttendanceStatus {
  hasCheckedInToday: boolean;
  todayRecord: AttendanceRecord | null;
}
