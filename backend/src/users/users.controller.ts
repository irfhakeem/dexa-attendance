import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ResponseHelper } from '../common/helpers/response.helper.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('HR')
  @Post()
  async create(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    return ResponseHelper.success(
      res,
      data,
      HttpStatus.CREATED,
      'User created successfully',
    );
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('search') search?: string,
    @Query('nip') nip?: string,
    @Query('name') name?: string,
    @Query('department') department?: string,
    @Query('is_attend') is_attend?: string,
  ) {
    const data = await this.usersService.findAll({
      search,
      nip,
      name,
      department,
      is_attend,
    });
    return ResponseHelper.success(res, data, HttpStatus.OK);
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const data = await this.usersService.findOne(id);
    return ResponseHelper.success(res, data, HttpStatus.OK);
  }

  @Roles('HR')
  @Patch(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const data = await this.usersService.update(id, updateUserDto);
    return ResponseHelper.success(
      res,
      data,
      HttpStatus.OK,
      'User updated successfully',
    );
  }

  @Roles('HR')
  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    const data = await this.usersService.remove(id);
    return ResponseHelper.success(
      res,
      data,
      HttpStatus.OK,
      'User deleted successfully',
    );
  }
}
