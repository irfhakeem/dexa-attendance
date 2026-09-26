export class CreateUserDto {
  name: string;
  gender: string;
  departmentCode: string;
  nip?: string;
  password?: string;
  isHR?: boolean;
}
