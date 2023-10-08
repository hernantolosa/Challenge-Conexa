import { UserRole } from '@app/users/enums/roles.enum';
import { User } from '@app/users/types/user.type';
import { NestInterceptor, ExecutionContext, CallHandler, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class AppSerializer implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        if (!user) {
          throw new ForbiddenException('Access denied!');
        }

        return this.applyRoleBasedSerialization(data, [user.role]);
      }),
    );
  }

  applyRoleBasedSerialization(data: any, roles: UserRole[]): any {
    if (data instanceof Serializable) {
      return data.serialize(roles);
    }
  
    if (Array.isArray(data)) {
      return data.map((item) => this.applyRoleBasedSerialization(item, roles));
    }
  
    if (typeof data === 'object' && data !== null) {
      const serializedObj = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          serializedObj[key] = this.applyRoleBasedSerialization(data[key], roles);
        }
      }
      return serializedObj;
    }
  
    return data;
  }
}

export abstract class Serializable<T> {
  constructor(private readonly _object: T) {}

  protected get(): T {
    return this._object;
  }

  abstract serialize(roles: UserRole[]): Partial<T>;
}