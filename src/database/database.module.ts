import { Module } from '@nestjs/common';
import { EcommerceMongoModule } from './modules/ecommerce-mongo.module';

@Module({
  imports: [EcommerceMongoModule],
})
export class DatabaseModule {}
