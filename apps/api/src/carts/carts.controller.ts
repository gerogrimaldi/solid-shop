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
  @Post("items")
  createCartItem(@Req() req, @Body() product: {productId: string, quantity: number}) {
    const userId = req.user.sub; // Obtiene el userId del JWT
    const { productId, quantity } = product; // Desestructura el objeto product
    console.log('User ID from request:', req.user?.sub); // ← Verifica aquí
    console.log('Product ID from request:', productId); // ← Verifica aquí
    console.log('Quantity from request:', quantity); // ← Verifica aquí
    return this.cartsService.createCartItem({userId, productId, quantity});
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
    console.log('Item ID:', itemId); // ← Verifica aquí
    console.log('Quantity:', quantity); // ← Verifica aquí
    return this.cartsService.updateUserCart(itemId, quantity);
  }

  @AcceptedRoles('ADMIN', 'USER')
  @Delete('items/:itemId')
  async removeItem(@Param('itemId') itemId: string) {
    console.log("Eliminando", itemId);
    return this.cartsService.removeFromCart( itemId);
  }
}
