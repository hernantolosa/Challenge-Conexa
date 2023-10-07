import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from '../movies/schemas/movie.schema';
import { MoviesController } from '../movies/movie.controller';
import { MoviesService } from '../movies/movie.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    AuthModule
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MovieModule {}
