// jwt-auth.guard.ts
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

let refreshInProgress: Promise<boolean> | null = null; //esta promesa es para que al hacer varias request y no hay token, solo se haga 1 refresh

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  //   async canActivate(context: ExecutionContext) {
  //   // obtengo token de las cookies
  //   const request = context.switchToHttp().getRequest();
  //   const token = this.extractTokenFromCookies(request, 'Authentication');

  //   // si no hay token intento refrescar
  //   if (!token) {
  //     const refreshAttempt = await this.handleRefresh(context, request);
  //     if (!refreshAttempt) {
  //       throw new UnauthorizedException('Token no disponible');
  //     }
  //     return true;
  //   }
    
  //   try {
  //     const payload = await this.jwtService.verifyAsync(token, {
  //       secret: process.env.JWT_SECRET || 'supersecret',
  //     });
  
  //     request.user = payload; // Asignamos el payload al request para que esté disponible en los controladores
  //     return true;
  //   } catch (err) {
  //     const refreshAttempt = await this.handleRefresh(context, request);
  //     if (!refreshAttempt) {
  //       throw new UnauthorizedException('Token inválido y no se pudo refrescar');
  //     }
  //     return true;
  //   }
  // }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  private extractTokenFromCookies(request: any, cookieName: string): string | null {
    const cookies = request.headers.cookie?.split('; ');
    const targetCookie = cookies?.find(cookie => cookie.startsWith(`${cookieName}=`));
    return targetCookie?.split('=')[1] || null;
  }

  private async handleRefresh(context: ExecutionContext, request: any): Promise<boolean> {
    if (refreshInProgress) {
      // si ya hay un refresh en progreso, esperá ese resultado
      return refreshInProgress;
    }

    refreshInProgress = this.attemptTokenRefresh(request, context);

    try {
      return await refreshInProgress;
    } finally {
      refreshInProgress = null;
    }
  }

  private async attemptTokenRefresh(request: any, context: ExecutionContext): Promise<boolean> {
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
        console.log("Error al refrescar el token", response.status);
        throw new Error(`Error al refrescar el token: ${response.status}`);
      }

      // si setie nuevas cookies en la response, la asigno a la request original
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
        const originalResponse = context.switchToHttp().getResponse();
        originalResponse.setHeader('Set-Cookie', cookies);
      }

      console.log('Token refrescado correctamente');
      return true;

    } catch (error) {
      throw new UnauthorizedException('Error al refrescar la autenticación');
    }
  }
}
