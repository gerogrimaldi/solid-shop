import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/cognito-auth/cognito-auth.guard';
import { RolesGuard } from 'src/custom-decorators/roles.guard';
import { AcceptedRoles } from 'src/custom-decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @AcceptedRoles('ADMIN', 'USER')
  @Post()
  createCartItem(@Body() createCartDto: CreateCartItemDto) {
    return this.cartsService.createCartItem(createCartDto);
  }

  @AcceptedRoles('ADMIN', 'USER')
  @Get(':userId')
  findUserCart(@Param('userId') userId: string) {
    return this.cartsService.findUserCart(userId);
  }

  @AcceptedRoles('ADMIN', 'USER')
  @Patch()
  updateUserCart(@Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartsService.updateUserCart(updateCartItemDto);
  }

  @AcceptedRoles('ADMIN')
  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.cartsService.remove(userId);
  }
}
