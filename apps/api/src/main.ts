import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.setGlobalPrefix('api'); //prefijo a todas las rutas del backend

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('e-commerce ejemplo')
    .setDescription('API de e-commerce')
    .setVersion('1.0')
    .addTag('ecommerce')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('test', app, documentFactory);

  
  await app.listen(8000);
}
bootstrap();
