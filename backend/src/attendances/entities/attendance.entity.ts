import { User } from '../../users/entities/user.entity.js';

export class Attendance {
  id: number;
  date: Date;
  photoKey: string;
  photoUrl?: string;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial?: Partial<Attendance>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  static fromPrisma(attendance: any): Attendance {
    const { deletedAt: _deletedAt, isDeleted: _isDeleted, ...safeAttendance } = attendance;
    if (safeAttendance.user) {
      safeAttendance.user = User.fromPrisma(safeAttendance.user);
    }
    return new Attendance(safeAttendance);
  }
}
