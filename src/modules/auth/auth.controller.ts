import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/decorators';
import { RtGuard } from 'src/guards/rt.guard';
import { TransformDataInterceptor } from 'src/interceptors/transform-data.interceptor';
import { UserDto } from '../user/dtos/user.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';
import { Tokens } from './types/tokens.type';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseInterceptors(new TransformDataInterceptor(UserDto))
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Put some description for signup user' })
  @ApiCreatedResponse({
    description: 'Signup successfully',
    status: HttpStatus.CREATED,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    status: HttpStatus.BAD_REQUEST,
  })
  signupLocal(@Body() dto: SignupDto): Promise<UserDto> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Put some description for signin user' })
  @ApiOkResponse({ status: HttpStatus.OK })
  @ApiBadRequestResponse({
    description: 'Bad request',
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiForbiddenResponse({
    description: 'Access Denied',
    status: HttpStatus.FORBIDDEN,
  })
  @ApiNotFoundResponse({
    description: 'No User found',
    status: HttpStatus.NOT_FOUND,
  })
  signinLocal(@Body() dto: SigninDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Put some description for logout user' })
  @ApiOkResponse({
    description: 'Successfully logout user',
    status: HttpStatus.OK,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    status: HttpStatus.UNAUTHORIZED,
  })
  logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    console.log(userId);
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Put some description for refresh token' })
  @ApiOkResponse({
    description: 'Successfully refresh token',
    status: HttpStatus.OK,
  })
  @ApiForbiddenResponse({
    description: 'Access Denied',
    status: HttpStatus.FORBIDDEN,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    status: HttpStatus.UNAUTHORIZED,
  })
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
