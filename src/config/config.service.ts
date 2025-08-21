import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Api, Database } from './config.interface';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get api(): Api {
    return this.configService.get('config.api') as Api;
  }

  get database() {
    return this.configService.get<Database>('config.database') as Database;
  }
}
