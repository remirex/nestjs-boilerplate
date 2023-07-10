import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/interceptors/transform-data.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseInterceptors(new TransformDataInterceptor(UserDto))
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @UseInterceptors(new TransformDataInterceptor(UserDto))
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getUser(userId);
  }

  @UseInterceptors(new TransformDataInterceptor(UserDto))
  @Post('create')
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @UseInterceptors(new TransformDataInterceptor(UserDto))
  @Patch(':id')
  editUserById(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUserById(userId, dto);
  }

  @Delete(':id')
  deleteUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.deleteUserById(userId);
  }
}
