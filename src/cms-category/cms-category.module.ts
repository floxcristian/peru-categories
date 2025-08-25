import { Module } from '@nestjs/common';
import { CmsCategoryDao } from './dao/cms-category.dao';
import { CmsCategoryExcelService } from './services/excel-cms-category.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CmsCategoryEntity,
  CmsCategorySchema,
} from './schemas/cms-category.schema';
import { CmsCategoryService } from './services/cms-category.service';
import { SkuCategoryEntity, SkuCategorySchema } from './schemas/sku-category.schema';
import { SkuCategoryDao } from './dao/sku-category.dao';
import { SkuCategoryService } from './services/sku-category.service';
import { SkuCategoryExcelService } from './services/excel-sku-category.service';

const DAO = [CmsCategoryDao, SkuCategoryDao];
const SERVICES = [CmsCategoryExcelService, CmsCategoryService, SkuCategoryService, SkuCategoryExcelService];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CmsCategoryEntity.name, schema: CmsCategorySchema },
      { name: SkuCategoryEntity.name, schema: SkuCategorySchema },
    ]),
  ],
  controllers: [],
  providers: [...DAO, ...SERVICES],
  exports: [],
})
export class CmsCategoryModule {}
