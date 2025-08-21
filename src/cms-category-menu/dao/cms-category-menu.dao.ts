import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CmsCategoryMenuEntity } from '../schemas/cms-category-menu.schema';
import { CmsCategoryEntity } from 'src/cms-category/schemas/cms-category.schema';

@Injectable()
export class CmsCategoryMenuDao {
  constructor(
    @InjectModel(CmsCategoryMenuEntity.name)
    private cmsCategoryMenuEntityModel: Model<CmsCategoryMenuEntity>,
    @InjectModel(CmsCategoryEntity.name)
    private cmsCategoryEntityModel: Model<CmsCategoryEntity>,
  ) {}

  async getAll(): Promise<Omit<CmsCategoryMenuEntity, '_id'>[]> {
    return this.cmsCategoryMenuEntityModel.find({}, { _id: 0 }).lean();
  }

  /**
   * Reemplazar todas las categorias.
   * @param categories - Categorias a reemplazar.
   * @returns
   */
  /*async replaceAll(categories: CmsCategoryMenuEntity[]) {
    await this.cmsCategoryMenuEntityModel.deleteMany({});
    return this.cmsCategoryMenuEntityModel.insertMany(categories);
  }*/

  /**
   * Obtiene el mapa de categorías y actualiza la colección de menú directamente
   * - No hay validaciones ni nada.
   * - Se recomienda otro método que valide la colección de origen antes de actualizar la colección de destino.
   * - Por ejemplo:
   *   - Que tenga al menos una categoría de nivel 1.
   *   - Que todas las categorías de nivel 1 tengan al menos una categoría de nivel 2.
   *   - Que todas las categorías de nivel 2 tengan al menos una categoría de nivel 3.
   * @param outputCollection Nombre de la colección donde se guardarán los resultados
   */
  async replaceAll(outputCollection = 'cms_categories_menu_cristian') {
    return this.cmsCategoryEntityModel
      .aggregate([
        {
          $match: {
            level: 1,
            parentId: null,
          },
        },
        {
          $lookup: {
            from: 'cms_categories_cristian',
            let: { level1Id: '$id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$level', 2] },
                      { $eq: ['$parentId', '$$level1Id'] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: 'cms_categories_cristian',
                  let: { level2Id: '$id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ['$level', 3] },
                            { $eq: ['$parentId', '$$level2Id'] },
                          ],
                        },
                      },
                    },
                  ],
                  as: 'children',
                },
              },
            ],
            as: 'children',
          },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            name: 1,
            slug: 1,
            children: {
              $map: {
                input: '$children',
                as: 'level2',
                in: {
                  id: '$$level2.id',
                  name: '$$level2.name',
                  slug: '$$level2.slug',
                  children: {
                    $map: {
                      input: '$$level2.children',
                      as: 'level3',
                      in: {
                        id: '$$level3.id',
                        name: '$$level3.name',
                        slug: '$$level3.slug',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          // Esta etapa reemplazará toda la colección de destino con los resultados de la agregación
          $out: outputCollection,
        },
      ])
      .exec();
  }
}
