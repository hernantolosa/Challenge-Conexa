import SerializableMovie from '@app/movies/serializers/movie.serializer'
import { UserRole } from '@app/users/enums/roles.enum';
import { Movie } from '@app/movies/schemas/movie.schema';

describe('SerializableMovie', () => {

  let movie: Movie;
  let serializableMovie: SerializableMovie;

  beforeEach(() => {
    movie = {
      title: 'Test Movie',
      description: 'Description of Test Movie',
      releaseDate: new Date(),
      director: 'Test Director',
      rating: 9,
    };
    serializableMovie = new SerializableMovie(movie);
  });

  describe('serialize', () => {
    it('should serialize for ADMIN', () => {
      const roles = [UserRole.ADMIN];
      const serializedData = serializableMovie.serialize(roles);
      expect(serializedData).toEqual(movie);
    });

    it('should serialize for REGULAR', () => {
      const roles = [UserRole.REGULAR];
      const serializedData = serializableMovie.serialize(roles);
      const expectedData = {
        title: movie.title,
        description: movie.description,
        releaseDate: movie.releaseDate,
        director: movie.director,
        rating: movie.rating
      };
      expect(serializedData).toEqual(expectedData);
    });

    it('should serialize for REGULAR when no matching role is found', () => {
      const roles  = [UserRole.REGULAR];
      const serializedData = serializableMovie.serialize(roles);
      const expectedData = {
        title: movie.title,
        description: movie.description,
        releaseDate: movie.releaseDate,
        director: movie.director,
        rating: movie.rating
      };
      expect(serializedData).toEqual(expectedData);
    });
  });

});
