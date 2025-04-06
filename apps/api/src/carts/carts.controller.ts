import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/authorization/guards/jwt-auth.guard';
import { RolesGuard } from 'src/authorization/custom-decorators/roles.guard';
import { AcceptedRoles } from 'src/authorization/custom-decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @AcceptedRoles('ADMIN', 'USER')
  @Post("items") //el DTO se usa en el service ya que desde el front no tengo el userId para enviar
  createCartItem(@Req() req, @Body() product: {productId: string, quantity: number}) {
    const userId = req.user.sub; // Obtiene el userId del JWT
    const { productId, quantity } = product; // Desestructura el objeto product
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
