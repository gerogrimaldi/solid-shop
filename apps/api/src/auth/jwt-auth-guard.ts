
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
import { ProductsController } from 'src/products/products.controller';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      // extrae la request  del contexto
      const request = context.switchToHttp().getRequest();
    // extrae el header de la request
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException("Missing or invalid token");
      }
      // usamos split para obtener solo la parte del token
      const token = authHeader.split(' ')[1];

      // valida el token con verify
      try {
        request.user = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET || 'supersecret',
        });
        return true;
      } catch (error) {
        console.log(error);
  
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
  