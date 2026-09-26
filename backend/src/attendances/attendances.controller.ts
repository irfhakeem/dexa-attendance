import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { AttendancesService } from './attendances.service.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { ResponseHelper } from '../common/helpers/response.helper.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Get('presigned-upload')
  async getPresignedUpload(
    @Res() res: Response,
    @CurrentUser() user: any,
    @Query('extension') extension?: string,
    @Query('mimeType') mimeType?: string,
  ) {
    const data = await this.attendancesService.getPresignedUpload(
      user.id,
      extension,
      mimeType,
    );
    return ResponseHelper.success(res, data, HttpStatus.OK);
  }

  @Post()
  async submit(
    @Res() res: Response,
    @CurrentUser() user: any,
    @Body() createAttendanceDto: CreateAttendanceDto,
  ) {
    const data = await this.attendancesService.submitAttendance(
      user.id,
      createAttendanceDto,
    );
    return ResponseHelper.success(
      res,
      data,
      HttpStatus.CREATED,
      'Attendance submitted successfully',
    );
  }

  @Get('history')
  async myHistory(
    @Res() res: Response,
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ) {
    const data = await this.attendancesService.findMyHistory(user.id, {
      startDate,
      endDate,
      sort: sort || order,
    });
    return ResponseHelper.success(res, data, HttpStatus.OK);
  }

  @Roles('HR')
  @Get()
  async findAll(
    @Res() res: Response,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ) {
    const data = await this.attendancesService.findAll({
      startDate,
      endDate,
      sort: sort || order,
    });
    return ResponseHelper.success(res, data, HttpStatus.OK);
  }
}
