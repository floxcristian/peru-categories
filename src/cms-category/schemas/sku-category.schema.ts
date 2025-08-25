import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Category {
    @Prop({ type: String, required: true })
    _id: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    slug: string;

    @Prop({ type: Number, required: true })
    level: number;
}


@Schema({ collection: 'sku_categories', timestamps: true })
export class SkuCategoryEntity extends Document {

    @Prop({ type: String, required: true })
    sku: string;

    @Prop({ type: Category, required: true })
    categories: Category[];

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const SkuCategorySchema =
    SchemaFactory.createForClass(SkuCategoryEntity);
