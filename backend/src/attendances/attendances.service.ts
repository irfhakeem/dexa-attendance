import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { AttendancesRepository } from './attendances.repository.js';
import { StorageService } from '../infrastructure/storage/storage.service.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { Attendance } from './entities/attendance.entity.js';

@Injectable()
export class AttendancesService {
  constructor(
    private readonly attendancesRepository: AttendancesRepository,
    private readonly storageService: StorageService,
  ) {}

  async getPresignedUpload(
    userId: string,
    extension: string = 'jpg',
    mimeType: string = 'image/jpeg',
  ): Promise<{ uploadUrl: string; stagingKey: string; expiresIn: number }> {
    const cleanExt = extension.replace('.', '').toLowerCase();
    const stagingKey = `staging/${userId}/${Date.now()}.${cleanExt}`;
    const uploadUrl = await this.storageService.getPresignedUploadUrl(
      stagingKey,
      mimeType,
      900,
    );

    return {
      uploadUrl,
      stagingKey,
      expiresIn: 900,
    };
  }

  async submitAttendance(
    userId: string,
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<Attendance> {
    const existing = await this.attendancesRepository.findTodayByUserId(userId);
    if (existing) {
      throw new BadRequestException(
        'You have already submitted attendance for today',
      );
    }

    const { stagingKey } = createAttendanceDto;
    if (!stagingKey || !stagingKey.startsWith(`staging/${userId}/`)) {
      throw new BadRequestException('Invalid staging key');
    }

    const filename = stagingKey.split('/').pop() || `${Date.now()}.jpg`;
    const destinationKey = `attendances/${userId}/${filename}`;

    try {
      await this.storageService.move(stagingKey, destinationKey);
    } catch {
      throw new BadRequestException(
        'Failed to process staging image. File may not exist or upload expired.',
      );
    }

    const record = await this.attendancesRepository.create({
      date: new Date(),
      photoKey: destinationKey,
      user: { connect: { id: userId } },
    });

    const photoUrl = await this.storageService.getPresignedUrl(destinationKey);
    const result = Attendance.fromPrisma(record);
    result.photoUrl = photoUrl;
    return result;
  }

  async findMyHistory(
    userId: string,
    query?: {
      startDate?: string;
      endDate?: string;
      sort?: string;
    },
  ): Promise<Attendance[]> {
    const records = await this.attendancesRepository.findByUserId(
      userId,
      query,
    );
    return Promise.all(
      records.map(async (record) => {
        const item = Attendance.fromPrisma(record);
        item.photoUrl = await this.storageService.getPresignedUrl(record.photoKey);
        return item;
      }),
    );
  }

  async findAll(query?: {
    startDate?: string;
    endDate?: string;
    sort?: string;
  }): Promise<Attendance[]> {
    const records = await this.attendancesRepository.findAll(query);
    return Promise.all(
      records.map(async (record) => {
        const item = Attendance.fromPrisma(record);
        item.photoUrl = await this.storageService.getPresignedUrl(record.photoKey);
        return item;
      }),
    );
  }
}
