
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, //esto permite que si el token esta vencido passport se encarga de todo
      secretOrKey: process.env.JWT_SECRET2 || "supersecret",
    });
  }

  async validate(payload: any) {
    return { 
        userId: payload.sub, 
        username: payload.username,
        email: payload.email,
        roles: payload.roles 
     };
  }
}
