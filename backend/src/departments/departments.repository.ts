import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/database/prisma.service.js';
import { Department } from '../generated/prisma/client.js';

@Injectable()
export class DepartmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Department | null> {
    return this.prisma.department.findFirst({
      where: { id, isDeleted: false },
    });
  }

  async findByCode(code: string): Promise<Department | null> {
    return this.prisma.department.findFirst({
      where: { code, isDeleted: false },
    });
  }

  async findDropdown(): Promise<{ code: string; name: string }[]> {
    return this.prisma.department.findMany({
      where: { isDeleted: false },
      select: {
        code: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
