import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from '@app/movies/movie.controller';
import { MoviesService } from '@app/movies/movie.service';
import { Movie } from '@app/movies/schemas/movie.schema';
import { NoMoviesFoundException, NoMovieFoundException, FailedToCreateMovieException } from '@app/movies/exceptions/movies.exceptions';


describe('MoviesController', () => {
  let moviesController: MoviesController;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    moviesController = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should return an array of movies', async () => {
    const result: Movie[] = [/* mock your movies here */];
    jest.spyOn(moviesService, 'findAll').mockResolvedValue(result);

    expect(await moviesController.findAll()).toEqual({ movies: result });
  });

  it('should throw NoMoviesFoundException when no movies are found', async () => {
    jest.spyOn(moviesService, 'findAll').mockResolvedValue([]);

    await expect(moviesController.findAll()).rejects.toThrowError(NoMoviesFoundException);
  });

  it('should return a specific movie', async () => {
    const mockMovie: any = {
        "_id": "65206c415a5251f857ce4b88",
        "title": "Interestellar",
        "description": "Interstellar is about Earth's last chance to find a habitable planet before a lack of resources causes the human race to go extinct. The film's protagonist is Cooper (Matthew McConaughey), a former NASA pilot who is tasked with leading a mission through a wormhole to find a habitable planet in another galaxy",
        "releaseDate": ("2023-05-29T03:00:00.000Z"),
        "director": "Cristopher Nolan",
        "rating": 9,
        "__v": 0
    };
    const movieId = '65206c415a5251f857ce4b88';
    jest.spyOn(moviesService, 'findOne').mockResolvedValue(mockMovie);

    expect(await moviesController.findOne(movieId)).toEqual(mockMovie);
  });

  it('should throw NoMovieFoundException when the specific movie is not found', async () => {
    const movieId = '65206c415a5251f857ce4b81';
    jest.spyOn(moviesService, 'findOne').mockResolvedValue(null);

    await expect(moviesController.findOne(movieId)).rejects.toThrow(NoMovieFoundException);
  });

  it('should create a movie', async () => {
    const mockMovieDto: any = {
        "title": "Star Wars: Episode V – The Empire Strikes Back",
        "description": "Set three years after the events of Star Wars, the film recounts the battle between the malevolent Galactic Empire, led by the Emperor, and the Rebel Alliance, led by Princess Leia. Luke Skywalker trains to master the Force so he can confront the powerful Sith lord, Darth Vader.",
        "releaseDate": "1980/07/31",
        "director": "George Lucas",
        "rating": 8
    };
    const mockMovie: any = {
        "title": "Star Wars: Episode V – The Empire Strikes Back",
        "description": "Set three years after the events of Star Wars, the film recounts the battle between the malevolent Galactic Empire, led by the Emperor, and the Rebel Alliance, led by Princess Leia. Luke Skywalker trains to master the Force so he can confront the powerful Sith lord, Darth Vader.",
        "releaseDate": "1980-07-31T03:00:00.000Z",
        "director": "George Lucas",
        "rating": 8,
        "_id": "6520709723e279d56749d955",
        "__v": 0
    };
    jest.spyOn(moviesService, 'create').mockResolvedValue(mockMovie);

    expect(await moviesController.create(mockMovieDto)).toEqual(mockMovie);
  });

  it('should throw FailedToCreateMovieException when movie creation fails', async () => {
    const mockMovieDto: any = {
        "title": 9999,
        "description": "Set three years after the events of Star Wars, the film recounts the battle between the malevolent Galactic Empire, led by the Emperor, and the Rebel Alliance, led by Princess Leia. Luke Skywalker trains to master the Force so he can confront the powerful Sith lord, Darth Vader.",
        "releaseDate": "1980/07/31",
        "rating": 8
    };
    jest.spyOn(moviesService, 'create').mockRejectedValue(new Error());

    await expect(moviesController.create(mockMovieDto)).rejects.toThrow(FailedToCreateMovieException);
  });

  it('should update a movie', async () => {
    const movieId = '65206c415a5251f857ce4b88';
    const mockRes = {
        "code": "000",
        "description": "Success: Movie with id: 65206c415a5251f857ce4b88 updated successfully"
    }
    const mockUpdatedData: any = {
        "title": "Star Wars: Episode VI – Return of the Jedi",
        "description": "After rescuing Han Solo from Jabba the Hutt, the Rebels attempt to destroy the second Death Star, while Luke struggles to help Darth Vader back from the dark side.",
        "releaseDate": "1983/07/31",
        "director": "George Lucas",
        "rating": 9
    };
    jest.spyOn(moviesService, 'update').mockResolvedValue(mockRes as any);

    expect(await moviesController.update(movieId, mockUpdatedData)).toEqual({
      code: '000',
      description: `Success: Movie with id: ${movieId} updated successfully`
    });
  });

  it('should throw FailedToCreateMovieException when movie update fails', async () => {
    const movieId = 'someId';
    const mockUpdatedData: any = {
        "title": "Star Wars: Episode VI – Return of the Jedi",
        "dd": "After rescuing Han Solo from Jabba the Hutt, the Rebels attempt to destroy the second Death Star, while Luke struggles to help Darth Vader back from the dark side.",
        "ddd": 999,
        "director": "George Lucas",
        "rating": 9
    };
    jest.spyOn(moviesService, 'update').mockRejectedValue(new Error());

    await expect(moviesController.update(movieId, mockUpdatedData)).rejects.toThrow(FailedToCreateMovieException);
  });

  it('should delete a movie', async () => {
    const mockMovie: any = '';
    const movieId = '652068bbc251673ef0afb956';
    jest.spyOn(moviesService, 'delete').mockResolvedValue(mockMovie);

    expect(await moviesController.delete(movieId)).toEqual(mockMovie);
  });

  it('should throw NoMovieFoundException when the movie to delete is not found', async () => {
    const movieId = 'someId';
    jest.spyOn(moviesService, 'delete').mockRejectedValue(new Error());

    await expect(moviesController.delete(movieId)).rejects.toThrow(NoMovieFoundException);
  });

});

