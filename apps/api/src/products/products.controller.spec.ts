import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { removeUndefinedFields } from 'src/utils/prisma-utils';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const mockPrismaService = {
      product: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    };

    const mockProductsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getProductsByCategory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call product.create and return the product created', async () => {
      const dto: CreateProductDto = {
        name: 'test product',
        categoryId: '1',
        description: 'default product description',
        imageUrl: 'defaultlink.com',
        price: 10,
        stock: 10,
      };

      const createdProduct = {
        id: '1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdProduct);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdProduct);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      const dto: CreateProductDto = {
        name: 'test product',
        categoryId: '999', // ID inexistente
        description: 'default product description',
        imageUrl: 'defaultlink.com',
        price: 10,
        stock: 10,
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(
          new NotFoundException(`Category with id ${dto.categoryId} not found`),
        );

      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if an unexpected error occurs', async () => {
      const dto: CreateProductDto = {
        name: 'test product',
        categoryId: '1',
        description: 'default product description',
        imageUrl: 'defaultlink.com',
        price: 10,
        stock: 10,
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(controller.create(dto)).rejects.toThrow('Unexpected error');
    });
  });

  describe('findAll', () => {
    it('should give an array of products', async () => {
      const products = [
        {
          id: '1',
          name: 'test product',
          categoryId: '1',
          description: 'default product description',
          imageUrl: 'defaultlink.com',
          price: 10,
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'test product 2',
          categoryId: '1',
          description: 'default product description',
          imageUrl: 'defaultlink.com',
          price: 10,
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(products);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(products);
    });

    it('should return an empty array if no products exist', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should throw an error if an unexpected error occurs', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(new Error('Database connection error'));

      await expect(controller.findAll()).rejects.toThrow(Error);
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const product = {
        id: '1',
        name: 'Test Product',
        categoryId: '1',
        description: 'Description',
        imageUrl: 'image.com',
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(product);

      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if ID is missing', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new BadRequestException());

      await expect(controller.findOne('')).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException if an unexpected error occurs', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new InternalServerErrorException());

      await expect(controller.findOne('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a product and return the updated product', async () => {
      const id = '1';
      const updateDto: UpdateProductDto = { price: 20, updateDate: new Date() };

      const updatedProduct = {
        id,
        name: 'test product',
        categoryId: '1',
        description: 'default product description',
        imageUrl: 'defaultlink.com',
        price: 20,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedProduct);

      const result = await controller.update(id, updateDto);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(updatedProduct);
    });

    it('should throw an error if an unexpected error occurs', async () => {
      const id = '1';
      const updateDto: UpdateProductDto = { price: 20, updateDate: new Date() };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('Database error'));

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('remove', () => {
    it('should delete a product and return the deleted product', async () => {
      const id = '1';
      const deletedProduct = {
        id,
        name: 'Test Product',
        categoryId: '1',
        description: 'Test description',
        imageUrl: 'test.com/image.jpg',
        price: 100,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'remove').mockResolvedValue(deletedProduct);

      const result = await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedProduct);
    });

    it('should throw NotFoundException if the product does not exist', async () => {
      const id = '1';
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(
          new NotFoundException(`Product with id ${id} not found`),
        );

      await expect(controller.remove(id)).rejects.toThrow(
        `Product with id ${id} not found`,
      );
    });

    it('should throw an error if an unexpected error occurs', async () => {
      const id = '1';
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new Error('Database error'));

      await expect(controller.remove(id)).rejects.toThrow('Database error');
    });
  });

  describe('getProductsByCategory', () => {
    it('should return an array of products for a given category', async () => {
      const categoryId = '1';
      const products = [
        {
          id: '1',
          name: 'Product 1',
          categoryId,
          description: 'Description 1',
          imageUrl: 'image1.com',
          price: 100,
          stock: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(service, 'getProductsByCategory').mockResolvedValue(products);

      const result = await controller.getProductsByCategory(categoryId);
      expect(service.getProductsByCategory).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual(products);
    });

    it('should return an empty array if no products exist for the given category', async () => {
      const categoryId = '2';

      jest.spyOn(service, 'getProductsByCategory').mockResolvedValue([]);

      const result = await controller.getProductsByCategory(categoryId);
      expect(service.getProductsByCategory).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual([]);
    });

    it('should throw an error if an unexpected error occurs', async () => {
      const categoryId = '3';

      jest
        .spyOn(service, 'getProductsByCategory')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        controller.getProductsByCategory(categoryId),
      ).rejects.toThrow('Database error');
    });
  });
});
