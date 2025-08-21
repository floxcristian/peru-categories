import { Injectable, Logger } from '@nestjs/common';
import { CmsCategoryMenuDao } from '../dao/cms-category-menu.dao';
import { FirstLevelCategoryMap } from '../models/first-level-category-map.type';
import { ChildLevelCategoryMap } from '../models/child-level-category-map.type';

@Injectable()
export class CmsCategoryMenuService {
  private logger = new Logger(CmsCategoryMenuService.name);

  constructor(private readonly cmsCategoryMenuDao: CmsCategoryMenuDao) {}

  async replaceAll(): Promise<void> {
    this.logger.log(
      `Reemplazando todas las categorías del menú en la colección [cms_categories_menu].`,
    );
    await this.cmsCategoryMenuDao.replaceAll();
    this.logger.log(
      `Se han reemplazado todas las categorías del menú en la colección [cms_categories_menu].`,
    );
  }

  /**
   * Obtener todo el arbol de categorias (nivel 1, 2 y 3).
   * @returns
   */
  async getLevel3CategoriesMap() {
    this.logger.log(
      `Obteniendo el árbol de categorías (nivel 1, 2 y 3) desde la colección [cms_categories_menu].`,
    );
    const cmsCategoriesMenu = await this.cmsCategoryMenuDao.getAll();
    const level1CategoriesMap: FirstLevelCategoryMap = new Map();
    const level2CategoriesMap: ChildLevelCategoryMap = new Map();
    const level3CategoriesMap: ChildLevelCategoryMap = new Map();
    cmsCategoriesMenu.forEach((category) => {
      level1CategoriesMap.set(category.id, {
        name: category.name,
        slug: category.slug,
      });
      category.children.forEach((childLevel2) => {
        level2CategoriesMap.set(childLevel2.id, {
          name: childLevel2.name,
          slug: childLevel2.slug,
          parentId: category.id,
        });
        childLevel2.children.forEach((childLevel3) => {
          level3CategoriesMap.set(childLevel3.id, {
            name: childLevel3.name,
            slug: childLevel3.slug,
            parentId: childLevel2.id,
          });
        });
      });
    });

    return {
      level1CategoriesMap,
      level2CategoriesMap,
      level3CategoriesMap,
    };

    //console.table(level1CategoriesMap);
    console.table(level2CategoriesMap);
    //console.table(level2CategoriesMap);
    /*console.log('Se ha actualizado el menu de categorias.');
    return null;*/
  }
}
