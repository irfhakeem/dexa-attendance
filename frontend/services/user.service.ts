import { apiClient } from "./api-client";
import { ApiResponse, ApiPaginatedResponse } from "@/types/api";
import { User, CreateUserDTO, UpdateUserDTO, UserQueryFilters } from "@/types/user";

export interface IUserService {
  getUsers(filters?: UserQueryFilters & { page?: number; limit?: number }): Promise<ApiPaginatedResponse<User>>;
  getUserById(id: string): Promise<ApiResponse<User>>;
  createUser(dto: CreateUserDTO): Promise<ApiResponse<User>>;
  updateUser(id: string, dto: UpdateUserDTO): Promise<ApiResponse<User>>;
  deleteUser(id: string): Promise<ApiResponse<{ id: string }>>;
  deleteMultipleUsers(ids: string[]): Promise<ApiResponse<{ count: number }>>;
}

export class UserService implements IUserService {
  async getUsers(
    filters?: UserQueryFilters & { page?: number; limit?: number }
  ): Promise<ApiPaginatedResponse<User>> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;

    const res = await apiClient.get<User[]>("/users", {
      params: {
        search: filters?.search,
        department: filters?.department,
        nip: filters?.nip,
        name: filters?.name,
        is_attend: filters?.is_attend !== undefined ? String(filters.is_attend) : undefined,
      },
    });

    const allUsers = Array.isArray(res.data) ? res.data : [];
    const totalItems = allUsers.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = allUsers.slice(startIndex, startIndex + limit);

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

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/users/${id}`);
  }

  async createUser(dto: CreateUserDTO): Promise<ApiResponse<User>> {
    return apiClient.post<User>("/users", {
      name: dto.name.trim(),
      gender: dto.gender,
      departmentCode: dto.departmentCode,
      nip: dto.nip?.trim() || undefined,
      password: dto.password || undefined,
      isHR: dto.isHR ?? false,
    });
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<ApiResponse<User>> {
    return apiClient.patch<User>(`/users/${id}`, {
      name: dto.name?.trim(),
      gender: dto.gender,
      departmentCode: dto.departmentCode,
      password: dto.password || undefined,
      isHR: dto.isHR,
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<{ id: string }>> {
    return apiClient.delete<{ id: string }>(`/users/${id}`);
  }

  async deleteMultipleUsers(ids: string[]): Promise<ApiResponse<{ count: number }>> {
    await Promise.all(ids.map((id) => this.deleteUser(id)));
    return {
      success: true,
      data: { count: ids.length },
      message: `${ids.length} user(s) deleted`,
      timestamp: new Date().toISOString(),
    };
  }
}

export const userService = new UserService();
