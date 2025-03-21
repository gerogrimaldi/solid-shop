import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CartsController],
  providers: [CartsService, PrismaService, JwtService],
})
export class CartsModule {}
