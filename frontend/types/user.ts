export interface UserDepartment {
  code: string;
  name: string;
}

export interface User {
  id: string;
  nip: string;
  name: string;
  gender: "M" | "F" | string;
  isHR: boolean;
  department?: UserDepartment;
  is_attend: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  name: string;
  gender: "M" | "F";
  departmentCode: string;
  nip?: string;
  password?: string;
  isHR?: boolean;
}

export interface UpdateUserDTO {
  name?: string;
  gender?: "M" | "F";
  departmentCode?: string;
  password?: string;
  isHR?: boolean;
}

export interface UserQueryFilters {
  search?: string;
  nip?: string;
  name?: string;
  department?: string;
  is_attend?: string | boolean;
}
