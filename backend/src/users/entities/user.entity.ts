export class User {
  id: string;
  nip: string;
  name: string;
  gender: string;
  isHR: boolean;
  department?: {
    code: string;
    name: string;
  };
  is_attend: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial?: Partial<User>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  static fromPrisma(user: any): User {
    const {
      password: _password,
      deletedAt: _deletedAt,
      isDeleted: _isDeleted,
      departmentId: _departmentId,
      attendance,
      department,
      ...safeUser
    } = user;

    return new User({
      ...safeUser,
      department: department
        ? {
            code: department.code,
            name: department.name,
          }
        : undefined,
      is_attend:
        typeof user.is_attend === 'boolean'
          ? user.is_attend
          : Array.isArray(attendance) && attendance.length > 0,
    });
  }
}
