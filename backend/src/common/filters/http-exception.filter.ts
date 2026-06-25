import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const esHttpException = exception instanceof HttpException;
    const status = esHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = esHttpException
      ? this.extraerMensaje(exception)
      : 'Ha ocurrido un error inesperado';

    if (!esHttpException) {
      this.logger.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private extraerMensaje(exception: HttpException): unknown {
    const exceptionResponse = exception.getResponse();
    return typeof exceptionResponse === 'string'
      ? exceptionResponse
      : (exceptionResponse as { message?: unknown }).message ?? exception.message;
  }
}
