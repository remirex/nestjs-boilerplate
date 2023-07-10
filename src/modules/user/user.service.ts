import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getUsers() {
    return this.prisma.user.findMany({});
  }

  getUser(userId: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: { ...dto } });

    return user;
  }

  async editUserById(userId: number, dto: EditUserDto) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { ...dto },
    });
  }

  async deleteUserById(userId: number) {
    await this.prisma.user.delete({ where: { id: userId } });
  }
}
