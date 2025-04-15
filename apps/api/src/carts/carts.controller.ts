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
    const cartId = req.user.cartId; // Obtiene el cartId del JWT
    const { productId, quantity } = product; // Desestructura el objeto product
    return this.cartsService.createCartItem({cartId, productId, quantity});
  }

  @AcceptedRoles('ADMIN', 'USER')
  @Post("checkout") 
  checkoutCart(@Req() req, @Body() items: {itemId: string, productId: string, quantity: number}[]) {
    const cartId = req.user.cartId; // Obtiene el cartId del JWT
    return this.cartsService.checkoutCart(cartId, items);
  }

  //podria recibir directamente el cartId?
  @AcceptedRoles('ADMIN', 'USER')
  @Get("items")
  findUserCart(@Req() req) {
    const cartId = req.user.cartId; // Obtiene el cartId del JWT
    return this.cartsService.findUserCart(cartId);
  }

  //podria recibir directamente el itemId?
  @AcceptedRoles('ADMIN', 'USER')
  @Patch('items')
  async updateItem(
    @Body('id') itemId: string,
    @Body('quantity') quantity: number,
  ) {
    console.log(itemId, quantity);
    return this.cartsService.updateUserCart(itemId, quantity);
  }

  @AcceptedRoles('ADMIN', 'USER')
  @Delete('items/:itemId')
  async removeItem(@Param('itemId') itemId: string) {
    return this.cartsService.removeFromCart( itemId);
  }
}
