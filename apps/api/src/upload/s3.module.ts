import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
// import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
// import { APP_GUARD, Reflector } from '@nestjs/core';

@Module({
  imports: [
    // ThrottlerModule.forRoot({
    //   throttlers: [
    //     {
    //       ttl: 60, //1 minuto
    //       limit: 3, //3 subidas
    //     },
    //   ],
    // }),
  ],
  controllers: [S3Controller],
  providers: [
    S3Service, 
    ConfigService,
    JwtService
    // Reflector,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // }
  ],
})
export class S3Module {}
