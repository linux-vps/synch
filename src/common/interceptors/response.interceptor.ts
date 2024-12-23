import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, SuccessResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        const response: SuccessResponse<T> = {
          success: true,
          message: 'Operation successful',
          data,
          meta: {
            timestamp: new Date().toISOString(),
            path: request.url,
          },
        };

        // If data includes pagination metadata
        if (data && data.meta && data.data) {
          response.data = data.data;
          response.meta = {
            ...response.meta,
            ...data.meta,
          };
        }

        return response;
      }),
    );
  }
}
