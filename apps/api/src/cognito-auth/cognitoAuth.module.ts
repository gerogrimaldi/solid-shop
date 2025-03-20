import { Module } from '@nestjs/common';
import { CognitoAuthService } from './cognitoAuth.service';
import { CognitoAuthController } from './cognitoAuth.controller';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CognitoAuthController],
  providers: [CognitoAuthService, UserService, PrismaService],
})
export class CognitoAuthModule {}
