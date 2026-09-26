import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service.js';
import { AttendancesController } from './attendances.controller.js';
import { AttendancesRepository } from './attendances.repository.js';

@Module({
  controllers: [AttendancesController],
  providers: [AttendancesService, AttendancesRepository],
  exports: [AttendancesService, AttendancesRepository],
})
export class AttendancesModule {}
