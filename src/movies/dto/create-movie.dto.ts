import { IsString, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  releaseDate: Date;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsInt()
  @Min(1)
  @Max(10)
  rating: number;
}
