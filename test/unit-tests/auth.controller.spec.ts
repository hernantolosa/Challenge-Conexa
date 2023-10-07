import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@app/auth/auth.controller';
import { AuthService } from '@app/auth/auth.service';
import { UserRole } from '@app/users/enums/roles.enum';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const result = {
        "username": "conexatest2",
        "email": "conex2a@gmail.com",
        "role": "Regular User" as UserRole
    };
      jest.spyOn(authService, 'register').mockImplementation(() => Promise.resolve(result));

      expect(await authController.register({
        "username": "conexatest2",
        "email": "conex2a@gmail.com",
        "password": "password"
    })).toBe(result);
    });
  });

  describe('login', () => {
    it('should log in successfully', async () => {
      const user = { username: 'testuser', password: 'testpass' };
      jest.spyOn(authService, 'validateUserAndPassword').mockImplementation(() => Promise.resolve(user));

      const loginResult = {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNvbmV4YXRlc3QiLCJzdWIiOiI2NTIwNzRjY2NlMTY2MzU0MzAwYmYyNjIiLCJyb2xlIjoiUmVndWxhciBVc2VyIiwiaWF0IjoxNjk2NjI1OTE2LCJleHAiOjE2OTY2Mjk1MTZ9.vaDr-QIVIfXQszKhqgTvrGrLemlXzEGSU7bWOGOXl5A"
    };
      jest.spyOn(authService, 'login').mockImplementation(() => Promise.resolve(loginResult));

      expect(await authController.login(user.username, user.password)).toBe(loginResult);
    });

    it('should throw UnauthorizedException if invalid credentials are provided', async () => {
      jest.spyOn(authService, 'validateUserAndPassword').mockImplementation(() => null);

      await expect(authController.login('invaliduser', 'invalidpass')).rejects.toThrowError(UnauthorizedException);
    });
  });
});
