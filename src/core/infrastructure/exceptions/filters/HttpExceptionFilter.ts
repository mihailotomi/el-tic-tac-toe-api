import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, LoggerService } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject("LoggerService") private logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error("Following error occured:");
    this.logger.error(exception.message);

    this.logger.warn(exception.stack);

    const errorResponse = exception.getResponse() as { message?: string | string[] };

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorResponse?.message,
    });
  }
}
