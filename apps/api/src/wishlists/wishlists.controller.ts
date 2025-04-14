import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistItemDto } from './dto/create-wishlist.dto';
import { UpdateWishlistItemDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/authorization/guards/jwt-auth.guard';
import { RolesGuard } from 'src/authorization/custom-decorators/roles.guard';
import { AcceptedRoles } from 'src/authorization/custom-decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @AcceptedRoles('ADMIN', 'USER')
  @Post("items")
  createWishlistItem(@Req() req, @Body() product: {productId: string}) {
    const wishlistId = req.user.wishlistId; // Obtiene el wishlistId del JWT
    const {productId} = product;
    return this.wishlistsService.createWishlistItem({wishlistId, productId}); 
  }

  //podria recibir directamente el wishlistId?
  @AcceptedRoles('ADMIN', 'USER')
  @Get("items")
  findUserWishlist(@Req() req) {
    const wishlistId = req.user.wishlistId; // Obtiene el userId del JWT
    return this.wishlistsService.findUserWishlist(wishlistId);
  }

  @AcceptedRoles('ADMIN', 'USER')
  @Delete('items/:itemId')
  remove(@Param('itemId') itemId: string) {
    return this.wishlistsService.removeFromWishlist(itemId);
  }
}
