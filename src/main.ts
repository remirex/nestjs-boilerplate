import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './exceptions/prisma-client-exception.filter';
import { setupSwagger } from './setup-swagger';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );

  // enable validation globally
  // this is from NestJS docs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints).join(', '),
          })),
        );
      },
    }),
  );

  // apply PrismaClientExceptionFilter to entire application, requires HttpAdapterHost because it extends BaseExceptionFilter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.select(SharedModule).get(ApiConfigService);

  const port = configService.appConfig.port;

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  await app.listen(port);
}
bootstrap();
