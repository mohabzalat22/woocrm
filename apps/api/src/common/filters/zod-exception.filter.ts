import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import { Response } from 'express';
import { ZodError } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
@Catch(ZodValidationException)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const zodError = exception.getZodError() as ZodError;

    response.status(400).json({
      statusCode: 400,
      message: 'Validation failed',
      errors: zodError.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }
}
