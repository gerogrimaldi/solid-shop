import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ProductsService } from 'src/products/products.service';
import { StockGateway } from 'src/stock/stock.gateway';

@Module({
  controllers: [CartsController],
  providers: [CartsService, PrismaService, JwtService, ProductsService, StockGateway],
})
export class CartsModule {}
