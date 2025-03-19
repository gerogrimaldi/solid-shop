import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
@Module({
  imports: [LinksModule],
  // imports: [LinksModule, ServeStaticModule.forRoot({
  //   rootPath: join  (__dirname + '/../../web/next'),
  // })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
