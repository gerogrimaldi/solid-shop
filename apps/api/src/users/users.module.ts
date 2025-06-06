import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  controllers: [UsersController],
   providers: [
      {
        provide: UsersService,
        useClass: UsersService
      }, 
      PrismaService, 
      JwtService
    ],
    exports:[UsersService]
})
export class UsersModule {}
