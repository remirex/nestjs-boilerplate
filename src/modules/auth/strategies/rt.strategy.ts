import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { JwtPayload } from '../types/jwtPayload.type';
import { jwtPayloadWithRefreshToken } from '../types/jwtPayloadWithRefreshToken.type';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.privateRefreshTokenKey,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): jwtPayloadWithRefreshToken {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
