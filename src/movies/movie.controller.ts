import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { MoviesService } from './movie.service';
import { Movie } from './schemas/movie.schema';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/roles.enum';
import { FailedToCreateMovieException, NoMovieFoundException, NoMoviesFoundException } from '../movies/exceptions/movies.exceptions';
import { CreateMovieDto } from './dto/create-movie.dto';


@Controller('api/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<{movies: Movie[]}> {
    const movies = await this.moviesService.findAll();
    if (!movies || movies.length === 0) {
      throw new NoMoviesFoundException();
    }
    return {movies};
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Movie> {
    const movie = await this.moviesService.findOne(id);
    if (!movie) {
      throw new NoMovieFoundException();
    }
    return movie;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    try {
      return await this.moviesService.create(createMovieDto);
    } catch (error) {
      throw new FailedToCreateMovieException();
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() movie: Movie): Promise<{code: string, description: string}> {
    try {
      await this.moviesService.update(id, movie);
      return {code: '000', description: `Success: Movie with id: ${id} updated successfully`}
    } catch (error) {
      throw new FailedToCreateMovieException();
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string): Promise<Movie> {
    try {
      return await this.moviesService.delete(id);
    } catch (error) {
      throw new NoMovieFoundException(); // Si no se encuentra la película al intentar eliminarla
    }
  }
}

