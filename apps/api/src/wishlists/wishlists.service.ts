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
    console.log("Productid: ", createWishlistItemDto.productId);

    const wishlistItem = await this.prisma.wishlistItem.create({
      data: {
        wishlistId: createWishlistItemDto.wishlistId,
        productId: createWishlistItemDto.productId,
      },
    });

    return "Se ha creado el siguiente item: \n" + wishlistItem;
  }

  // GET
async findUserWishlist(wishlistId: string) {
    if (!wishlistId) {
      throw new Error('Wishlist ID is missing');
    }

    // Obtener los items 
    const wishlistItems = await this.prisma.wishlistItem.findMany({
      where: { wishlistId: wishlistId },
      select: {id:true, wishlistId:true, productId:true}
    });
  
    if (wishlistItems.length === 0) {
      return [];
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
