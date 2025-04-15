import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  const cartItem = await this.prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: createCartItemDto.cartId,
        productId: createCartItemDto.productId
      }
    },
    create: {
      cartId: createCartItemDto.cartId,
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

async checkoutCart(
  cartId: string,
  items: { itemId: string; productId: string; quantity: number }[]
) {
  if (!cartId || !Array.isArray(items) || items.length === 0) {
    throw new Error('Los items no son válidos o están vacíos');
  }
  // primero valido stock de todos
  // se usa for y no foreach ya que queremos ir secuencialmente chequeando
  for (const item of items) {
    console.log(item)
    const stockAvailable = await this.productsService.validateStock(item.productId, item.quantity);
    if (!stockAvailable) {
      const product = await this.productsService.findOne(item.productId);
      throw new BadRequestException(`Producto ${product.name} con stock insuficiente. [ ${product.stock} ] unidades restantes`);
    }
  }

  // actualizar stock y armar la orden
  // se usa promise all para esperar los await
  const updatedItems = await Promise.all(
    items.map(async (item) => {
      // me traigo el producto
      const product = await this.productsService.findOne(item.productId);

      console.log("product found: ", product)
      const updatedProduct = await this.productsService.update(product.id, {
        stock: product.stock - item.quantity,
      });

      return {
        productId: updatedProduct.id,
        name: updatedProduct.name,
        price: updatedProduct.price,
        quantity: item.quantity,
      };
    })
  );

  return updatedItems;
}


  async findUserCart(cartId: string) {
    if (!cartId) {
      throw new Error('Cart ID is missing');
    }
    // Obtener los items 
    const cartItems = await this.prisma.cartItem.findMany({
      where: { cartId: cartId },
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
