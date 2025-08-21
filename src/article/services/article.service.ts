// Nestjs
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// Libs
import { Model } from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';
import * as ExcelJS from 'exceljs';
// Constants
import { ConnectionName } from 'src/database/connection-name.constant';
// Schemas
import { ArticleEntity } from '../schemas/article.schema';
// Models
import { ArticleNotFound } from '../models/article-not-found.interface';
import {
  ExcelArticle,
  ExcelCategoryArticle,
} from '../models/excel-article.interface';
// Services
import { CmsCategoryMenuService } from 'src/cms-category-menu/services/cms-category-menu.service';
import { formatTotalTime } from './util.service';

@Injectable()
export class ArticleService {
  private logger = new Logger(ArticleService.name);

  constructor(
    private readonly cmsCategoryMenuService: CmsCategoryMenuService,
    @InjectModel(ArticleEntity.name /*, ConnectionName.IMPLENET*/)
    private articleEntityModel: Model<ArticleEntity>,
  ) {}

  async updateCategoriesFromExcel(fileName: string) {
    this.logger.log(`Actualizando categorias desde el archivo ${fileName}`);
    const filePath = path.resolve('xslx', fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`El archivo Excel no existe en la ruta: ${filePath}`);
    }

    const { level1CategoriesMap, level2CategoriesMap, level3CategoriesMap } =
      await this.cmsCategoryMenuService.getLevel3CategoriesMap();

    const startTime = Date.now();
    const BATCH_SIZE = 5000;
    let currentBatch: ExcelArticle[] = [];
    let notFoundCategories: ArticleNotFound[] = [];
    const notFoundSkus: string[] = [];
    let batchCount = 0;
    let updatedProducts = 0;
    let notFoundProducts = 0;
    let isFirstWorksheet = true;
    let isFirstRow = true;

