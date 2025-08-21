import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { loadConfig } from './config';
import { validate } from './config.validation';
import { ConfigService } from './config.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      //envFilePath: `./env/.env.${process.env.NODE_ENV || 'development'}`,
      load: [loadConfig],
      isGlobal: true,
      cache: true,
      validate,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
