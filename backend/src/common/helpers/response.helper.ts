import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export class ResponseHelper {
  static success<T>(
    res: Response,
    data: T,
    statusCode: number = HttpStatus.OK,
    message?: string,
  ) {
    return res.status(statusCode).json({
      success: true,
      data,
      ...(message ? { message } : {}),
      timestamp: new Date().toISOString(),
    });
  }

  static successPagination<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    statusCode: number = HttpStatus.OK,
    message?: string,
  ) {
    return res.status(statusCode).json({
      success: true,
      data,
      pagination,
      ...(message ? { message } : {}),
      timestamp: new Date().toISOString(),
    });
  }

  static badRequest(
    res: Response,
    message: string = 'Bad request',
    details?: any,
  ) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message,
        ...(details ? { details } : {}),
      },
      timestamp: new Date().toISOString(),
    });
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized',
    details?: any,
  ) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message,
        ...(details ? { details } : {}),
      },
      timestamp: new Date().toISOString(),
    });
  }

  static forbidden(
    res: Response,
    message: string = 'Forbidden',
    details?: any,
  ) {
    return res.status(HttpStatus.FORBIDDEN).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message,
        ...(details ? { details } : {}),
      },
      timestamp: new Date().toISOString(),
    });
  }

  static notFound(
    res: Response,
    message: string = 'Resource not found',
    details?: any,
  ) {
    return res.status(HttpStatus.NOT_FOUND).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message,
        ...(details ? { details } : {}),
      },
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res: Response,
    message: string = 'Internal server error',
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: any,
  ) {
    return res.status(statusCode).json({
      success: false,
      error: {
        code: `HTTP_${statusCode}`,
        message,
        ...(details ? { details } : {}),
      },
      timestamp: new Date().toISOString(),
    });
  }
}
