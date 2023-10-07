import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

export abstract class BaseSerializer implements NestInterceptor {
  abstract intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
