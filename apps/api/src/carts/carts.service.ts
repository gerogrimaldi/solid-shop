import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { PrismaService } from 'prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartsService {
  constructor(
    private prisma: PrismaService,
    private readonly productsService: ProductsService
  ) {}

//  POST
async createCartItem(createCartItemDto: CreateCartItemDto) {
  const user = await this.prisma.user.findUnique({
    where: { id: createCartItemDto.userId },
    select: { cartId: true },
  });

  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }

  const cartItem = await this.prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: user.cartId,
        productId: createCartItemDto.productId
      }
    },
    create: {
      cartId: user.cartId,
      productId: createCartItemDto.productId,
      quantity: createCartItemDto.quantity,
    },
    update: {
      quantity: {
        increment: createCartItemDto.quantity
      }
    },
  });

  return "Se ha actualizado el siguiente item: \n" + JSON.stringify(cartItem);
}

  async findUserCart(userId: string) {
    if (!userId) {
      throw new Error('User ID is missing');
    }
    // Buscar el usuario y obtener su cartId
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { cartId: true },
    });
  
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    // Obtener los items 
    const cartItems = await this.prisma.cartItem.findMany({
      where: { cartId: user.cartId },
      select: {id:true, cartId:true, productId:true, quantity:true}
    });
  
    if (cartItems.length === 0) {
      return [];
    }
  
    // return
    return this.productsService.findCartProducts(cartItems);
  }
  
  
  async updateUserCart(itemId: string, quantity: number) {
    try {
      return await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cart item with id ${itemId} not found`);
      }
      throw new InternalServerErrorException(`Error updating cart item: ${error.message}`);
    }
  }
  
  async removeFromCart(itemId: string) {
    try {
      return await this.prisma.cartItem.delete({
        where: { id: itemId },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cart item with id ${itemId} not found`);
      }
      throw new InternalServerErrorException(`Error removing cart item: ${error.message}`);
    }
  }
}
