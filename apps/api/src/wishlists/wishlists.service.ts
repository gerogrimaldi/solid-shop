import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateWishlistItemDto } from './dto/create-wishlist.dto';
import { UpdateWishlistItemDto } from './dto/update-wishlist.dto';
import { PrismaService } from 'prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class WishlistsService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService
  ) {}

//  POST
  async createWishlistItem(createWishlistItemDto: CreateWishlistItemDto) {

    const user = await this.prisma.user.findUnique({
      where: { id: createWishlistItemDto.userId },
      select: { wishlistId: true }, // Solo traigo el wishlist Id
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const wishlistItem = await this.prisma.wishlistItem.create({
      data: {
        wishlistId: user.wishlistId,
        productId: createWishlistItemDto.productId,
      },
    });

    return "Se ha creado el siguiente item: \n" + wishlistItem;
  }

  // GET
async findUserWishlist(userId: string) {
    if (!userId) {
      throw new Error('User ID is missing');
    }
    // Buscar el usuario y obtener su wishlistId
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { wishlistId: true },
    });
  
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    // Obtener los items 
    const wishlistItems = await this.prisma.wishlistItem.findMany({
      where: { wishlistId: user.wishlistId },
      select: {id:true, wishlistId:true, productId:true}
    });
  
    if (wishlistItems.length === 0) {
      throw new NotFoundException('La Wishlist está vacía');
    }
  
    // return
    return this.productsService.findWishlistProducts(wishlistItems);
  }

// DELETE
  async removeFromWishlist(itemId: string) {
    try {
      return await this.prisma.wishlistItem.delete({
        where: { id: itemId },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Wishlist item with id ${itemId} not found`);
      }
      throw new InternalServerErrorException(`Error removing Wishlist item: ${error.message}`);
    }
  }
}
