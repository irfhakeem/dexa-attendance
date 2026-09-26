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

  async generateNip(gender: string, date: Date = new Date()): Promise<string> {
    const targetYear = date.getFullYear();
    const nextSeq = await this.getNextSequence(targetYear);
    const genderDigit = gender.toUpperCase() === 'M' ? '1' : '2';
    const monthMM = String(date.getMonth() + 1).padStart(2, '0');
    const yearSuffix = String(targetYear).slice(-2);
    const seqPadded = String(nextSeq).padStart(4, '0');

    return `${genderDigit}${monthMM}${yearSuffix}${seqPadded}`;
  }
}
