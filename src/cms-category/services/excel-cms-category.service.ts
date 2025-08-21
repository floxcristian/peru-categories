import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { CmsCategory } from '../models/cms-category.model';

@Injectable()
export class CmsCategoryExcelService {
  private logger = new Logger('CmsCategoryExcelService');
  /**
   * Obtener categorías desde un archivo de Excel.
   * @param filePath Ruta al archivo Excel
   * @returns Array de categorías extraídas del Excel
   */
  async getCategories(fileName: string): Promise<CmsCategory[]> {
    this.logger.log(`Obteniendo categorías desde el archivo [${fileName}].`);
    const filePath = path.resolve('xslx', fileName);
    //console.log('filePath: ', filePath);
    if (!fs.existsSync(filePath)) {
      throw new Error(`El archivo Excel no existe en la ruta: ${filePath}`);
    }

    const categories: CmsCategory[] = [];
    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1);

      if (!worksheet) {
        throw new Error('No se encontró ninguna hoja en el archivo Excel');
      }

      // Validar archivo excel:
      const rowErrorsMap = new Map<number, string[]>();
      // - Si tiene al menos una fila de datos
      worksheet.eachRow((row, rowNumber) => {
        // Saltamos la fila de encabezados
        if (rowNumber <= 1) return;

        const name: string = row.getCell(1).value?.toString().trim() || '';
        if (!name) {
          const errors = rowErrorsMap.get(rowNumber) || [];
          errors.push('La categoría no tiene nombre');
          rowErrorsMap.set(rowNumber, errors);
        }
        const slug = row.getCell(2).value?.toString().trim() || '';
        if (!slug) {
          const errors = rowErrorsMap.get(rowNumber) || [];
          errors.push('La categoría no tiene slug');
          rowErrorsMap.set(rowNumber, errors);
        }
        const level = Number(row.getCell(3).value);
        if (!level) {
          const errors = rowErrorsMap.get(rowNumber) || [];
          errors.push('La categoría no tiene un nivel númerico válido');
          rowErrorsMap.set(rowNumber, errors);
        }

        const id = Number(row.getCell(4).value);
        if (!id) {
          const errors = rowErrorsMap.get(rowNumber) || [];
          errors.push('La categoría no tiene un id númerico válido');
          rowErrorsMap.set(rowNumber, errors);
        }
        const parentId = Number(row.getCell(5).value) || null;
        if (row.getCell(5).value && !parentId) {
          const errors = rowErrorsMap.get(rowNumber) || [];
          errors.push('La categoría no tiene un parentId númerico válido');
          rowErrorsMap.set(rowNumber, errors);
        }

        // Si no tiene errores insertar la categoría:
        if (rowErrorsMap.has(rowNumber)) return;
        const category: CmsCategory = {
          name,
          slug,
          level,
          id,
          parentId,
        };

        categories.push(category);
      });

      this.logger.log(
        `Se leyeron ${categories.length} categorías desde el archivo.`,
      );
      this.logger.log(
        `Se encontraron [${rowErrorsMap.size}] filas con errores en el archivo.`,
      );
      console.table(rowErrorsMap);
      return categories;
    } catch (error) {
      console.error('Error al leer el archivo Excel:', error);
      throw error;
    }
  }
}
