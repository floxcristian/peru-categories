import { Module } from '@nestjs/common';
import { CmsCategoryDao } from './dao/cms-category.dao';
import { CmsCategoryExcelService } from './services/excel-cms-category.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CmsCategoryEntity,
  CmsCategorySchema,
} from './schemas/cms-category.schema';
import { CmsCategoryService } from './services/cms-category.service';

const DAO = [CmsCategoryDao];
const SERVICES = [CmsCategoryExcelService, CmsCategoryService];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CmsCategoryEntity.name, schema: CmsCategorySchema },
    ]),
  ],
  controllers: [],
  providers: [...DAO, ...SERVICES],
  exports: [],
})
export class CmsCategoryModule {}
