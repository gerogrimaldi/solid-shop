import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CognitoAuthModule } from './cognito-auth/cognitoAuth.module';
import { CartsModule } from './carts/carts.module';
import { UsersModule } from './users/users.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { AuthModule } from './authorization/auth.module';
import { S3Module } from './upload/s3.module';
import { StockGateway } from './stock/stock.gateway';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [ProductsModule, CategoriesModule, CognitoAuthModule, CartsModule, UsersModule, WishlistsModule, AuthModule, S3Module, StockModule],
  // imports: [LinksModule, ServeStaticModule.forRoot({
  //   rootPath: join  (__dirname + '/../../web/next'),
  // })],
  controllers: [AppController],
  providers: [AppService, StockGateway],
})
export class AppModule {}
