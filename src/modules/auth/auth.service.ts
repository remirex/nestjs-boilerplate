import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signupLocal(dto: SignupDto) {
    // generate pass hash
    // save user
    // save tokens and update refresh token hash
    // return saved user
  }
  signinLocal() {
    return 'signin';
  }
  logout() {
    return 'logout';
  }
  refreshTokens() {
    return 'refresh tokens';
  }
}
