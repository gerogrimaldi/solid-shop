import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';
import { StockGateway } from 'src/stock/stock.gateway';
import { Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { removeUndefinedFields } from 'utils/prisma/utils';

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

  // CARRITO
  async findCartProducts(
    cartItems: {
      id: string;
      productId: string;
      cartId: string;
      quantity: number;
    }[],
  ) {
    // obtengo arreglo de ids de producto
    const productIds = cartItems.map((item) => item.productId);
    // encuentro los productos
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
        price: true,
        stock: true,
        imageUrl: true,
      },
    });

    if (products.length === 0) {
      throw new NotFoundException('No se encontraron productos en el carrito');
    }
    // devuelvo nuevo arreglo con producto y su cantidad en el carrito
    return cartItems
      .map((cartItem) => {
        const product = products.find((p) => p.id === cartItem.productId);
        return product
          ? { itemId: cartItem.id, ...product, quantity: cartItem.quantity }
          : null;
      })
      .filter(Boolean); // Filtrar productos nulos
  }

  // WISHLIST
  async findWishlistProducts(
    wishlistItems: { id: string; productId: string; wishlistId: string }[],
  ) {
    // obtengo arreglo de ids de producto
    const productIds = wishlistItems.map((item) => item.productId);
    // encuentro los productos
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
        price: true,
        stock: true,
        imageUrl: true,
      },
    });

    if (products.length === 0) {
      throw new NotFoundException('No se encontraron productos en la wishlist');
    }
    // devuelvo nuevo arreglo con productoS
    return wishlistItems
      .map((wishlistItem) => {
        const product = products.find((p) => p.id === wishlistItem.productId); //asocio cada producto con su wishlistItem
        return product ? { itemId: wishlistItem.id, ...product } : null;
      })
      .filter(Boolean); // Filtrar productos nulos
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const updatedProduct = await this.prisma.product.upsert({
        where: { id },
        update: {
          ...removeUndefinedFields(updateProductDto),
          updatedAt: new Date(),
        },
        create: {
          id,
          name: updateProductDto.name,
          description: updateProductDto.description,
          price: updateProductDto.price,
          stock: updateProductDto.stock,
          imageUrl: updateProductDto.imageUrl || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          categoryId: updateProductDto.categoryId,
        },
      });

      // Emitir evento si el stock fue actualizado
      if (updateProductDto.stock !== undefined) {
        this.stockGateway.updateStock(
          id,
          updatedProduct.name,
          updateProductDto.stock,
        );
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
