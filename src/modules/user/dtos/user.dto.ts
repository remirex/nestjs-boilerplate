import { Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserDto implements User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;
}
