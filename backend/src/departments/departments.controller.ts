import {
  Controller,
  Get,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { DepartmentsService } from './departments.service.js';
import { ResponseHelper } from '../common/helpers/response.helper.js';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get('dropdown')
  async findDropdown(@Res() res: Response) {
    const data = await this.departmentsService.findDropdown();
    return ResponseHelper.success(res, data, HttpStatus.OK);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const data = await this.departmentsService.findDropdown();
    return ResponseHelper.success(res, data, HttpStatus.OK);
  }
}
