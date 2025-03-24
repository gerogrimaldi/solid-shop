import { Module } from '@nestjs/common';
import { CognitoAuthService } from './cognitoAuth.service';
import { CognitoAuthController } from './cognitoAuth.controller';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [CognitoAuthController],
  providers: [CognitoAuthService, UsersService, PrismaService, ConfigService],
})
export class CognitoAuthModule {}
