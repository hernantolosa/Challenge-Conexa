import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from '../movies/schemas/movie.schema';
import { FailedToCreateMovieException, NoMovieFoundException, NoMoviesFoundException } from './exceptions/movies.exceptions';


@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<MovieDocument>) {}

  async findAll(): Promise<Movie[]> {
    const movies = await this.movieModel.find().exec();
    
    if (!movies || movies.length === 0) {
      throw new NoMoviesFoundException();
    }
    return movies;
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieModel.findById(id).exec();
    
    if (!movie) {
      throw new NoMovieFoundException();
    }
    return movie;
  }

  async create(movie: Movie): Promise<Movie> {
    const createdMovie = new this.movieModel(movie);
    const result = await createdMovie.save();
    
    if (!result) {
      throw new FailedToCreateMovieException();
    }
    
    return result;
  }

  async update(id: string, movie: Movie): Promise<Movie> {
    const updatedMovie = await this.movieModel.findByIdAndUpdate(id, movie, { new: true }).exec();
    
    if (!updatedMovie) {
      throw new FailedToCreateMovieException();
    }
    
    return updatedMovie;
  }

  async delete(id: string): Promise<Movie> {
    const movie = await this.movieModel.findByIdAndDelete(id).exec();
    
    if (!movie) {
      throw new NoMovieFoundException();
    }
    
    return movie;
  }
}

