import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ApiConfigService) {
    super({
      datasources: {
        db: {
          url: configService.prismaConfig.url,
        },
      },
    });
  }
}