    return new Promise(async (resolve, reject) => {
      try {
        const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(
          filePath,
          {
            sharedStrings: 'cache',
            hyperlinks: 'ignore',
            worksheets: 'emit',
          },
        );

        for await (const worksheetReader of workbookReader) {
          if (!isFirstWorksheet) {
            continue;
          }
          isFirstWorksheet = false;

          for await (const row of worksheetReader) {
            if (isFirstRow) {
              isFirstRow = false;
              continue;
            }

            const values = row.values;
            const sku = values[1].toString();
            const categoryLevel3Id = Number(values[2]);

            const categoryLevel3 = level3CategoriesMap.get(categoryLevel3Id);
            if (!categoryLevel3) {
              this.logger.warn(
                `Category id [${categoryLevel3Id}] level [3] not found on row [${row.number}] for sku [${sku}].`,
              );
              notFoundCategories.push({
                sku,
                row: row.number,
                categoryId: categoryLevel3Id,
              });
              continue;
            }
            const {
              name: categoryLevel3Name,
              slug: categoryLevel3Slug,
              parentId: categoryLevel2Id,
            } = categoryLevel3;
            const categoryLevel2 = level2CategoriesMap.get(categoryLevel2Id);
            if (!categoryLevel2) {
              this.logger.warn(
                `Category id [${categoryLevel2Id}] level [2] not found on row [${row.number}] for sku [${sku}].`,
              );
              notFoundCategories.push({
                sku,
                row: row.number,
                categoryId: categoryLevel3Id,
              });
              continue;
            }
            const {
              name: categoryLevel2Name,
              slug: categoryLevel2Slug,
              parentId: categoryLevel1Id,
            } = categoryLevel2;

            const categoryLevel1 = level1CategoriesMap.get(categoryLevel1Id);
            if (!categoryLevel1) {
              this.logger.warn(
                `Category id [${categoryLevel1Id}] level [1] not found on row [${row.number}] for sku [${sku}].`,
              );
              notFoundCategories.push({
                sku,
                row: row.number,
                categoryId: categoryLevel3Id,
              });
              continue;
            }
            const { name: categoryLevel1Name, slug: categoryLevel1Slug } =
              categoryLevel1;

            const categories: ExcelCategoryArticle[] = [
              {
                level: 1,
                id: categoryLevel1Id,
                name: categoryLevel1Name,
                slug: categoryLevel1Slug,
                /*url: `/${categoryLevel1Slug}/`,
                parent_id: null,*/
              },
              {
                level: 2,
                id: categoryLevel2Id,
                name: categoryLevel2Name,
                slug: categoryLevel2Slug,
                /*url: `/${categoryLevel2Slug}/`,
                parent_id: categoryLevel1Id,*/
              },
              {
                level: 3,
                id: categoryLevel3Id,
                name: categoryLevel3Name,
                slug: categoryLevel3Slug,
                /*url: `/${categoryLevel3Slug}/`,
                parent_id: categoryLevel2Id,*/
              },
            ];
            currentBatch.push({
              sku,
              categories,
            });
            if (currentBatch.length >= BATCH_SIZE) {
              batchCount++;
              const result = await this.processBatch(currentBatch, batchCount);
              updatedProducts += result.updatedProducts;
              notFoundProducts += result.notFoundProducts;
              notFoundSkus.push(...result.notFoundSkus);
              currentBatch = [];
              this.logger.log(
                `📈 Progress: [${updatedProducts}] updated products, [${notFoundProducts}] not found products`,
              );
            }
          }

          if (currentBatch.length) {
            batchCount++;
            const result = await this.processBatch(currentBatch, batchCount);
            updatedProducts += result.updatedProducts;
            notFoundProducts += result.notFoundProducts;
          }
          const totalTimeInSeconds = (Date.now() - startTime) / 1000;
          const totalTime = formatTotalTime(totalTimeInSeconds);
          this.logger.log(
            `🎉 Update completed in ${totalTime} seconds with [${updatedProducts}] updated products, [${notFoundProducts}] not found products and [${notFoundCategories.length}] not found categories.`,
          );

          resolve({
            updatedProducts,
            notFoundProducts,
            notFoundCategories,
            notFoundSkus,
            totalTime,
          });
        }
      } catch (error) {
        this.logger.error(
          `Error durante la actualización: ${error.message}`,
          error.stack,
        );
        reject(error);
      }
    });
  }

  /**
   * Procesa un lote de productos y actualiza sus categorías en la base de datos.
   * @param batch - Lote de productos a procesar.
   * @param batchCount - Número del lote actual.
   * @returns Un objeto con el número de productos actualizados y no encontrados.
   */
  async processBatch(
    batch: ExcelArticle[],
    batchCount: number,
  ): Promise<{
    updatedProducts: number;
    notFoundProducts: number;
    notFoundSkus: string[];
  }> {
    try {
      const operations = batch.map(({ sku, categories }) => {
        return {
          updateOne: {
            filter: { sku },
            update: { $set: { categories } },
            upsert: false, // Si prefiere crear productos nuevos, cambie a true
          },
        };
      });
      this.logger.log(
        `⌛ Processing batch [${batchCount}] with [${batch.length}] products.`,
      );
      const result = await this.articleEntityModel.bulkWrite(operations, {
        ordered: false,
      });
      const updatedProducts = result.modifiedCount || 0;
      const notFoundProducts = batch.length - updatedProducts;

      const notFoundSkus: string[] = [];
      if (result.modifiedCount < batch.length) {
        const skus = batch.map((item) => item.sku);

        const productsSkus = await this.articleEntityModel
          .find(
            {
              sku: { $in: skus },
            },
            { sku: 1 },
          )
          .lean();
        const foundProductSkus = productsSkus.map((item) => item.sku);
        const notFoundProductsSkus = skus.filter(
          (sku) => !foundProductSkus.includes(sku),
        );
        if (notFoundProductsSkus.length) {
          this.logger.warn(
            `⚠️ Products not found in batch [${batchCount}]: [${notFoundProductsSkus.join(
              ', ',
            )}].`,
          );
          notFoundSkus.push(...notFoundProductsSkus);
        }
      }

      this.logger.log(
        `✅ Batch [${batchCount}] is completed. ${updatedProducts} updated and [${notFoundProducts}] not found.`,
      );

      return {
        updatedProducts,
        notFoundProducts,
        notFoundSkus,
      };
    } catch (error) {
      this.logger.error(
        `Error on process batch [${batchCount}]: ${error.message}`,
      );
      throw error;
    }
  }
}
