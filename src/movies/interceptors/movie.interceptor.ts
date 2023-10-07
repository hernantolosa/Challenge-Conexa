import { Movie } from '@app/movies/schemas/movie.schema';
import { UserRole } from '@app/users/enums/roles.enum';
import { User } from '@app/users/schemas/user.schema';
import { Injectable, ExecutionContext, CallHandler, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseSerializer } from '@app/serializers/base.serializer';

@Injectable()
export class MovieSerializationInterceptor extends BaseSerializer {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        if (!user) {
          throw new ForbiddenException('Access denied!');
        }

        return this.applyRoleBasedSerialization(data, user.role);
      }),
    );
  }

  private applyRoleBasedSerialization(data: any, role: UserRole): any {
    switch (role) {
      case UserRole.REGULAR:
        return this.serializeForRegular(data);
      case UserRole.ADMIN:
        return data;
      default:
        return this.serializeForRegular(data);
    }
  }

  private serializeForRegular(data: any): any {
    if (data && data.movies) {
      data.movies = data.movies.map(this.serializeMovie);
    }
    return data;
  }

  private serializeMovie(movie: Movie): Partial<Movie> {
    const { title, description, releaseDate, director, rating } = movie;
    return { title, description, releaseDate, director, rating };
  }
}
