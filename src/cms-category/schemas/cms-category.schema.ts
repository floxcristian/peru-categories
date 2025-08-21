import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'cms_categories_cristian', timestamps: true })
export class CmsCategoryEntity extends Document {
  @Prop({ type: Number, required: true })
  id: number;

  @Prop({ type: Number, required: true })
  level: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  slug: string;

  @Prop({ type: Number, required: false, default: null })
  parentId: number | null;
}

export const CmsCategorySchema =
  SchemaFactory.createForClass(CmsCategoryEntity);
