import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    // 格式化错误信息
    let message: string | string[];

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      message = (exceptionResponse as { message?: unknown }).message as
        | string
        | string[];
    } else {
      message = exception.message;
    }

    response.status(status).json({
      code: status,
      message: Array.isArray(message) ? message[0] : message, // 处理 DTO 验证返回的数组
      data: null,
    });
  }
}
