import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/custom-decorators/roles.guard';
import { AcceptedRoles } from 'src/auth/custom-decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @AcceptedRoles('ADMIN', 'USER')
  @Post()
  createCartItem(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartsService.createCartItem(createCartItemDto);
  }

  //podria recibir directamente el cartId?
  @AcceptedRoles('ADMIN', 'USER')
  @Get(':userId')
  findUserCart(@Param('userId') userId: string) {
    return this.cartsService.findUserCart(userId);
  }

  //podria recibir directamente el itemId?
  @AcceptedRoles('ADMIN', 'USER')
  @Patch()
  updateUserCart(@Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartsService.updateUserCart(updateCartItemDto);
  }

  @AcceptedRoles('ADMIN', 'USER')
  @Delete(':itemId')
  remove(@Param('itemId') itemId: string) {
    return this.cartsService.remove(itemId);
  }
}
