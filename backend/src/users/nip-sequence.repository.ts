import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/database/prisma.service.js';
import { NipSequence } from '../generated/prisma/client.js';

@Injectable()
export class NipSequenceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getSequenceForYear(year: number): Promise<NipSequence | null> {
    return this.prisma.nipSequence.findFirst({
      where: { year },
    });
  }

  async getNextSequence(year: number): Promise<number> {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.nipSequence.findFirst({
        where: { year },
      });

      if (!existing) {
        await tx.nipSequence.create({
          data: {
            year,
            lastValue: 1,
          },
        });
        return 1;
      }

      const nextVal = existing.lastValue + 1;
      await tx.nipSequence.update({
        where: { id: existing.id },
        data: { lastValue: nextVal },
      });

      return nextVal;
    });
  }

  async generateNip(gender: string, departmentCode: string, year?: number): Promise<string> {
    const targetYear = year ?? new Date().getFullYear();
    const nextSeq = await this.getNextSequence(targetYear);
    const genderDigit = gender.toUpperCase() === 'M' ? '1' : '2';
    const deptPadded = departmentCode.padStart(2, '0');
    const yearSuffix = String(targetYear).slice(-2);
    const seqPadded = String(nextSeq).padStart(4, '0');

    return `${genderDigit}${deptPadded}${yearSuffix}${seqPadded}`;
  }
}
