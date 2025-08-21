import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionName } from 'src/database/connection-name.constant';
import { ArticleEntity, ArticleSchema } from './schemas/article.schema';

import { ArticleService } from './services/article.service';
import { ArticleDao } from './dao/article.dao';
import { CmsCategoryMenuModule } from 'src/cms-category-menu/cms-category-menu.module';

const DAO = [ArticleDao];
const SERVICES = [ArticleService];

@Module({
  imports: [
    CmsCategoryMenuModule,
    MongooseModule.forFeature([
      { name: ArticleEntity.name, schema: ArticleSchema },
    ]),
  ],
  providers: [...DAO, ...SERVICES],
})
export class ArticleModule {}
