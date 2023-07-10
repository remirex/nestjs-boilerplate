import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { PrismaService } from './services/prisma.service';

const providers = [ApiConfigService, PrismaService];

@Global()
@Module({
  providers,
  exports: [...providers],
})
export class SharedModule {}
