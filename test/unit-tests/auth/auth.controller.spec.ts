import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@app/auth/auth.controller';
import { AuthService } from '@app/auth/auth.service';
import { UserRole } from '@app/users/enums/roles.enum';
import { CreateUserDto } from '@app/users/dto/create-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let mockedAuthService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    // authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const result = {
        "username": "conexatest2",
        "email": "conex2a@gmail.com",
        "role": "Regular User" as UserRole
      } as unknown as CreateUserDto;
      mockedAuthService.register(result);

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
      const loginResult = {
        "access_token": "mockedAccessToken"
      };
      mockedAuthService.login.mockResolvedValue(loginResult);

      const response = await authController.login(user.username, user.password);
      expect(response).toBe(loginResult);
    });

    it('should throw UnauthorizedException if invalid credentials are provided', async () => {
      mockedAuthService.validateUserAndPassword.mockResolvedValue(null);

      await expect(authController.login('invaliduser', 'invalidpass')).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw any error encountered during validation', async () => {
      mockedAuthService.validateUserAndPassword.mockImplementation(() => {
        throw new Error('Unknown validation error');
      });

      await expect(authController.login('erroruser', 'errorpass')).rejects.toThrowError('Unknown validation error');
    });
  });
});


