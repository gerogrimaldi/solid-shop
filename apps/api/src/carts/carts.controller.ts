import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
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
  @Get("items")
  findUserCart(@Req() req) {
    const userId = req.user.sub; // Obtiene el userId del JWT
    // console.log('User ID from request:', req.user?.sub); // ← Verifica aquí
    return this.cartsService.findUserCart(userId);
  }

  //podria recibir directamente el itemId?
  @AcceptedRoles('ADMIN', 'USER')
  @Patch('items')
  async updateItem(
    @Body('id') itemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartsService.updateUserCart(itemId, quantity);
  }

  @AcceptedRoles('ADMIN', 'USER')
  @Delete('items/:itemId')
  async removeItem(@Param('itemId') itemId: string) {
    return this.cartsService.removeFromCart( itemId);
  }
}
