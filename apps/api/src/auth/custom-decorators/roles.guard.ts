import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    
    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificar si el usuario está autenticado
    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Verificar si el usuario tiene los roles requeridos
    const hasRole = requiredRoles.some((role) => 
      user.roles?.includes(role)
    );

    if (!hasRole) {
      throw new UnauthorizedException(
        'No tienes permisos para acceder a este recurso'
      );
    }

    return true;
  }
}