import { Injectable, NotFoundException } from '@nestjs/common';
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
      select: { cartId: true }, // Solo traigo el cartid
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
      throw new NotFoundException('El carrito está vacío');
    }
  
    // return
    return this.productsService.findCartProducts(cartItems);
  }
  
  
  // UPDATE
  async updateUserCart(
    itemId: string,
    quantity: number
  ) {
    // Actualizar cantidad
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
  }

  async removeFromCart(
    itemId: string
  ) {
    return this.prisma.cartItem.delete({
      where: { id: itemId }
    });
  }
}
