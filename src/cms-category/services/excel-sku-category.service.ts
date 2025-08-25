import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { SkuCategoryEntity } from '../schemas/sku-category.schema';
import { CmsCategoryDao } from '../dao/cms-category.dao';

@Injectable()
export class SkuCategoryExcelService {
    private logger = new Logger('SkuCategoryExcelService');

    constructor(
        private readonly cmsCategoryDao: CmsCategoryDao,
    ) {}

    /**
   * Obtener sku categorias desde un archivo de Excel.
   * @param filePath Ruta al archivo Excel
   * @returns Array de sku-categorías extraídas del Excel
   */
        async getSkuCategories(fileName: string): Promise<Partial<SkuCategoryEntity>[]> {
        this.logger.log(`Obteniendo categorías desde el archivo [${fileName}].`);
        const filePath = path.resolve('xslx', fileName);
        //console.log('filePath: ', filePath);
        if (!fs.existsSync(filePath)) {
            throw new Error(`El archivo Excel no existe en la ruta: ${filePath}`);
        }

        const skuCategories: Partial<SkuCategoryEntity>[] = [];
        const prevSkuCategories:any = []
        const workbook = new ExcelJS.Workbook();

        try {
            await workbook.xlsx.readFile(filePath);
            const worksheet = workbook.getWorksheet(2);

            if (!worksheet) {
                throw new Error('No se encontró ninguna hoja en el archivo Excel');
            }

            // Validar archivo excel:
            const rowErrorsMap = new Map<number, string[]>();
            // - Si tiene al menos una fila de datos
            worksheet.eachRow((row, rowNumber) => {
                // Saltamos la fila de encabezados
                if (rowNumber <= 1) return;

                const sku: string =
                    row.getCell(1).value?.toString().trim() || '';
                if (!sku) {
                    const errors = rowErrorsMap.get(rowNumber) || [];
                    errors.push('El SKU no existe');
                    rowErrorsMap.set(rowNumber, errors);
                }

                const level1Name: string =
                    row.getCell(3).value?.toString().trim() || '';
                if (!level1Name) {
                    const errors = rowErrorsMap.get(rowNumber) || [];
                    errors.push('El nivel 1 no tiene nombre');
                    rowErrorsMap.set(rowNumber, errors);
                }
                const level1Slug =
                    row.getCell(4).value?.toString().trim().toLocaleLowerCase() || '';
                if (!level1Slug) {
                    const errors = rowErrorsMap.get(rowNumber) || [];
                    errors.push('El nivel 1 no tiene slug');
                    rowErrorsMap.set(rowNumber, errors);
                }

                const level2Name: string =
                    row.getCell(5).value?.toString().trim() || '';
                if (!level2Name) {
                    const errors = rowErrorsMap.get(rowNumber) || [];
                    errors.push('El nivel 2 no tiene nombre');
                    rowErrorsMap.set(rowNumber, errors);
                }
                const level2Slug = row.getCell(6).value?.toString().trim().toLocaleLowerCase() || '';
                if (!level2Slug) {
                    const errors = rowErrorsMap.get(rowNumber) || [];
                    errors.push('El nivel 2 no tiene slug');
                    rowErrorsMap.set(rowNumber, errors);
                }

                const level3Name: string = row.getCell(7).value?.toString().trim() || '';
                if (!level3Name) {
                    const errors = rowErrorsMap.get(rowNumber) || [];
                    errors.push('El nivel 3 no tiene nombre');
                    rowErrorsMap.set(rowNumber, errors);
                }
                const level3Slug =
                    row.getCell(8).value?.toString().trim().toLocaleLowerCase() || '';
                if (!level3Slug) {
                    const errors = rowErrorsMap.get(rowNumber) || [];
                    errors.push('El nivel 3 no tiene slug');
                    rowErrorsMap.set(rowNumber, errors);
                }

                // Si no tiene errores insertar la categoría:
                if (rowErrorsMap.has(rowNumber)) return;
                let skuCategory= {
                    sku: sku,
                    level1: level1Name,
                    slug1: level1Slug,
                    level2: level2Name,
                    slug2: level2Slug,
                    level3: level3Name,
                    slug3: level3Slug
                }
                prevSkuCategories.push(skuCategory);
            });

            for (const skuCategory of prevSkuCategories) {
                let newSkuCategory: Partial<SkuCategoryEntity> = {
                    sku: skuCategory.sku,
                    categories: []
                }
                if(skuCategory.slug1) {
                    const existingCategory = await this.cmsCategoryDao.findBySlug(skuCategory.slug1);
                    if (existingCategory) {
                        let category = {
                            _id: existingCategory.id,
                            name: existingCategory.name,
                            slug: existingCategory.slug,
                            level: 1
                        }
                        newSkuCategory.categories?.push(category)
                    }
                }
                if(skuCategory.slug2) {
                    const existingCategory = await this.cmsCategoryDao.findBySlug(skuCategory.slug2);
                    if (existingCategory) {
                        let category = {
                            _id: existingCategory.id,
                            name: existingCategory.name,
                            slug: existingCategory.slug,
                            level: 2
                        }
                        newSkuCategory.categories?.push(category)
                    }
                }
                if(skuCategory.slug3) {
                    const existingCategory = await this.cmsCategoryDao.findBySlug(skuCategory.slug3);
                    if (existingCategory) {
                        let category = {
                            _id: existingCategory.id,
                            name: existingCategory.name,
                            slug: existingCategory.slug,
                            level: 3
                        }
                        newSkuCategory.categories?.push(category)
                    }
                }
                skuCategories.push(newSkuCategory);
            }

            this.logger.log(
                `Se leyeron ${skuCategories.length} categorías desde el archivo.`,
            );
            this.logger.log(
                `Se encontraron [${rowErrorsMap.size}] filas con errores en el archivo.`,
            );
            console.log(skuCategories);
            console.table(rowErrorsMap);
            return skuCategories;
        } catch (error) {
            console.error('Error al leer el archivo Excel:', error);
            throw error;
        }
    }
}
