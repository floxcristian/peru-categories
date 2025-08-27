// Nestjs
import { Injectable, Logger } from '@nestjs/common';
// Dao
import { ArticleDao } from '../dao/article.dao';
import { SkuCategoryDao } from '../dao/sku-category.dao';

@Injectable()
export class ArticleService {
    private logger = new Logger('ArticleService');

    constructor(
        private readonly articleDao: ArticleDao,
        private readonly skuCategoryDao: SkuCategoryDao,
    ) {}

    async replaceAllFromExcel(): Promise<void> {
        this.logger.log(
            `Limpiando todas las categorías de los articulos [articles].`,
        );
        await this.articleDao.resetCategoriesAll();
        const sku_categories = await this.skuCategoryDao.getAll()

        this.logger.log(
            `Empeazando la asignación de las nuevas categorías a los articulos [articles].`,
        );
        for (const sku_category of sku_categories) {
            await this.articleDao.update(sku_category)
        }
        this.logger.log(
            `Se han asignado todas las categorías a los articulos [articles].`,
        );
    }
}
