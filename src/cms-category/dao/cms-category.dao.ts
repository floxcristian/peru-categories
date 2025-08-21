import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CmsCategoryEntity } from '../schemas/cms-category.schema';

@Injectable()
export class CmsCategoryDao {
  constructor(
    @InjectModel(CmsCategoryEntity.name)
    private cmsCategoryEntityModel: Model<CmsCategoryEntity>,
  ) {}

  async getAll(): Promise<CmsCategoryEntity[]> {
    return this.cmsCategoryEntityModel.find().lean();
  }

  /**
   * Reemplazar todas las categorias.
   * @param categories - Categorias a reemplazar.
   * @returns
   */
  async replaceAll(categories: Partial<CmsCategoryEntity>[]) {
    await this.cmsCategoryEntityModel.deleteMany({});
    return this.cmsCategoryEntityModel.insertMany(categories);
  }
}
