import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistItemDto } from './dto/create-wishlist.dto';
import { UpdateWishlistItemDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/cognito-auth/cognito-auth.guard';
import { RolesGuard } from 'src/auth/custom-decorators/roles.guard';
import { AcceptedRoles } from 'src/auth/custom-decorators/roles.decorator';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @AcceptedRoles('ADMIN', 'USER')
  @Post()
  createWishlistItem(@Body() createWishlistItemDto: CreateWishlistItemDto) {
    return this.wishlistsService.createWishlistItem(createWishlistItemDto);
  }

  //podria recibir directamente el wishlistId?
  @AcceptedRoles('ADMIN', 'USER')
  @Get(':userId')
  findUserWishlist(@Param('userId') userId: string) {
    return this.wishlistsService.findUserWishlist(userId);
  }

  @AcceptedRoles('ADMIN', 'USER')
  @Delete(':itemId')
  remove(@Param('itemId') itemId: string) {
    return this.wishlistsService.remove(itemId);
  }
}
