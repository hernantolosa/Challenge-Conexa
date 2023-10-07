import { HttpException, HttpStatus } from '@nestjs/common';

export class NoMovieFoundException extends HttpException {
  constructor() {
    super(
      {
        code: '002',
        description: 'Error: The movie you provided was not found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class NoMoviesFoundException extends HttpException {
  constructor() {
    super(
      {
        code: '003',
        description: 'Error: No movies found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class FailedToCreateMovieException extends HttpException {
  constructor() {
    super(
      {
        code: '004',
        description: 'Error: Failed to create movie',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

