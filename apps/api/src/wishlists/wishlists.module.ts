import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ProductsService } from 'src/products/products.service';

@Module({
  controllers: [WishlistsController],
  providers: [WishlistsService, PrismaService,JwtService, ProductsService],
})
export class WishlistsModule {}
