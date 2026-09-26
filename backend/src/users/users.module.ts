import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { UsersRepository } from './users.repository.js';
import { NipSequenceRepository } from './nip-sequence.repository.js';
import { DepartmentsModule } from '../departments/departments.module.js';

@Module({
  imports: [DepartmentsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, NipSequenceRepository],
  exports: [UsersService, UsersRepository, NipSequenceRepository],
})
export class UsersModule {}
