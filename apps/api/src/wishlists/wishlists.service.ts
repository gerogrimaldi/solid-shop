import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistItemDto } from './dto/create-wishlist.dto';
import { UpdateWishlistItemDto } from './dto/update-wishlist.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class WishlistsService {
  constructor(private prisma: PrismaService) {}

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
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { wishlistId: true }, // Solo traigo el wishlist Id
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.prisma.wishlistItem.findMany({
      where: { wishlistId: user.wishlistId },
      include: {
        product: true,
      },
    });
  }


  // DELETE
  async remove(itemId: string) {
    return this.prisma.wishlistItem.delete({
      where: { id: itemId },
    })
  }
}
