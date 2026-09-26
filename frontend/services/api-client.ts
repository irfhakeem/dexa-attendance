import { ApiResponse, ApiErrorResponse } from "@/types/api";

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("dexa_auth_token") : null;
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    };
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, config?.params);
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(config?.headers),
      ...config,
    });
    return this.handleResponse<ApiResponse<T>>(response);
  }

  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, config?.params);
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(config?.headers),
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    });
    return this.handleResponse<ApiResponse<T>>(response);
  }

  async patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, config?.params);
    const response = await fetch(url, {
      method: "PATCH",
      headers: this.getHeaders(config?.headers),
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    });
    return this.handleResponse<ApiResponse<T>>(response);
  }

  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, config?.params);
    const response = await fetch(url, {
      method: "PUT",
      headers: this.getHeaders(config?.headers),
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    });
    return this.handleResponse<ApiResponse<T>>(response);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, config?.params);
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(config?.headers),
      ...config,
    });
    return this.handleResponse<ApiResponse<T>>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorData: ApiErrorResponse = {
        success: false,
        error: {
          code: data?.error?.code || `HTTP_${response.status}`,
          message: data?.error?.message || data?.message || response.statusText || "Request failed to process",
          details: data?.error?.details,
        },
        timestamp: new Date().toISOString(),
      };
      throw errorData;
    }
    return data as T;
  }
}

export const apiClient = new ApiClient();
