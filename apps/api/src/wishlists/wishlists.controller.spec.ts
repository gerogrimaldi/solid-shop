import { Test, TestingModule } from '@nestjs/testing';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';
import { PrismaService } from 'prisma/prisma.service';
import { Wishlist, WishlistItem } from '@prisma/client';
import { jest } from '@jest/globals';
import { CreateWishlistItemDto } from 'src/wishlists/dto/create-wishlist.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('WishlistsController', () => {
  let controller: WishlistsController;
  let service: WishlistsService;

  beforeEach(async () => {
    const mockPrismaService = {
      wishlistItem: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findFirst: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    };

    const mockWishlistsService = {
      createWishlistItem: jest.fn(),
      findUserWishlist: jest.fn<() => Promise<WishlistItem[]>>(),
      removeFromWishlist: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistsController],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: WishlistsService,
          useValue: mockWishlistsService,
        },
      ],
    }).compile();

    controller = module.get<WishlistsController>(WishlistsController);
    service = module.get<WishlistsService>(WishlistsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createWishlistItem', () => {
    it('should create a wishlist item', async () => {
      const dto: CreateWishlistItemDto = {
        productId: '1',
        wishlistId: '2',
      };

      const mockReq = {
        user: {
          wishlistId: 'mockWishlistId',
        },
      };

      const mockResponse = 'Se ha creado el siguiente item: \n[object Object]';

      jest.spyOn(service, 'createWishlistItem').mockResolvedValue(mockResponse);

      const result = await controller.createWishlistItem(mockReq, dto);

      expect(result).toEqual(mockResponse);
      expect(service.createWishlistItem).toHaveBeenCalledWith({
        wishlistId: 'mockWishlistId',
        productId: '1',
      });
    });

    it('should throw an error if productId is missing', async () => {
      const mockReq = { user: { wishlistId: 'mockWishlistId' } };
      const product = {}; // No tiene productId

      jest
        .spyOn(service, 'createWishlistItem')
        .mockRejectedValue(new Error('Product ID is missing'));

      await expect(
        controller.createWishlistItem(mockReq, product as any),
      ).rejects.toThrow('Product ID is missing');
    });

    it('should throw an error if wishlistId is missing', async () => {
      const mockReq = { user: { wishlistId: undefined } };
      const product = { productId: '1' };

      jest
        .spyOn(service, 'createWishlistItem')
        .mockRejectedValue(new Error('Wishlist ID is missing'));

      await expect(
        controller.createWishlistItem(mockReq, product),
      ).rejects.toThrow('Wishlist ID is missing');
    });

    it('should throw an error if service throws an unexpected error', async () => {
      const mockReq = { user: { wishlistId: 'mockWishlistId' } };
      const product = { productId: '1' };

      jest
        .spyOn(service, 'createWishlistItem')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(
        controller.createWishlistItem(mockReq, product),
      ).rejects.toThrow('Unexpected error');
    });
  });

  describe('findUserWishlist', () => {
    it('should return an array of products in a user wishlist', async () => {
      const wishlistProducts = [
        {
          id: '1',
          name: 'test product',
          categoryId: '1',
          description: 'default product description',
          imageUrl: 'defaultlink.com',
          itemId: '1',
          price: 10,
          stock: 10,
        },
        {
          id: '2',
          name: 'test product 2',
          categoryId: '1',
          description: 'default product description',
          imageUrl: 'defaultlink.com',
          itemId: '2',
          price: 10,
          stock: 10,
        },
      ];
      jest
        .spyOn(service, 'findUserWishlist')
        .mockResolvedValue(wishlistProducts);

      const mockReq = {
        user: {
          wishlistId: 'mockWishlistId',
        },
      };

      const result = await controller.findUserWishlist(mockReq);
      expect(result).toEqual(wishlistProducts);
      expect(service.findUserWishlist).toHaveBeenCalledWith('mockWishlistId');
    });

    it('should throw an error if service throws (wishlistId is missing)', async () => {
      const req = { user: { wishlistId: undefined } };

      jest
        .spyOn(service, 'findUserWishlist')
        .mockRejectedValue(new Error('Wishlist ID is missing'));

      await expect(controller.findUserWishlist(req)).rejects.toThrow(
        'Wishlist ID is missing',
      );
    });

    it('should return an empty array if wishlistItems are empty', async () => {
      const req = { user: { wishlistId: 'wishlist-123' } };

      jest.spyOn(service, 'findUserWishlist').mockResolvedValue([]);

      const result = await controller.findUserWishlist(req);

      expect(result).toEqual([]);
    });

    it('should throw an error if productsService.findWishlistProducts throws', async () => {
      const req = { user: { wishlistId: 'wishlist-123' } };

      jest
        .spyOn(service, 'findUserWishlist')
        .mockRejectedValue(new Error('Failed to fetch products'));

      await expect(controller.findUserWishlist(req)).rejects.toThrow(
        'Failed to fetch products',
      );
    });
  });

  describe('remove', () => {
    const itemId = 'testItemId';

    it('should remove a wishlist item successfully', async () => {
      const removedItem = {
        id: itemId,
        wishlistId: '1',
        productId: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'removeFromWishlist').mockResolvedValue(removedItem);

      const result = await controller.remove(itemId);

      expect(result).toEqual(removedItem);
      expect(service.removeFromWishlist).toHaveBeenCalledWith(itemId);
    });

    it('should throw NotFoundException if item does not exist (P2025)', async () => {
      jest
        .spyOn(service, 'removeFromWishlist')
        .mockRejectedValueOnce(
          new NotFoundException(`Wishlist item with id ${itemId} not found`),
        );

      await expect(controller.remove(itemId)).rejects.toThrowError(
        `Wishlist item with id ${itemId} not found`,
      );

      expect(service.removeFromWishlist).toHaveBeenCalledWith(itemId);
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      jest
        .spyOn(service, 'removeFromWishlist')
        .mockRejectedValueOnce(
          new InternalServerErrorException(
            `Error removing Wishlist item: error random`,
          ),
        );

      await expect(controller.remove(itemId)).rejects.toThrow(
        `Error removing Wishlist item: error random`,
      );

      expect(service.removeFromWishlist).toHaveBeenCalledWith(itemId);
    });
  });
});
