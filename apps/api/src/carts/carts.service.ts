import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

//  POST
  async createCartItem(createCartItemDto: CreateCartItemDto) {

    const user = await this.prisma.user.findUnique({
      where: { id: createCartItemDto.userId },
      select: { cartId: true }, // Solo traigo el cart Id
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const cartItem = await this.prisma.cartItem.create({
      data: {
        cartId: user.cartId,
        productId: createCartItemDto.productId,
        quantity: createCartItemDto.quantity,
      },
    });

    return "Se ha creado el siguiente item: \n" + cartItem;
  }

  // GET
  async findUserCart(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { cartId: true }, // Solo traigo el cart Id
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.prisma.cartItem.findMany({
      where: { cartId: user.cartId },
      include: {
        product: true,
      },
    });
  }

  // UPDATE
  async updateUserCart(updateCartItemDto: UpdateCartItemDto) {
    
    // obtengo user para sacar el cartId
    const user = await this.prisma.user.findUnique({
      where: { id: updateCartItemDto.userId },
      select: { cartId: true }, // Solo traigo el cart Id
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    //busco el item del carrito
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { 
        cartId: user.cartId,
        productId: updateCartItemDto.productId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    // edito el item del carrito
    return this.prisma.cartItem.update({
      where: { id: cartItem.id ?? '' },
      data: {
        quantity: updateCartItemDto.quantity,
      }
    });

  }

  // DELETE
  async remove(itemId: string) {
    return this.prisma.cartItem.delete({
      where: { id: itemId },
    })
  }
}
