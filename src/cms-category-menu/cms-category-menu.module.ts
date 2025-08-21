import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CmsCategoryMenuEntity,
  CmsCategoryMenuSchema,
} from './schemas/cms-category-menu.schema';
import { CmsCategoryMenuDao } from './dao/cms-category-menu.dao';
import {
  CmsCategoryEntity,
  CmsCategorySchema,
} from 'src/cms-category/schemas/cms-category.schema';
import { CmsCategoryMenuService } from './services/cms-category-menu.service';

const DAO = [CmsCategoryMenuDao];
const SERVICES = [CmsCategoryMenuService];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CmsCategoryMenuEntity.name, schema: CmsCategoryMenuSchema },
      { name: CmsCategoryEntity.name, schema: CmsCategorySchema },
    ]),
  ],
  providers: [...DAO, ...SERVICES],
  exports: [...SERVICES],
})
export class CmsCategoryMenuModule {}
