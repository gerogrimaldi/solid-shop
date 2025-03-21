import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [CartsController],
  providers: [CartsService, PrismaClient],
})
export class CartsModule {}
