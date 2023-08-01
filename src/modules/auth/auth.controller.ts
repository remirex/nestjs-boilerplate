import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { AtGuard } from 'src/guards/at.guard';
import { TransformDataInterceptor } from 'src/interceptors/transform-data.interceptor';
import { UserDto } from '../user/dtos/user.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';
import { Tokens } from './types/tokens.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(new TransformDataInterceptor(UserDto))
  @Post('/local/signup')
  signupLocal(@Body() dto: SignupDto) {
    return this.authService.signupLocal(dto);
  }

  @Post('/local/signin')
  signinLocal(@Body() dto: SigninDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @UseGuards(AtGuard)
  @Post('/logout')
  logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    console.log(userId);
    return this.authService.logout(userId);
  }

  @Post('/refresh')
  refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
