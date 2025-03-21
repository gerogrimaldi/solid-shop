import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { PrismaService } from 'prisma/prisma.service';
@Module({
  imports: [LinksModule, UsersModule, ProductsModule, CategoriesModule],
  // imports: [LinksModule, ServeStaticModule.forRoot({
  //   rootPath: join  (__dirname + '/../../web/next'),
  // })],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
