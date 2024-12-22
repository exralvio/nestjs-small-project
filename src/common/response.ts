import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode || HttpStatus.OK;

    return next.handle().pipe(
      map((data) => ({
        status: 'success',
        statusCode,
        message: data?.message || 'Operation successful',
        ...(data?.results && { results: data?.results || null }),
      })),
      catchError((error) => {
        if (error instanceof BadRequestException) {
          response.status(HttpStatus.BAD_REQUEST).json({
            status: 'error',
            statusCode: HttpStatus.BAD_REQUEST,
            message: error.message,
          });
        } else {
          response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message || 'Internal Server Error',
          });
        }

        return throwError(() => error);
      }),
    );
  }
}
