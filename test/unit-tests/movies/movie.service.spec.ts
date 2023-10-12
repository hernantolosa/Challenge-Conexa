import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '@app/movies/movie.service';
import { getModelToken } from '@nestjs/mongoose';
import { Movie } from '@app/movies/schemas/movie.schema';
import { FailedToCreateMovieException, NoMovieFoundException, NoMoviesFoundException } from '@app/movies/exceptions/movies.exceptions';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieModel: any;

  beforeEach(async () => {
    movieModel = {
      find: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getModelToken(Movie.name),
          useValue: movieModel,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result = { movies: [{
        "title": "Test movie",
        "description": "Set three years after the events of Star Wars, the film recounts the battle between the malevolent Galactic Empire, led by the Emperor, and the Rebel Alliance, led by Princess Leia. Luke Skywalker trains to master the Force so he can confront the powerful Sith lord, Darth Vader.",
        "releaseDate": "2023-05-29T03:00:00.000Z",
        "director": "Test",
        "rating": 7
    }]};
      movieModel.find.mockResolvedValue(result);
      expect(await service.findAll()).toEqual(result);
    });

    it('should throw NoMoviesFoundException', async () => {
      jest.spyOn(movieModel, 'find').mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrowError(new NoMoviesFoundException());
    });
  });

  describe('findOne', () => {
    it('should return a movie by ID', async () => {
      const result = {
        "title": "Test movie",
        "description": "Set three years after the events of Star Wars, the film recounts the battle between the malevolent Galactic Empire, led by the Emperor, and the Rebel Alliance, led by Princess Leia. Luke Skywalker trains to master the Force so he can confront the powerful Sith lord, Darth Vader.",
        "releaseDate": "2023-05-29T03:00:00.000Z",
        "director": "Test",
        "rating": 7
    };
    movieModel.findById.mockResolvedValue(result);
      expect(await service.findOne('123')).toEqual(result);
    });

    it('should throw NoMovieFoundException', async () => {
      jest.spyOn(movieModel, 'findById').mockResolvedValue(null);
      await expect(service.findOne('123')).rejects.toThrowError(new NoMovieFoundException());
    });
  });

  describe('create', () => {
    it('should successfully create a movie', async () => {
        const movieData = {
          "title": "Test movie",
          "description": "Set three years after the events of Star Wars, the film recounts the battle between the malevolent Galactic Empire, led by the Emperor, and the Rebel Alliance, led by Princess Leia. Luke Skywalker trains to master the Force so he can confront the powerful Sith lord, Darth Vader.",
          "releaseDate": "2023-05-29T03:00:00.000Z",
          "director": "Test",
          "rating": 7
      };
        const result = {
          "__id": '123',
          "title": "Test movie",
          "description": "Set three years after the events of Star Wars, the film recounts the battle between the malevolent Galactic Empire, led by the Emperor, and the Rebel Alliance, led by Princess Leia. Luke Skywalker trains to master the Force so he can confront the powerful Sith lord, Darth Vader.",
          "releaseDate": "2023-05-29T03:00:00.000Z",
          "director": "Test",
          "rating": 7,
          "__v": 0
      };
        
      movieModel.save.mockResolvedValue(result);
        expect(await service.create(movieData as unknown as Movie)).toEqual(result);
    });

    it('should throw FailedToCreateMovieException', async () => {
        const movieData = { title: 'New Test Movie' };
        
        movieModel.save.mockResolvedValue(null);
        await expect(service.create(movieData as Movie)).rejects.toThrowError(new FailedToCreateMovieException());
    });
});

    describe('update', () => {
        it('should successfully update a movie', async () => {
            const movieData = { title: 'Updated Test Movie' };
            const result = { _id: '123', title: 'Updated Test Movie' };
            
            movieModel.findByIdAndUpdate.mockResolvedValue(result);
            expect(await service.update('123', movieData as Movie)).toEqual(result);
        });

        it('should throw FailedToCreateMovieException when failing to update', async () => {
          movieModel.findByIdAndUpdate.mockResolvedValue(null);
            await expect(service.update('123', {} as Movie)).rejects.toThrowError(new FailedToCreateMovieException());
        });
    });

    describe('delete', () => {
        it('should successfully delete a movie', async () => {
            const result = { _id: '123', title: 'Deleted Test Movie' };
            
            jest.spyOn(movieModel, 'findByIdAndDelete').mockResolvedValue(result);
            expect(await service.delete('123')).toEqual(result);
        });

        it('should throw NoMovieFoundException when failing to delete', async () => {
            jest.spyOn(movieModel, 'findByIdAndDelete').mockResolvedValue(null);
            await expect(service.delete('123')).rejects.toThrowError(new NoMovieFoundException());
        });
    });

});

