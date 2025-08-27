// Nestjs
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { loadConfig } from './config/config';
import {
  Logger,
} from '@nestjs/common';
import { CmsCategoryService } from './cms-category/services/cms-category.service';
import { SkuCategoryService } from './cms-category/services/sku-category.service';
import { ArticleService } from './cms-category/services/article.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { api } = loadConfig();
  const { port } = api;
  await app.listen(port);
  const logger = new Logger('Api');
  logger.log(`🚀 Server is running on port [${port}].`);

  // Llamamos al método replaceAllFromExcel
  const cmsCategoryService = app.get(CmsCategoryService);
  await cmsCategoryService.replaceAllFromExcel();
  //Llamamos al metodo replaceAllFromExcel de sku categories
  const skuCategoryService = app.get(SkuCategoryService);
  await skuCategoryService.replaceAllFromExcel();
  //Llamamos al metodo replaceAllFromExcel para incrustar en los articulos
  const articleService = app.get(ArticleService);
  await articleService.replaceAllFromExcel();
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
