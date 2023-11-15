import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { jwt_secret } from './jwt-secret';
import { AuthUserDto } from './auth-user.dto';
import { User } from 'src/features/users/domain/user.domain';

@Injectable()
export class JwtStrategy extends PassportStrategy(JWTStrategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt_secret,
    });
  }

  validate(payload: User) {
    return new AuthUserDto(payload);
  }
}
