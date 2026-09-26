import { apiClient } from "./api-client";
import { ApiResponse, ApiPaginatedResponse } from "@/types/api";
import {
  AttendanceRecord,
  AttendanceFilter,
  TodayAttendanceStatus,
  PresignedUploadResponse,
} from "@/types/attendance";

export interface IAttendanceService {
  getPresignedUpload(extension?: string, mimeType?: string): Promise<ApiResponse<PresignedUploadResponse>>;
  uploadImageToS3(uploadUrl: string, blob: Blob, mimeType?: string): Promise<void>;
  submitAttendanceWithStagingKey(stagingKey: string): Promise<ApiResponse<AttendanceRecord>>;
  submitAttendance(blob: Blob): Promise<ApiResponse<AttendanceRecord>>;
  checkTodayAttendance(userId?: string): Promise<ApiResponse<TodayAttendanceStatus>>;
  getPersonalHistory(filters?: AttendanceFilter & { page?: number; limit?: number }): Promise<ApiPaginatedResponse<AttendanceRecord>>;
  getAllAttendances(filters?: AttendanceFilter & { search?: string; department?: string; page?: number; limit?: number }): Promise<ApiPaginatedResponse<AttendanceRecord>>;
}

export class AttendanceService implements IAttendanceService {
  private getTodayDatePrefix(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async getPresignedUpload(
    extension: string = "jpg",
    mimeType: string = "image/jpeg"
  ): Promise<ApiResponse<PresignedUploadResponse>> {
    return apiClient.get<PresignedUploadResponse>("/attendances/presigned-upload", {
      params: { extension, mimeType },
    });
  }

  async uploadImageToS3(uploadUrl: string, blob: Blob, mimeType: string = "image/jpeg"): Promise<void> {
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": mimeType,
      },
      body: blob,
    });
    if (!res.ok) {
      throw {
        success: false,
        error: {
          code: "UPLOAD_FAILED",
          message: "Failed to upload photo to storage",
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  async submitAttendanceWithStagingKey(stagingKey: string): Promise<ApiResponse<AttendanceRecord>> {
    return apiClient.post<AttendanceRecord>("/attendances", { stagingKey });
  }

  async submitAttendance(blob: Blob): Promise<ApiResponse<AttendanceRecord>> {
    const presigned = await this.getPresignedUpload("jpg", "image/jpeg");
    await this.uploadImageToS3(presigned.data.uploadUrl, blob, "image/jpeg");
    return this.submitAttendanceWithStagingKey(presigned.data.stagingKey);
  }

  async checkTodayAttendance(_userId?: string): Promise<ApiResponse<TodayAttendanceStatus>> {
    const today = this.getTodayDatePrefix();
    try {
      const res = await apiClient.get<AttendanceRecord[]>("/attendances/history", {
        params: {
          startDate: today,
          endDate: today,
        },
      });

      const records = Array.isArray(res.data) ? res.data : [];
      const todayRecord = records.length > 0 ? records[0] : null;

      return {
        success: true,
        data: {
          hasCheckedInToday: !!todayRecord,
          todayRecord,
        },
        timestamp: res.timestamp,
      };
    } catch {
      return {
        success: true,
        data: {
          hasCheckedInToday: false,
          todayRecord: null,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getPersonalHistory(
    filters?: AttendanceFilter & { page?: number; limit?: number }
  ): Promise<ApiPaginatedResponse<AttendanceRecord>> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 5;

    const res = await apiClient.get<AttendanceRecord[]>("/attendances/history", {
      params: {
        startDate: filters?.startDate,
        endDate: filters?.endDate,
        sort: filters?.sort || filters?.order || "desc",
      },
    });

    const records = Array.isArray(res.data) ? res.data : [];
    const totalItems = records.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = records.slice(startIndex, startIndex + limit);

    return {
      success: res.success,
      data: paginatedData,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
      timestamp: res.timestamp,
    };
  }

  async getAllAttendances(
    filters?: AttendanceFilter & { search?: string; department?: string; page?: number; limit?: number }
  ): Promise<ApiPaginatedResponse<AttendanceRecord>> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const search = filters?.search?.toLowerCase();

    const res = await apiClient.get<AttendanceRecord[]>("/attendances", {
      params: {
        startDate: filters?.startDate,
        endDate: filters?.endDate,
        sort: filters?.sort || filters?.order || "desc",
      },
    });

    let records = Array.isArray(res.data) ? res.data : [];

    if (search) {
      records = records.filter(
        (a) =>
          a.user?.name?.toLowerCase().includes(search) ||
          a.user?.nip?.toLowerCase().includes(search) ||
          a.user?.department?.name?.toLowerCase().includes(search) ||
          a.user?.department?.code?.toLowerCase().includes(search)
      );
    }

    if (filters?.department) {
      records = records.filter(
        (a) =>
          a.user?.department?.code === filters.department ||
          a.user?.department?.name === filters.department
      );
    }

    const totalItems = records.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = records.slice(startIndex, startIndex + limit);

    return {
      success: res.success,
      data: paginatedData,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
      timestamp: res.timestamp,
    };
  }
}

export const attendanceService = new AttendanceService();
