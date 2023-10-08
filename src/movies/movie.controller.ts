import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { MoviesService } from './movie.service';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/roles.enum';
import { CreateMovieDto } from './dto/create-movie.dto';
import { CreateMovieResponseDto } from './dto/create-movie-response.dto';
import SerializableMovie from './serializers/movie.serializer';
import { AppSerializer } from '@app/serializers/app.serializer';



@UseInterceptors(AppSerializer)
@Controller('api/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(): Promise<{ movies: SerializableMovie[] }> {
    const movies = (await this.moviesService.findAll()).map(this.markSerializable);
    return { movies };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string): Promise<SerializableMovie> {
    return this.markSerializable(await this.moviesService.findOne(id));
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
  async delete(@Param('id') id: string): Promise<SerializableMovie> {
    return this.markSerializable(await this.moviesService.delete(id));
  }

  markSerializable(movie: Movie): SerializableMovie {
    return new SerializableMovie(movie);
  }
}