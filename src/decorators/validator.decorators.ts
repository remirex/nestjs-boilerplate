import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

const prisma = new PrismaClient();

@Injectable()
@ValidatorConstraint({ async: true })
export class IsEmailNotRegistered implements ValidatorConstraintInterface {
  async validate(email: string) {
    const user = await prisma.user.findUnique({ where: { email: email } });
    return !user;
  }
}

export function EmailNotRegistered(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailNotRegistered,
    });
  };
}
