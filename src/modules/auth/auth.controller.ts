import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { TransformDataInterceptor } from 'src/interceptors/transform-data.interceptor';
import { UserDto } from '../user/dtos/user.dto';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(new TransformDataInterceptor(UserDto))
  @Post('/local/signup')
  signupLocal(@Body() dto: SignupDto) {
    return this.authService.signupLocal(dto);
  }

  @Post('/local/signin')
  signinLocal() {
    return this.authService.signinLocal();
  }

  @Post('/logout')
  logout() {
    return this.authService.logout();
  }

  @Post('/refresh')
  refreshTokens() {
    return this.authService.refreshTokens();
  }
}
