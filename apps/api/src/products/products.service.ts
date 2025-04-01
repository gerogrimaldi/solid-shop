import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(newProduct: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        categoryId: newProduct.categoryId,
        stock: newProduct.stock,
        imageUrl: newProduct.imageUrl,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  // CARRITO
  async findCartProducts(cartItems: {id: string, productId: string, cartId:string, quantity: number }[]) {

    // obtengo arreglo de ids de producto
    const productIds = cartItems.map(item => item.productId);
    // encuentro los productos
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select:{
        id: true,
        name: true,
        description: true,
        categoryId: true,
        price: true,
        stock: true,
        imageUrl: true,
      }
    });
  
    if (products.length === 0) {
      throw new NotFoundException('No se encontraron productos en el carrito');
    }
    // devuelvo nuevo arreglo con producto y su cantidad en el carrito
    return cartItems.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      return product ? { itemId:cartItem.id, ...product, quantity: cartItem.quantity } : null;
    }).filter(Boolean); // Filtrar productos nulos
  }
  
  // WISHLIST
  async findWishlistProducts(wishlistItems: {id: string, productId: string, wishlistId:string}[]) {
    // obtengo arreglo de ids de producto
    const productIds = wishlistItems.map(item => item.productId);
    // encuentro los productos
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select:{
        id: true,
        name: true,
        description: true,
        categoryId: true,
        price: true,
        stock: true,
        imageUrl: true,
      }
    });
  
    if (products.length === 0) {
      throw new NotFoundException('No se encontraron productos en la wishlist');
    }
    // devuelvo nuevo arreglo con productoS
    return wishlistItems.map(wishlistItem => {
      const product = products.find(p => p.id === wishlistItem.productId); //asocio cada producto con su wishlistItem
      return product ? { itemId:wishlistItem.id, ...product } : null;
    }).filter(Boolean); // Filtrar productos nulos
  }
  
  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async getProductsByCategory(id: string) {
    return this.prisma.product.findMany({
      where: { categoryId: id },
    });
  }
}
