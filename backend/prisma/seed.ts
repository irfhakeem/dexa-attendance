import { PrismaClient } from '../src/generated/prisma/client.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEPARTMENTS = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    code: 'HR',
    name: 'Human Resources',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    code: 'IT',
    name: 'Information Technology',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000003',
    code: 'MR',
    name: 'Marketing',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000004',
    code: 'FIN',
    name: 'Finance & Accounting',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000005',
    code: 'OPS',
    name: 'Operations & Logistics',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000006',
    code: 'GA',
    name: 'General Affairs',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000007',
    code: 'LGL',
    name: 'Legal & Compliance',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000008',
    code: 'RND',
    name: 'Research & Development',
  },
];

async function main() {
  for (const dept of DEPARTMENTS) {
    await prisma.department.upsert({
      where: { id: dept.id },
      update: {
        code: dept.code,
        name: dept.name,
      },
      create: dept,
    });
  }

  const hrDept = DEPARTMENTS[0];
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const currentYear = new Date().getFullYear();
  const yearSuffix = String(currentYear).slice(-2);
  const hrGender = 'M';
  const genderCode = hrGender === 'M' ? '1' : '2';
  const deptSequence = '01';
  const sequenceNumber = 1;
  const sequenceStr = String(sequenceNumber).padStart(4, '0');
  const hrNip = `${genderCode}${deptSequence}${yearSuffix}${sequenceStr}`;

  await prisma.user.upsert({
    where: { nip: hrNip },
    update: {},
    create: {
      id: 'u0000000-0000-0000-0000-000000000001',
      nip: hrNip,
      name: 'HR Administrator',
      password: hashedPassword,
      gender: hrGender,
      isHR: true,
      departmentId: hrDept.id,
    },
  });

  const existingSequence = await prisma.nipSequence.findFirst({
    where: { year: currentYear },
  });

  if (existingSequence) {
    if (existingSequence.lastValue < sequenceNumber) {
      await prisma.nipSequence.update({
        where: { id: existingSequence.id },
        data: { lastValue: sequenceNumber },
      });
    }
  } else {
    await prisma.nipSequence.create({
      data: {
        year: currentYear,
        lastValue: sequenceNumber,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
