import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '@app/auth/guard/roles.guard';
import { UserRole } from '@app/users/enums/roles.enum';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        Reflector,
      ],
    }).compile();

    rolesGuard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  const mockExecutionContext = (userRole: UserRole): ExecutionContext => ({
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ user: { role: [userRole] } }),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext);

  describe('canActivate', () => {
    it('should allow access if no roles are defined', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const context = mockExecutionContext(UserRole.ADMIN);

      expect(rolesGuard.canActivate(context)).toBe(true);
    });

    it('should allow access if user has a required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      const context = mockExecutionContext(UserRole.ADMIN);

      expect(rolesGuard.canActivate(context)).toBe(true);
    });

    it('should deny access if user does not have a required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      const context = mockExecutionContext(UserRole as any);

      expect(rolesGuard.canActivate(context)).toBe(false);
    });
  });
});

