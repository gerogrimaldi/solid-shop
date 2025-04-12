
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { TokenPayload } from './payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, //esto permite que si el token esta vencido passport se encarga de todo
      secretOrKey: process.env.JWT_SECRET || "supersecret",
    });
  }

  async validate(payload: TokenPayload) {
    return { 
        userId: payload.sub, 
        username: payload.username,
        email: payload.email,
        roles: payload.roles,
        cartId: payload.cartId,
        wishlistId: payload.wishlistId 
     };
  }
}
