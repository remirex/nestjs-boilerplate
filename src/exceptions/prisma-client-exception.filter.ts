import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = exception.message.replace(/\n/g, '');
        response.status(status).json({
          statusCode: status,
          message: message,
        });
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = exception.message.replace(/\n/g, '');
        response.status(status).json({
          statusCode: status,
          message: message,
        });
        break;
      // TODO catch other error codes (e.g. 'P2000' or 'P2025')
      default:
        // default 500 error code
        super.catch(exception, host);
        break;
    }
  }
}
