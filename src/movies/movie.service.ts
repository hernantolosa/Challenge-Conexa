// movie.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from '../movies/schemas/movie.schema';


@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<MovieDocument>) {}

  async findAll(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }

  async findOne(id: string): Promise<Movie> {
    return this.movieModel.findById(id).exec();
  }

  async create(movie: Movie): Promise<Movie> {
    const createdMovie = new this.movieModel(movie);
    return createdMovie.save();
  }

  async update(id: string, movie: Movie): Promise<Movie> {
    return this.movieModel.findByIdAndUpdate(id, movie, { new: true }).exec();
  }

  async delete(id: string): Promise<Movie> {
    return this.movieModel.findByIdAndDelete(id).exec();
  }
}

