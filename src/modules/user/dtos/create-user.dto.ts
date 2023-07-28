import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/constants/role';
import { EmailNotRegistered } from 'src/decorators/validator.decorators';

export class CreateUserDto {
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

  @ApiPropertyOptional({ enum: [Role.GUEST, Role.ADMIN] })
  @IsEnum(Role)
  @IsOptional()
  role?: Role.GUEST;
}
