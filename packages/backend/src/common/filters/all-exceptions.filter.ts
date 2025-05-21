import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error('Exception caught:', exception);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    
    // HttpExceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'object' && exceptionResponse && 'message' in exceptionResponse 
        ? String(exceptionResponse.message) 
        : exception.message;
    } 
    // Prisma exceptions
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': // Unique constraint violation
          status = HttpStatus.CONFLICT;
          message = `Duplicate value for ${exception.meta?.target}`;
          break;
        case 'P2025': // Record not found
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;
        default:
          message = `Prisma error: ${exception.code} - ${exception.message}`;
      }
    }
    // Validation exceptions 
    else if (exception.name === 'ValidationError') {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: process.env.NODE_ENV === 'development' ? exception.stack : undefined,
    });
  }
}