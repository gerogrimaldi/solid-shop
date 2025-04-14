import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { StockGateway } from 'src/stock/stock.gateway';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, JwtService, StockGateway],
})
export class ProductsModule {}
