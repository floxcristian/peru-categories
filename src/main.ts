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
/*import { CmsCategoryMenuService } from './cms-category-menu/services/cms-category-menu.service';
import { ArticleService } from './article/services/article.service';*/

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { api, database } = loadConfig();

  console.log('database: ', database);
  const { port } = api;
  await app.listen(port);
  const logger = new Logger('Api');
  logger.log(`🚀 Server is running on port [${port}].`);

  // Obtenemos la instancia de AppService del contexto de la aplicación
  const cmsCategoryService = app.get(CmsCategoryService);
  /*const cmsCategoryMenuService = app.get(CmsCategoryMenuService);
  const articleService = app.get(ArticleService);*/
  // Llamamos al método replaceAllFromExcel
  await cmsCategoryService.replaceAllFromExcel();
  /*await cmsCategoryMenuService.replaceAll();
  await cmsCategoryMenuService.getLevel3CategoriesMap();*/
  /*const response =
    await articleService.updateCategoriesFromExcel('articles.xlsx');
  console.log('Response: ', response);*/
  //console.table(articles);
  //cmsCategoryService.getLevel3CategoriesMap();
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
