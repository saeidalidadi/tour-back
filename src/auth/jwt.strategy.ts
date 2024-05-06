import * as jwt from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(jwt.Strategy) {
  constructor() {
    console.log('constructor');
    super({
      jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jwt-secret',
    });
  }

  validate(payload: any) {
    console.log('user payload', payload);
    return { id: payload.sub, username: payload.username };
  }
}
