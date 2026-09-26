import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let code = `HTTP_${status}`;
    let message = 'Internal server error';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        if (resObj.error && typeof resObj.error === 'string') {
          code = resObj.error.toUpperCase().replace(/\s+/g, '_');
        }
        if (resObj.message) {
          if (Array.isArray(resObj.message)) {
            message = resObj.message.join(', ');
            details = resObj.message.map((msg: string) => ({
              code: 'VALIDATION_ERROR',
              message: msg,
            }));
          } else {
            message = resObj.message;
          }
        }
        if (resObj.code) {
          code = resObj.code;
        }
        if (resObj.details) {
          details = resObj.details;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
      timestamp: new Date().toISOString(),
    });
  }
}
