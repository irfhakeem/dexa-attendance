import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/database/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class AttendancesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userInclude = {
    user: {
      include: {
        department: true,
      },
    },
  };

  async create(data: Prisma.AttendanceCreateInput): Promise<any> {
    return this.prisma.attendance.create({
      data,
      include: this.userInclude,
    });
  }

  async findTodayByUserId(userId: string): Promise<any> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.attendance.findFirst({
      where: {
        userId,
        isDeleted: false,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: this.userInclude,
    });
  }

  async findByUserId(
    userId: string,
    query?: {
      startDate?: string | Date;
      endDate?: string | Date;
      sort?: string;
    },
  ): Promise<any[]> {
    const where: Prisma.AttendanceWhereInput = {
      userId,
      isDeleted: false,
    };

    if (query?.startDate || query?.endDate) {
      where.date = {};
      if (query.startDate) {
        const start = new Date(query.startDate);
        start.setHours(0, 0, 0, 0);
        where.date.gte = start;
      }
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const isAscending =
      query?.sort === 'earliest' || query?.sort === 'asc';

    return this.prisma.attendance.findMany({
      where,
      orderBy: {
        date: isAscending ? 'asc' : 'desc',
      },
      include: this.userInclude,
    });
  }

  async findAll(query?: {
    startDate?: string | Date;
    endDate?: string | Date;
    sort?: string;
  }): Promise<any[]> {
    const where: Prisma.AttendanceWhereInput = {
      isDeleted: false,
    };

    if (query?.startDate || query?.endDate) {
      where.date = {};
      if (query.startDate) {
        const start = new Date(query.startDate);
        start.setHours(0, 0, 0, 0);
        where.date.gte = start;
      }
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const isAscending =
      query?.sort === 'earliest' || query?.sort === 'asc';

    return this.prisma.attendance.findMany({
      where,
      orderBy: {
        date: isAscending ? 'asc' : 'desc',
      },
      include: this.userInclude,
    });
  }
}
