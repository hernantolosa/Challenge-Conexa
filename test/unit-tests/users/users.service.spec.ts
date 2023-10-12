import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@app/users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '@app/users/schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel;

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      countDocuments: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByUsername', () => {
    it('should return a user if found', async () => {
      const expectedUser = { username: 'JohnDoe' };
      mockUserModel.findOne.mockResolvedValue(expectedUser);

      const result = await service.findOneByUsername('JohnDoe');
      expect(result).toEqual(expectedUser);
    });

    it('should return undefined if user is not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.findOneByUsername('JohnDoe');
      expect(result).toBeUndefined();
    });
  });

  describe('existsByUsername', () => {
    it('should return true if user exists', async () => {
      const expectedUser = { username: 'JohnDoe' };
      mockUserModel.findOne.mockResolvedValue(expectedUser);

      const result = await service.existsByUsername('JohnDoe');
      expect(result).toBeTruthy();
    });

    it('should return false if user does not exist', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.existsByUsername('JohnDoe');
      expect(result).toBeFalsy();
    });
  });

  describe('existsByEmail', () => {
    it('should return true if email exists', async () => {
      mockUserModel.countDocuments.mockResolvedValue(1);

      const result = await service.existsByEmail('test@example.com');
      expect(result).toBeTruthy();
    });

    it('should return false if email does not exist', async () => {
      mockUserModel.countDocuments.mockResolvedValue(0);

      const result = await service.existsByEmail('test@example.com');
      expect(result).toBeFalsy();
    });
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const newUser = new User();
      newUser.username = 'JohnDoe';
      newUser.email = 'johndoe@example.com';
      mockUserModel.save.mockResolvedValue(newUser);

      const result = await service.create(newUser);
      expect(result).toEqual(newUser);
    });
  });
});
