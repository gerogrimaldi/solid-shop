import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    refreshToken: jest.fn(),
    register: jest.fn(),
    updateUser: jest.fn(),
    verifyToken: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerAuthDto = {
      username: 'testuser',
      email: 'test@email.com',
      password: 'testpassword',
    };

    it('should register a user successfully', async () => {
      const result = { id: 1, ...registerAuthDto };

      mockAuthService.register.mockResolvedValue(result);

      const response = await controller.register(registerAuthDto);

      expect(authService.register).toHaveBeenCalledWith(registerAuthDto);
      expect(response).toEqual(result);
    });

    it('should throw an error if register fails', async () => {
      mockAuthService.register.mockRejectedValue(
        new Error('Registration failed'),
      );

      await expect(controller.register(registerAuthDto)).rejects.toThrow(
        'Registration failed',
      );
      expect(authService.register).toHaveBeenCalledWith(registerAuthDto);
    });
  });

  describe('login', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@email.com',
    };

    const mockRes = {
      cookie: jest.fn(),
    } as any; // lo tipamos como any para evitar problemas de types

    const mockReq = {
      user: mockUser,
    } as any;

    it('should login a user and set cookies', async () => {
      const result = { message: 'Login exitoso' };

      mockAuthService.login.mockResolvedValue(result);

      const response = await controller.login(mockReq, mockRes);

      expect(authService.login).toHaveBeenCalledWith(mockUser, mockRes);
      expect(response).toEqual(result);
    });

    it('should throw an error if login fails', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Login failed'));

      await expect(controller.login(mockReq, mockRes)).rejects.toThrow(
        'Login failed',
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser, mockRes);
    });
  });

  describe('refreshToken', () => {
    const mockUser = {
      sub: 1,
      username: 'testuser',
      email: 'test@email.com',
      roles: ['USER'],
    };

    const mockRes = {
      cookie: jest.fn(),
    } as any;

    const mockReq = {
      user: mockUser,
    } as any;

    it('should refresh tokens and set cookies', async () => {
      const result = { message: 'Login exitoso' };

      mockAuthService.refreshToken.mockResolvedValue(result);

      const response = await controller.refreshToken(mockReq, mockRes);

      expect(authService.refreshToken).toHaveBeenCalledWith(mockUser, mockRes);
      expect(response).toEqual(result);
    });

    it('should throw an error if refreshToken fails', async () => {
      mockAuthService.refreshToken.mockRejectedValue(
        new Error('Refresh failed'),
      );

      await expect(controller.refreshToken(mockReq, mockRes)).rejects.toThrow(
        'Refresh failed',
      );
      expect(authService.refreshToken).toHaveBeenCalledWith(mockUser, mockRes);
    });
  });

  describe('logout', () => {
    it('should call authService.logout with response and return its result', async () => {
      const mockRes = {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockLogoutResult = { message: 'Logout exitoso' };

      jest
        .spyOn(authService, 'logout')
        .mockResolvedValue(mockLogoutResult as any);

      const result = await controller.logout(mockRes as any);

      expect(authService.logout).toHaveBeenCalledWith(mockRes);
      expect(result).toEqual(mockLogoutResult);
    });
  });

  describe('verifyToken', () => {
    it('should call authService.verifyToken with req and res and return result', async () => {
      const mockReq = { cookies: { Authentication: 'token123' } } as any;
      const mockRes = {} as Response;
      const mockVerifyResult = { userId: 1, role: 'user' };

      jest
        .spyOn(authService, 'verifyToken')
        .mockResolvedValue(mockVerifyResult as any);

      const result = await controller.verifyToken(mockReq, mockRes as any);

      expect(authService.verifyToken).toHaveBeenCalledWith(mockReq, mockRes);
      expect(result).toEqual(mockVerifyResult);
    });

    it('should throw an error if no token is provided', async () => {
      const mockReq = { cookies: {} } as any;
      const mockRes = {} as Response;

      jest
        .spyOn(authService, 'verifyToken')
        .mockRejectedValue(new Error('No autenticado'));

      await expect(
        controller.verifyToken(mockReq, mockRes as any),
      ).rejects.toThrow('No autenticado');
    });

    it('should throw an error if token is invalid', async () => {
      const mockReq = { cookies: { Authentication: 'invalidToken' } } as any;
      const mockRes = {} as Response;

      jest
        .spyOn(authService, 'verifyToken')
        .mockRejectedValue(new Error('Token inválido'));

      await expect(
        controller.verifyToken(mockReq, mockRes as any),
      ).rejects.toThrow('Token inválido');
    });
  });

  describe('updateUser', () => {
    it('should update a user and return the updated user', async () => {
      const mockId = '1';
      const mockDto = {
        username: 'newUsername',
        email: 'new@mail.com',
        password: '1234',
      };
      const mockUpdatedUser = {
        id: mockId,
        username: 'newUsername',
        email: 'new@mail.com',
      };

      jest
        .spyOn(authService, 'updateUser')
        .mockResolvedValue(mockUpdatedUser as any);

      const result = await controller.updateUser(mockId, mockDto);

      expect(authService.updateUser).toHaveBeenCalledWith(mockId, mockDto);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw an error if user is not found', async () => {
      const mockId = '1';
      const mockDto = {
        username: 'newUsername',
        email: 'new@mail.com',
        password: '1234',
      };

      jest
        .spyOn(authService, 'updateUser')
        .mockRejectedValue(new Error('User not found'));

      await expect(controller.updateUser(mockId, mockDto)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw an error if update fails', async () => {
      const mockId = '1';
      const mockDto = {
        username: 'newUsername',
        email: 'new@mail.com',
        password: '1234',
      };

      jest
        .spyOn(authService, 'updateUser')
        .mockRejectedValue(new Error('Internal error'));

      await expect(controller.updateUser(mockId, mockDto)).rejects.toThrow(
        'Internal error',
      );
    });
  });
});
