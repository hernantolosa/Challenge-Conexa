import { Movie } from '@app/movies/schemas/movie.schema';
import { UserRole } from '@app/users/enums/roles.enum';
import { Serializable } from '@app/serializers/app.serializer';

export default class SerializableMovie extends Serializable<Movie> {
  serialize(roles: UserRole[]) {
    if (roles.includes(UserRole.ADMIN)) {
      return this.serializeForAdmin(this.get())
    }
    if (roles.includes(UserRole.REGULAR)) {
      return this.serializeForRegular(this.get())
    }
    return this.serializeForRegular(this.get())
  }

  private serializeForAdmin(movie: Movie): Partial<Movie> {
    return movie
  }

  private serializeForRegular(movie: Movie): Partial<Movie> {
    return {
      title: movie.title,
      description: movie.description,
      releaseDate: movie.releaseDate,
      director: movie.director,
      rating: movie.rating
    }
  }
}