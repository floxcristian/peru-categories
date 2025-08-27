import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SkuCategoryEntity } from '../schemas/sku-category.schema';

@Injectable()
export class SkuCategoryDao {
    constructor(
        @InjectModel(SkuCategoryEntity.name)
        private skuCategoryEntityModel: Model<SkuCategoryEntity>,
    ) {}

    async getAll(): Promise<SkuCategoryEntity[]> {
        return this.skuCategoryEntityModel.find().lean();
    }

    async replaceAll(skuCategory:Partial<SkuCategoryEntity>[]){
        await this.skuCategoryEntityModel.deleteMany({});
        return this.skuCategoryEntityModel.insertMany(skuCategory);
    }

}
