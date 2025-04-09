import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  HttpException,
  NotFoundException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Roles } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { jest } from '@jest/globals';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { ExecutionContext } from '@nestjs/common';
// import { RolesGuard } from 'src/auth/custom-decorators/roles.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findFirst: jest.fn(),
      },
      cart: {
        create: jest.fn().mockResolvedValue({ id: 'mockCartId' }),
      },
      wishlist: {
        create: jest.fn().mockResolvedValue({ id: 'mockWishlistId' }),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    };

    const mockUsersService = {
      findAll: jest.fn(),
      getUserById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      createUser: jest.fn(async (dto) => {
        const cart = await mockPrismaService.cart.create({ data: {} });
        const wishlist = await mockPrismaService.wishlist.create({ data: {} });

        return mockPrismaService.user.create({
          data: {
            ...dto,
            cart: { connect: { id: cart.id } },
            wishlist: { connect: { id: wishlist.id } },
          },
        });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create cart and wishlist before creating a user', async () => {
      const dto: CreateUserDto = {
        username: 'test user',
        email: 'test@user.com',
        password: 'Testuser1!',
      };

      const cart = {
        id: 'cart-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const wishlist = {
        id: 'wishlist-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const createdUser = {
        id: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        cartId: cart.id,
        wishlistId: wishlist.id,
        username: dto.username,
        email: dto.email,
        password: dto.password,
        Role: Roles.USER,
      };

      jest.spyOn(prisma.cart, 'create').mockResolvedValue(cart);
      jest.spyOn(prisma.wishlist, 'create').mockResolvedValue(wishlist);
      jest.spyOn(prisma.user, 'create').mockResolvedValue(createdUser);

      const result = await service.createUser(dto);

      expect(prisma.cart.create).toHaveBeenCalled();
      expect(prisma.wishlist.create).toHaveBeenCalled();
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          wishlist: { connect: { id: wishlist.id } },
          cart: { connect: { id: cart.id } },
        },
      });
      expect(result).toEqual(createdUser);
    });

    it('should throw an error if user already exists', async () => {
      const dto: CreateUserDto = {
        username: 'existing user',
        email: 'existing@user',
        password: 'Existinguser1!',
      };

      jest
        .spyOn(service, 'createUser')
        .mockRejectedValue(
          new HttpException(
            `user with email: ${dto.email} already exists`,
            HttpStatus.CONFLICT,
          ),
        );

      await expect(controller.createUser(dto)).rejects.toThrow(HttpException);
    });

    it('should handle database errors gracefully', async () => {
      const dto: CreateUserDto = {
        username: 'new user',
        email: 'new@user',
        password: 'Newuser1!',
      };

      jest
        .spyOn(service, 'createUser')
        .mockRejectedValue(new Error('Database error'));

      await expect(controller.createUser(dto)).rejects.toThrow(Error);
    });

    it('should throw an error if cart creation fails', async () => {
      const dto: CreateUserDto = {
        username: 'test user',
        email: 'test@user',
        password: 'Testuser1!',
      };

      jest
        .spyOn(prisma.cart, 'create')
        .mockRejectedValue(new Error('Cart creation failed'));

      await expect(controller.createUser(dto)).rejects.toThrow(Error);
    });

    it('should throw an error if wishlist creation fails', async () => {
      const dto: CreateUserDto = {
        username: 'test user',
        email: 'test@user',
        password: 'Testuser1!',
      };

      jest.spyOn(prisma.cart, 'create').mockResolvedValue({
        id: 'cart-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest
        .spyOn(prisma.wishlist, 'create')
        .mockRejectedValue(new Error('Wishlist creation failed'));

      await expect(controller.createUser(dto)).rejects.toThrow(Error);
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users without password', async () => {
      const mockUsers = [
        {
          username: 'user1',
          email: 'user1@email.com',
          role: 'USER',
        },
        {
          username: 'user2',
          email: 'user2@email.com',
          role: 'ADMIN',
        },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const result = await controller.findAllUsers();

      expect(result).toEqual(expect.any(Array));
      expect(result[0]).toHaveProperty('username');
      expect(result[0]).toHaveProperty('email');
      expect(result[0]).toHaveProperty('role');
      expect(result[0]).not.toHaveProperty('password'); // bien directo
    });

    it('should throw NotFoundException if users array not found', async () => {
      (service.findAll as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(controller.findAllUsers()).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerError if something goes wrong', async () => {
      (service.findAll as jest.Mock).mockRejectedValue(
        new HttpException(
          'Failed to fetch users',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      await expect(controller.findAllUsers()).rejects.toThrow(HttpException);
    });
  });

  describe('findUserById', () => {
    const userMock = {
      id: '123',
      username: 'John',
      email: 'john@example.com',
      role: 'USER',
      password: 'hashedPassword',
    };

    it('should return a user by id without password', async () => {
      (service.getUserById as jest.Mock).mockResolvedValue({
        username: userMock.username,
        email: userMock.email,
        role: userMock.role,
      });

      const result = await controller.findUserById(userMock.id);

      expect(result).toEqual({
        username: userMock.username,
        email: userMock.email,
        role: userMock.role,
      });

      expect(Object.keys(result)).not.toContain('password');
    });

    it('should throw NotFoundException if user not found', async () => {
      (service.getUserById as jest.Mock).mockRejectedValue(
        new HttpException('users array not found', HttpStatus.NOT_FOUND),
      );

      await expect(controller.findUserById('invalid-id')).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw InternalServerError if something goes wrong', async () => {
      (service.getUserById as jest.Mock).mockRejectedValue(
        new HttpException(
          'Failed to fetch users',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      await expect(controller.findUserById('any-id')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updateUser', () => {
    const id = '123';
    const updateUserDto = {
      username: 'UpdatedName',
      email: 'updated@example.com',
      updatedAt: new Date(),
    };

    it('should update a user successfully', async () => {
      service.update = jest.fn().mockResolvedValue({
        message: `User with id: ${id} updated successfully`,
      });

      const result = await controller.updateUser(id, updateUserDto);

      expect(result).toEqual({
        message: `User with id: ${id} updated successfully`,
      });
      expect(service.update).toHaveBeenCalledWith(id, updateUserDto);
    });

    it('should throw NotFoundException if user not found', async () => {
      service.update = jest
        .fn()
        .mockRejectedValue(
          new NotFoundException(`User with id ${id} not found`),
        );

      await expect(controller.updateUser(id, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for other errors', async () => {
      service.update = jest
        .fn()
        .mockRejectedValue(new BadRequestException('Something went wrong'));

      await expect(controller.updateUser(id, updateUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeUser', () => {
    const id = 'mock-id';

    it('should remove a user successfully', async () => {
      service.remove = jest.fn().mockResolvedValue({
        message: `User with id: ${id} deleted successfully`,
      });

      const result = await controller.removeUser(id);

      expect(result).toEqual({
        message: `User with id: ${id} deleted successfully`,
      });
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if user not found', async () => {
      service.remove = jest
        .fn()
        .mockRejectedValue(
          new NotFoundException(`User with id ${id} not found`),
        );

      await expect(controller.removeUser(id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for other errors', async () => {
      service.remove = jest
        .fn()
        .mockRejectedValue(new BadRequestException('Something went wrong'));

      await expect(controller.removeUser(id)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
