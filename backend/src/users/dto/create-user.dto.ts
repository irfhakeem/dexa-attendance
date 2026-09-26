export class CreateUserDto {
  name: string;
  gender: string;
  departmentCode: string;
  password?: string;
  isHR?: boolean;
}
