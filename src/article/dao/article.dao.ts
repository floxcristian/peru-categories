import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BulkWriteResult } from 'mongodb';
import { ArticleEntity } from '../schemas/article.schema';
import { ConnectionName } from 'src/database/connection-name.constant';

@Injectable()
export class ArticleDao {
  constructor(
    @InjectModel(ArticleEntity.name /*, ConnectionName.IMPLENET*/)
    private articleEntityModel: Model<ArticleEntity>,
  ) {}

  /*getAll(): Promise<ArticleEntity[]> {
    return this.articleEntityModel.find({}).limit(20).lean();
  }*/

  /**
   * Actualizar categorías de un producto por su sku.
   * @returns
   */
  /*updateCategoriesByProductSku(sku: string, categories: any[]) {
    return this.articleEntityModel.updateMany(
      { sku },
      { $set: { categories } },
    );
  }*/

  /**
   * Bulkwrite para actualizar categorias de productos por su sku.
   * - Un sku corresponde a un solo producto.
   */
  /*bulkWriteUpdateCategoriesByProductSku(
    sku: string,
    categories: any[],
  ): Promise<BulkWriteResult> {
    return this.articleEntityModel.bulkWrite([
      {
        updateOne: {
          filter: { sku },
          update: { $set: { categories } },
        },
      },
    ]);
  }*/
}
