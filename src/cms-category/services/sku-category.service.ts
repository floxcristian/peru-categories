// Nestjs
import { Injectable, Logger } from '@nestjs/common';
// Dao
import { SkuCategoryDao } from '../dao/sku-category.dao';
// Services
import { SkuCategoryExcelService } from './excel-sku-category.service';

@Injectable()
export class SkuCategoryService {
    private logger = new Logger('SkuCategoryService');

    constructor(
        private readonly skuCategoryDao: SkuCategoryDao,
        private readonly skuCategoryExcelService: SkuCategoryExcelService,
    ) {}

    async replaceAllFromExcel(): Promise<void> {
        const skuCategories = await this.skuCategoryExcelService.getSkuCategories(
            'categorias-peru.xlsx',
        );
        if (!skuCategories.length) return;
        this.logger.log(
            `Reemplazando todas las sku-categorías en la colección [sku_categories].`,
        );
        await this.skuCategoryDao.replaceAll(skuCategories);
        this.logger.log(
            `Se han reemplazado todas las sku-categorías en la colección [sku_categories].`,
        );
    }
}