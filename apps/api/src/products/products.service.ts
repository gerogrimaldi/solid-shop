import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';
import { StockGateway } from 'src/stock/stock.gateway';
import { Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stockGateway: StockGateway,
  ) {}

  async create(newProduct: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data: {
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description,
          categoryId: newProduct.categoryId,
          stock: newProduct.stock,
          imageUrl: newProduct.imageUrl,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException(
            `Category with id ${newProduct.categoryId} not found`,
          );
        }
      }
      throw new Error('Error creating product');
    }
  }

  async findAll() {
    try {
      const products = await this.prisma.product.findMany();
      return products;
    } catch (error) {
      throw new Error('Error retrieving products');
    }
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Product ID is required');
    }

    try {
      const product = await this.prisma.product.findUnique({ where: { id } });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return product;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving product');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });
      if (!existingProduct) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });

      // emite el  evento si el stock fue actualizado
      if (updateProductDto.stock !== undefined) {
        this.stockGateway.updateStock(id, updateProductDto.stock);
      }

      return updatedProduct;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async remove(id: string) {
    try {
      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });

      return deletedProduct;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      throw new Error('Error deleting product');
    }
  }

  async getProductsByCategory(categoryId: string) {
    try {
      const products = await this.prisma.product.findMany({
        where: { categoryId },
      });

      return products;
    } catch (error) {
      throw new Error('Error retrieving products by category');
    }
  }
}
