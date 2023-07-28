import { Injectable } from '@nestjs/common';
import { generateHash } from 'src/common/utils';
import { PrismaService } from 'src/shared/services/prisma.service';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signupLocal(dto: SignupDto) {
    // Create a copy of the input data without the passwordConfirmation field
    const dataWithoutConfirmation = { ...dto };
    delete dataWithoutConfirmation.passwordConfirmation;
    // generate pass hash
    const hash = generateHash(dto.password);
    // create user
    const user = await this.prisma.user.create({
      data: { password: hash, ...dataWithoutConfirmation },
    });
    // return saved user
    return user;
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
