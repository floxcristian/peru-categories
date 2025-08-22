import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { nanoid } from 'nanoid';
import { CmsCategory } from '../models/cms-category.model';
import { CmsCategoryEntity } from '../schemas/cms-category.schema';

@Injectable()
export class CmsCategoryExcelService {
  private logger = new Logger('CmsCategoryExcelService');

  /**
   * Genera un ID único para las categorías
   * @returns Un ID único
   */
  private generateId(): string {
    return nanoid(8);
  }

  /**
   * Obtener categorías desde un archivo de Excel.
   * @param filePath Ruta al archivo Excel
   * @returns Array de categorías extraídas del Excel
   */
  async getCategories(fileName: string): Promise<Partial<CmsCategoryEntity>[]> {
    this.logger.log(`Obteniendo categorías desde el archivo [${fileName}].`);
    const filePath = path.resolve('xslx', fileName);
    //console.log('filePath: ', filePath);
    if (!fs.existsSync(filePath)) {
      throw new Error(`El archivo Excel no existe en la ruta: ${filePath}`);
    }

    const categories: Partial<CmsCategoryEntity>[] = [];
    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(4);

      if (!worksheet) {
        throw new Error('No se encontró ninguna hoja en el archivo Excel');
      }

      const categoriesMap = {};

      // Validar archivo excel:
      const rowErrorsMap = new Map<number, string[]>();
      // - Si tiene al menos una fila de datos
      worksheet.eachRow((row, rowNumber) => {
        // Saltamos la fila de encabezados
        if (rowNumber <= 1) return;

        const level1Name: string =
          row.getCell(1).value?.toString().trim() || '';
        if (!level1Name) {
          const errors = rowErrorsMap.get(rowNumber) || [];
          errors.push('El nivel 1 no tiene nombre');
          rowErrorsMap.set(rowNumber, errors);
        }
        const level1Slug =
          row.getCell(2).value?.toString().trim().toLocaleLowerCase() || '';
        if (!level1Slug) {
          const errors = rowErrorsMap.get(rowNumber) || [];
          errors.push('El nivel 1 no tiene slug');
          rowErrorsMap.set(rowNumber, errors);
        }

        const level2Name: string =
          row.getCell(3).value?.toString().trim() || '';
        if (!level2Name) {
          const errors = rowErrorsMap.get(rowNumber) || [];
          errors.push('El nivel 2 no tiene nombre');
          rowErrorsMap.set(rowNumber, errors);
        }
        const level2Slug =
          row.getCell(4).value?.toString().trim().toLocaleLowerCase() || '';
        if (!level2Slug) {
          const errors = rowErrorsMap.get(rowNumber) || [];
          errors.push('El nivel 2 no tiene slug');
          rowErrorsMap.set(rowNumber, errors);
        }

        const level3Name: string =
          row.getCell(5).value?.toString().trim() || '';
        if (!level3Name) {
          const errors = rowErrorsMap.get(rowNumber) || [];
          errors.push('El nivel 3 no tiene nombre');
          rowErrorsMap.set(rowNumber, errors);
        }
        const level3Slug =
          row.getCell(6).value?.toString().trim().toLocaleLowerCase() || '';
        if (!level3Slug) {
          const errors = rowErrorsMap.get(rowNumber) || [];
          errors.push('El nivel 3 no tiene slug');
          rowErrorsMap.set(rowNumber, errors);
        }

        // Si no tiene errores insertar la categoría:
        if (rowErrorsMap.has(rowNumber)) return;

        // Agrupar árbol de categorías
        if (!categoriesMap[level1Slug]) {
          categoriesMap[level1Slug] = {
            name: level1Name,
            slug: level1Slug,
            categoriesLevel2Map: {},
          };
        }

        if (!categoriesMap[level1Slug].categoriesLevel2Map[level2Slug]) {
          categoriesMap[level1Slug].categoriesLevel2Map[level2Slug] = {
            name: level2Name,
            slug: level2Slug,
            categoriesLevel3Map: {},
          };
        }

        if (
          !categoriesMap[level1Slug].categoriesLevel2Map[level2Slug]
            .categoriesLevel3Map[level3Slug]
        ) {
          categoriesMap[level1Slug].categoriesLevel2Map[
            level2Slug
          ].categoriesLevel3Map[level3Slug] = {
            name: level3Name,
            slug: level3Slug,
          };
        }
      });

      Object.values(categoriesMap).forEach((level1: any) => {
        const categoryLevel1Id = this.generateId();
        const categoryLevel1: Partial<CmsCategoryEntity> = {
          name: level1.name,
          slug: level1.slug,
          level: 1,
          id: categoryLevel1Id,
          parentId: null,
        };
        categories.push(categoryLevel1);

        Object.values(level1.categoriesLevel2Map).forEach((level2: any) => {
          const categoryLevel2Id = this.generateId();
          const categoryLevel2: Partial<CmsCategoryEntity> = {
            name: level2.name,
            slug: level2.slug,
            level: 2,
            id: categoryLevel2Id,
            parentId: categoryLevel1Id,
          };
          categories.push(categoryLevel2);

          Object.values(level2.categoriesLevel3Map).forEach((level3: any) => {
            const categoryLevel3: Partial<CmsCategoryEntity> = {
              name: level3.name,
              slug: level3.slug,
              level: 3,
              id: this.generateId(),
              parentId: categoryLevel2Id,
            };
            categories.push(categoryLevel3);
          });
        });
      });

      this.logger.log(
        `Se leyeron ${categories.length} categorías desde el archivo.`,
      );
      this.logger.log(
        `Se encontraron [${rowErrorsMap.size}] filas con errores en el archivo.`,
      );
      console.log(categoriesMap['accesorios']);
      console.table(rowErrorsMap);
      return categories;
    } catch (error) {
      console.error('Error al leer el archivo Excel:', error);
      throw error;
    }
  }
}
