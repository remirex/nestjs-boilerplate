import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  get prismaConfig() {
    return {
      url: this.getString('DATABASE_URL'),
    };
  }

  get authConfig() {
    return {
      privateAccessTokenKey: this.getString('JWT_ACCESS_TOKEN_PRIVATE_KEY'),
      privateRefreshTokenKey: this.getString('JWT_REFRESH_TOKEN_PRIVATE_KEY'),
      jwtExpirationAccessTokenTime: this.getString(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      ),
      jwtExpirationRefreshTokenTime: this.getString(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      ),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }
}
