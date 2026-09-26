import { apiClient } from "./api-client";
import { User } from "@/types/user";
import { ApiResponse } from "@/types/api";
import { LoginResponseData } from "@/types/auth";

export interface IAuthService {
  login(nip: string, password?: string): Promise<ApiResponse<User>>;
  getCurrentUser(): Promise<ApiResponse<User>>;
  logout(): Promise<void>;
}

export class AuthService implements IAuthService {
  async login(nip: string, password?: string): Promise<ApiResponse<User>> {
    const res = await apiClient.post<LoginResponseData>("/auth/login", {
      nip: nip.trim(),
      password: password || "password123",
    });

    if (typeof window !== "undefined" && res.data?.accessToken) {
      localStorage.setItem("dexa_auth_token", res.data.accessToken);
    }

    return {
      success: res.success,
      data: res.data.user,
      message: res.message,
      timestamp: res.timestamp,
    };
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>("/auth/me");
  }

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("dexa_auth_token");
    }
  }
}

export const authService = new AuthService();
