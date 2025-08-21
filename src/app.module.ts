import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { ProductModule } from './product/product.module';
import { CmsCategoryModule } from './cms-category/cms-category.module';
import { CmsCategoryMenuModule } from './cms-category-menu/cms-category-menu.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    ApiModule,
    DatabaseModule,
    ConfigModule,
    ProductModule,
    CmsCategoryModule,
    CmsCategoryMenuModule,
    ArticleModule,
  ],
  providers: [AppService],
})
export class AppModule {}
