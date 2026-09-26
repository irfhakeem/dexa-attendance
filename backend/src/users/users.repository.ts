import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/database/prisma.service.js';
import { User, Prisma } from '../generated/prisma/client.js';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getUserInclude() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return {
      department: {
        select: {
          code: true,
          name: true,
        },
      },
      attendance: {
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          isDeleted: false,
        },
        take: 1,
      },
    };
  }

  async create(data: Prisma.UserCreateInput): Promise<any> {
    return this.prisma.user.create({
      data,
      include: this.getUserInclude(),
    });
  }

  async findById(id: string): Promise<any> {
    return this.prisma.user.findFirst({
      where: { id, isDeleted: false },
      include: this.getUserInclude(),
    });
  }

  async findByNip(nip: string): Promise<any> {
    return this.prisma.user.findFirst({
      where: { nip, isDeleted: false },
      include: this.getUserInclude(),
    });
  }

  async findAll(query?: {
    search?: string;
    nip?: string;
    name?: string;
    department?: string;
    is_attend?: string | boolean;
  }): Promise<any[]> {
    const where: Prisma.UserWhereInput = {
      isDeleted: false,
    };

    if (query?.search) {
      where.OR = [
        { nip: { contains: query.search } },
        { name: { contains: query.search } },
      ];
    } else {
      if (query?.nip) {
        where.nip = { contains: query.nip };
      }
      if (query?.name) {
        where.name = { contains: query.name };
      }
    }

    if (query?.department) {
      where.department = {
        OR: [
          { code: { equals: query.department } },
          { name: { contains: query.department } },
        ],
      };
    }

    if (query?.is_attend !== undefined) {
      const isAttendBool =
        query.is_attend === true || query.is_attend === 'true';
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      if (isAttendBool) {
        where.attendance = {
          some: {
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
            isDeleted: false,
          },
        };
      } else {
        where.attendance = {
          none: {
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
            isDeleted: false,
          },
        };
      }
    }

    return this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: this.getUserInclude(),
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<any> {
    return this.prisma.user.update({
      where: { id },
      data,
      include: this.getUserInclude(),
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
