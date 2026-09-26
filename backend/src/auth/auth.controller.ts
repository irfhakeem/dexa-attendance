import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ResponseHelper } from '../common/helpers/response.helper.js';
import { Public } from './decorators/public.decorator.js';
import { CurrentUser } from './decorators/current-user.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Res() res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const data = await this.authService.login(loginDto);
    return ResponseHelper.success(res, data, HttpStatus.OK, 'Login successful');
  }

  @Get('me')
  async getMe(
    @Res() res: Response,
    @CurrentUser() user: any,
  ) {
    const data = await this.authService.getMe(user.id);
    return ResponseHelper.success(res, data, HttpStatus.OK);
  }
}
