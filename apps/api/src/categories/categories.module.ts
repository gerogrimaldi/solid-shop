import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { ProductsService } from 'src/products/products.service';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { StockGateway } from 'src/stock/stock.gateway';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    ProductsService,
    PrismaService,
    JwtService,
    StockGateway,
  ],
})
export class CategoriesModule {}
