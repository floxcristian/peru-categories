// Nestjs
import { Injectable, Logger } from '@nestjs/common';
// Dao
import { CmsCategoryDao } from '../dao/cms-category.dao';
// Services
import { CmsCategoryExcelService } from './excel-cms-category.service';

@Injectable()
export class CmsCategoryService {
  private logger = new Logger('CmsCategoryService');

  constructor(
    private readonly cmsCategoryDao: CmsCategoryDao,
    private readonly cmsCategoryExcelService: CmsCategoryExcelService,
  ) {}

  async replaceAllFromExcel(): Promise<void> {
    const categories = await this.cmsCategoryExcelService.getCategories(
      'cms_categories.xlsx',
    );
    if (!categories.length) return;
    /*this.logger.log(
      `Reemplazando todas las categorías en la colección [cms_categories].`,
    );
    await this.cmsCategoryDao.replaceAll(categories);
    this.logger.log(
      `Se han reemplazado todas las categorías en la colección [cms_categories].`,
    );*/
  }
}
