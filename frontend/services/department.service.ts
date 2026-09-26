import { apiClient } from "./api-client";
import { ApiResponse } from "@/types/api";
import { DepartmentDropdownItem } from "@/types/department";

export interface IDepartmentService {
  getDropdown(): Promise<ApiResponse<DepartmentDropdownItem[]>>;
}

export class DepartmentService implements IDepartmentService {
  async getDropdown(): Promise<ApiResponse<DepartmentDropdownItem[]>> {
    return apiClient.get<DepartmentDropdownItem[]>("/departments/dropdown");
  }
}

export const departmentService = new DepartmentService();
