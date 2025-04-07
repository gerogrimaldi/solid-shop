// jwt-auth.guard.ts
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(request, 'Authentication');
    
    if (!token) {
      // si no hay token es pq expiro o no hay, entonces intento refrescar
      console.log("Intento de refresco de token");
      return await this.attemptTokenRefresh(request, context);
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'supersecret',
      });
      
      request.user = payload;
      return true;
    } catch (error) {
      // Si el token es inválido o expiró, intentar refrescar
      return await this.attemptTokenRefresh(request, context);
    }
  }

  private extractTokenFromCookies(request: any, cookieName: string): string | null {
    const cookies = request.headers.cookie?.split('; ');
    const targetCookie = cookies?.find(cookie => cookie.startsWith(`${cookieName}=`));
    return targetCookie?.split('=')[1] || null;
  }

  private async attemptTokenRefresh(request: any, context: ExecutionContext): Promise<boolean> {
    // Extraer el token de refresco
    const refreshToken = this.extractTokenFromCookies(request, 'RefreshToken');
    
    if (!refreshToken) {
      throw new UnauthorizedException('Autenticación requerida');
    }
    
    try {      
      const response = await fetch(`${process.env.BACKEND_URL}/authorization/refresh`, {
        method: 'POST',
        headers: {
          'Cookie': `RefreshToken=${refreshToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.log("error refresco token", response.status);
        throw new Error(`Error al refrescar el token: ${response.status}`);
      }
      // Obtener las cookies de la respuesta
      const cookies = response.headers.get('set-cookie');
      
      if (cookies) {
        // Obtengo la respuesta original para transferir las cookies a la respuesta del cliente
        const originalResponse = context.switchToHttp().getResponse();
        
        originalResponse.setHeader('Set-Cookie', cookies);
      }
      
      // Si la respuesta está ok entonces tengo las nuevas cookies. Permito la solicitud
      return true;
      
    } catch (error) {
      throw new UnauthorizedException('Error al refrescar la autenticación');
    }
  }
}