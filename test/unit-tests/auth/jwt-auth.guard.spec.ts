import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '@app/auth/guard/jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    jwtAuthGuard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  describe('handleRequest', () => {
    it('should throw error if err is provided', () => {
      const error = new Error('Test error');
      expect(() => jwtAuthGuard.handleRequest(error, null)).toThrowError(error);
    });

    it('should throw UnauthorizedException if user is not provided', () => {
      expect(() => jwtAuthGuard.handleRequest(null, null)).toThrowError(UnauthorizedException);
    });

    it('should return user if user is provided', () => {
      const user = { id: 1, name: 'test' };
      expect(jwtAuthGuard.handleRequest(null, user)).toEqual(user);
    });
  });
});
