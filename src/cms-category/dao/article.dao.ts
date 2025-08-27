// Nestjs
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// Schemas
import { ArticleEntity } from '../schemas/article.schema';
import { SkuCategoryEntity } from '../schemas/sku-category.schema';

@Injectable()
export class ArticleDao {
    constructor(
        @InjectModel(ArticleEntity.name)
        private articleEntityModel: Model<ArticleEntity>,
    ) {}

    async resetCategoriesAll(): Promise<void> {
        await this.articleEntityModel.updateMany(
            {}, // todos los documentos
            { $set: { categories: [] } }
        );
    }

    async update(skuCategory: Partial<SkuCategoryEntity>): Promise<void> {
        await this.articleEntityModel.updateMany(
            { sku: skuCategory.sku },
            { $set: { categories: skuCategory.categories } }
        );
    }
}
