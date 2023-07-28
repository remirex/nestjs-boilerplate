import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import {
  EmailNotRegistered,
  PasswordMatch,
} from 'src/decorators/validator.decorators';

export class SignupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @EmailNotRegistered({ message: 'email already registered' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @PasswordMatch('password')
  passwordConfirmation: string;
}
