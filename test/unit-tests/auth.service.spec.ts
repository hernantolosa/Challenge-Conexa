import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@app/auth/auth.service';
import { UsersService } from '@app/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsernameExists } from '@app/auth/exceptions/authorization.exceptions';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '@app/users/schemas/user.schema';
import { UserRole } from '@app/users/enums/roles.enum';

jest.mock('bcrypt', () => ({
    compare: jest.fn(() => Promise.resolve(true)),
    hash: jest.fn(() => Promise.resolve('mockedHashedPassword')),
  }));
  

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UsersService
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    
    
  });

  describe('validateUserAndPassword', () => {
    it('should return user details if valid username and password', async () => {
      const user = { username: 'test', password: 'hashedPassword', email: 'test@example.com', role: UserRole.REGULAR } as UserDocument;
      

      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(user);
      expect(bcrypt.compare).toBe(true);

  
      expect(await authService.validateUserAndPassword('test', 'password')).toEqual({
        userId: user._id,
        username: user.username,
        role: user.role
      });
    });
  
    it('should return null if invalid username or password', async () => {
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(null);
  
      expect(await authService.validateUserAndPassword('test', 'password')).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const mockUser = { username: 'test', userId: '123', role: 'user' };
      const mockToken = 'accessToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);
  
      expect(await authService.login(mockUser)).toEqual({ access_token: mockToken });
    });
  });

  describe('register', () => {
    it('should register a user and return the user details', async () => {
      jest.spyOn(usersService, 'existsByUsername').mockResolvedValue(false);
      jest.spyOn(usersService, 'existsByEmail').mockResolvedValue(false);
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword');
      const mockUser = { username: 'test', email: 'test@email.com', password: 'password', role: UserRole.REGULAR} as UserDocument;
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);
  
      const createUserDto = { username: 'test', email: 'test@email.com', password: 'password' };
      expect(await authService.register(createUserDto)).toEqual(mockUser);
    });
  
    it('should throw an error if username already exists', async () => {
      jest.spyOn(usersService, 'existsByUsername').mockResolvedValue(true);
      const createUserDto = { username: 'test', email: 'test@email.com', password: 'password' };
      
      await expect(authService.register(createUserDto)).rejects.toThrow(UsernameExists);
    });
  });
});
