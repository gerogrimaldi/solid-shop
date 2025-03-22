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


@Module({
  imports: [ProductsModule, CategoriesModule, CognitoAuthModule, CartsModule, UsersModule],
  // imports: [LinksModule, ServeStaticModule.forRoot({
  //   rootPath: join  (__dirname + '/../../web/next'),
  // })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
