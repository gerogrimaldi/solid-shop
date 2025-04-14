import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { PrismaService } from 'prisma/prisma.service';
import { jest } from '@jest/globals';

describe('CartsController', () => {
  let controller: CartsController;
  let service: CartsService;

  const mockPrismaService = {
    wishlistItem: {
      upsert: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  const mockCartsService = {
    createCartItem: jest.fn<() => Promise<any>>(),
    findUserCart: jest.fn<() => Promise<any[]>>(),
    updateUserCart: jest.fn<() => Promise<any>>(),
    removeFromCart: jest.fn<() => Promise<any>>(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CartsService,
          useValue: mockCartsService,
        },
      ],
    }).compile();

    controller = module.get<CartsController>(CartsController);
    service = module.get<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('createCartItem', () => {
    const mockReq = {
      user: {
        cartId: 'testCartId',
      },
    };

    const product = {
      productId: 'testProductId',
      quantity: 2,
    };

    it('should create or update a cart item', async () => {
      const req = { user: { cartId: '123' } };
      const product = { productId: '456', quantity: 2 };

      const cartItemMock = {
        id: '1',
        cartId: '123',
        productId: '456',
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedResult =
        'Se ha actualizado el siguiente item: \n' +
        JSON.stringify(cartItemMock);

      mockCartsService.createCartItem.mockResolvedValueOnce(expectedResult);

      const result = await controller.createCartItem(req, product);

      expect(mockCartsService.createCartItem).toHaveBeenCalledWith({
        cartId: req.user.cartId,
        productId: product.productId,
        quantity: product.quantity,
      });

      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if service fails', async () => {
      mockCartsService.createCartItem.mockRejectedValue(
        new Error('Something went wrong'),
      );

      await expect(controller.createCartItem(mockReq, product)).rejects.toThrow(
        'Something went wrong',
      );
    });
  });

  describe('findUserCart', () => {
    const mockReq = {
      user: {
        cartId: 'testCartId',
      },
    };

    it('should return user cart', async () => {
      const cart = [{ id: 'item1' }];
      mockCartsService.findUserCart.mockResolvedValue(cart);

      const result = await controller.findUserCart(mockReq);

      expect(result).toBe(cart);
      expect(mockCartsService.findUserCart).toHaveBeenCalledWith(
        mockReq.user.cartId,
      );
    });

    it('should throw an error if service fails', async () => {
      mockCartsService.findUserCart.mockRejectedValue(
        new Error('Something went wrong'),
      );

      await expect(controller.findUserCart(mockReq)).rejects.toThrowError(
        'Something went wrong',
      );
    });
  });

  describe('updateItem', () => {
    const body = {
      itemId: 'testItemId',
      quantity: 5,
    };

    it('should update a cart item', async () => {
      const updatedItem = { id: 'testItemId', quantity: 5 };

      mockCartsService.updateUserCart.mockResolvedValue(updatedItem);

      const result = await controller.updateItem(body.itemId, body.quantity);

      expect(result).toBe(updatedItem);
      expect(mockCartsService.updateUserCart).toHaveBeenCalledWith(
        body.itemId,
        body.quantity,
      );
    });

    it('should throw an error if service fails', async () => {
      mockCartsService.updateUserCart.mockRejectedValue(
        new Error('Something went wrong'),
      );

      await expect(
        controller.updateItem(body.itemId, body.quantity),
      ).rejects.toThrowError('Something went wrong');
    });
  });

  describe('removeItem', () => {
    const itemId = 'testItemId';

    it('should remove an item from cart', async () => {
      const removedItem = { id: 'testItemId' };

      mockCartsService.removeFromCart.mockResolvedValue(removedItem);

      const result = await controller.removeItem(itemId);

      expect(result).toBe(removedItem);
      expect(mockCartsService.removeFromCart).toHaveBeenCalledWith(itemId);
    });

    it('should throw an error if service fails', async () => {
      mockCartsService.removeFromCart.mockRejectedValue(
        new Error('Something went wrong'),
      );

      await expect(controller.removeItem(itemId)).rejects.toThrow(
        'Something went wrong',
      );
    });
  });
});
