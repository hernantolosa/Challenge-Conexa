import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { MoviesService } from './movie.service';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/roles.enum';
import { CreateMovieDto } from './dto/create-movie.dto';
import { CreateMovieResponseDto } from './dto/create-movie-response.dto';
import { GetUser } from '@app/users/decorators/get-user.decorator';
import { User } from '@app/users/types/user.type';


@Controller('api/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@GetUser() user: User): Promise<{ movies: any[] }> {
    const movies = await this.moviesService.findAll(user.role);
    return { movies };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string, @GetUser() user: User): Promise<Movie> {
    return this.moviesService.findOne(id, user.role);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createMovieDto: CreateMovieDto): Promise<CreateMovieResponseDto> {
    const movie = await this.moviesService.create(createMovieDto) as MovieDocument;
    return {
      code: "000",
      description: `Success: Movie id ${movie._id} created successfully`
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() movie: Movie): Promise<{code: string, description: string}> {
    await this.moviesService.update(id, movie);
    return {code: '000', description: `Success: Movie with id: ${id} updated successfully`}
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string): Promise<Movie> {
    return await this.moviesService.delete(id);
  }
}