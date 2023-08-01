import { JwtPayload } from './jwtPayload.type';

export type jwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };
