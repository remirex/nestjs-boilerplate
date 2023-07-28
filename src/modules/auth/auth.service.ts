import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generateHash, validateHash } from 'src/common/utils';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';
import { JwtPayload } from './types/jwtPayload.type';
import { Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ApiConfigService,
  ) {}

  async signupLocal(dto: SignupDto) {
    // Create a copy of the input data without the passwordConfirmation field
    const dataWithoutConfirmation = { ...dto };
    delete dataWithoutConfirmation.passwordConfirmation;
    // generate pass hash
    const hash = generateHash(dto.password);
    // create user
    const user = await this.prisma.user.create({
      data: { ...dataWithoutConfirmation, password: hash },
    });
    // return saved user
    return user;
  }
  async signinLocal(dto: SigninDto): Promise<Tokens> {
    // find user
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { email: dto.email },
    });
    // compare password
    const passwordMatches = await validateHash(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');
    // return access & refresh tokens
    const tokens = await this.getTokens(user.id, user.email, user.role);

    return tokens;
  }
  logout() {
    return 'logout';
  }
  refreshTokens() {
    return 'refresh tokens';
  }

  async getTokens(
    userId: number,
    email: string,
    role: string,
  ): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
      role: role,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.authConfig.privateAccessTokenKey,
        expiresIn: this.configService.authConfig.jwtExpirationAccessTokenTime,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.authConfig.privateRefreshTokenKey,
        expiresIn: this.configService.authConfig.jwtExpirationRefreshTokenTime,
      }),
    ]);

    return { access_token: at, refresh_token: rt };
  }
}
