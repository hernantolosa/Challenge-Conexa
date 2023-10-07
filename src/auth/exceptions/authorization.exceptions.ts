import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernameExists extends HttpException {
  constructor() {
    super(
      {
        code: '005',
        description: 'Error: Username already registered',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class EmailExists extends HttpException {
    constructor() {
      super(
        {
          code: '005',
          description: 'Error: Email already registered',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }