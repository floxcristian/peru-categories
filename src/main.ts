// Nestjs
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { loadConfig } from './config/config';
import {
  //INestApplication,
  Logger,
  /*ValidationPipe,
  VersioningType,*/
} from '@nestjs/common';
/*import { AppService } from './app.service'; // Importamos AppService
import { CmsCategoryExcelService } from './cms-category/services/excel-cms-category.service';*/
import { CmsCategoryService } from './cms-category/services/cms-category.service';
import { SkuCategoryService } from './cms-category/services/sku-category.service';
/*import { CmsCategoryMenuService } from './cms-category-menu/services/cms-category-menu.service';
import { ArticleService } from './article/services/article.service';*/

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { api } = loadConfig();
  const { port } = api;
  await app.listen(port);
  const logger = new Logger('Api');
  logger.log(`🚀 Server is running on port [${port}].`);

  // Obtenemos la instancia de AppService del contexto de la aplicación
  /*const cmsCategoryMenuService = app.get(CmsCategoryMenuService);
  const articleService = app.get(ArticleService);*/
  /*await cmsCategoryMenuService.replaceAll();
  await cmsCategoryMenuService.getLevel3CategoriesMap();*/
  /*const response =
    await articleService.updateCategoriesFromExcel('articles.xlsx');
  console.log('Response: ', response);*/
  //console.table(articles);
  //cmsCategoryService.getLevel3CategoriesMap();
  // Llamamos al método replaceAllFromExcel
  const cmsCategoryService = app.get(CmsCategoryService);
  await cmsCategoryService.replaceAllFromExcel();
  //Llamamos al metodo replaceAllFromExcel de sku categories
  const skuCategoryService = app.get(SkuCategoryService);
  await skuCategoryService.replaceAllFromExcel();
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
