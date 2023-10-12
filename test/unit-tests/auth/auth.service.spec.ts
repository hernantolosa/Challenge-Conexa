import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@app/auth/auth.service';
import { UsersService } from '@app/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsernameExists } from '@app/auth/exceptions/authorization.exceptions';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@app/users/enums/roles.enum';

jest.mock('bcrypt', () => ({
    compare: jest.fn(() => Promise.resolve(true)),
    hash: jest.fn(() => Promise.resolve('mockedHashedPassword')),
}));

const mockUsersService = {
  findOneByUsername: jest.fn(),
  existsByUsername: jest.fn(),
  existsByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUserAndPassword', () => {
    it('should return user details if valid username and password', async () => {
      const user: any = {
        _id: 'sampleId',
        username: 'test',
        password: 'hashedPassword',
        email: 'test@example.com',
        role: UserRole.REGULAR,
      };

      mockUsersService.findOneByUsername.mockResolvedValue(user);

      const result = await authService.validateUserAndPassword('test', 'password');
      expect(result).toEqual({
        userId: user._id,
        username: user.username,
        role: user.role,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', user.password);
    });

    it('should return null if invalid username or password', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(null);

      const result = await authService.validateUserAndPassword('test', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const mockUser = { username: 'test', userId: '123', role: 'user' };
      const mockToken = 'accessToken';

      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await authService.login(mockUser);
      expect(result).toEqual({ access_token: mockToken });
    });
  });

  describe('register', () => {
    it('should register a user and return the user details', async () => {
      const mockUser = {
        username: 'test',
        email: 'test@email.com',
        password: 'mockedHashedPassword',
        role: UserRole.REGULAR,
      };

      const createUserDto = {
        username: 'test',
        email: 'test@email.com',
        password: 'password',
      };

      mockUsersService.existsByUsername.mockResolvedValue(false);
      mockUsersService.existsByEmail.mockResolvedValue(false);
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await authService.register(createUserDto);

      expect(result).toEqual({
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('should throw an error if username already exists', async () => {
      mockUsersService.existsByUsername.mockResolvedValue(true);

      const createUserDto = {
        username: 'test',
        email: 'test@email.com',
        password: 'password',
      };

      await expect(authService.register(createUserDto)).rejects.toThrow(UsernameExists);
    });
  });
});
