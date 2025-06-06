import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

// se verifica el token extrayendolo de las cookies
@Injectable()
export class RefreshJwtGuard extends AuthGuard('refresh-jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(request);
    // console.log("Inside refresh")
    // console.log("[Guard] Cookies recibidas:", request.headers.cookie);

    if (!token) {
      console.log("Inside refresh error")
      throw new UnauthorizedException('Refresh Token no proporcionado');
    }

    try {
      console.log("Inside refreshGuard try")
      // Verifico token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET2 || 'supersecret',
      });

      // Asignamos el payload al request para que esté disponible en los controladores
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Refresh Token inválido o expirado');
    }
  }

  private extractTokenFromCookies(request: any): string | null {
    const cookies = request.headers.cookie?.split('; ');
    const authCookie = cookies?.find(cookie => cookie.startsWith('RefreshToken='));
    return authCookie?.split('=')[1] || null;
  }

  // private extractTokenFromHeader(request: any): string | null {
  //   const headers = request.headers.authorization?.split(' ');
  //   const authCookie = cookies?.find(cookie => cookie.startsWith('RefreshToken='));
  //   return authCookie?.split('=')[1] || null;
  // }
}