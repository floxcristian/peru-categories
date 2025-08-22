import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

const generateShortId = () => nanoid(8);

@Schema({ collection: 'cms_categories_peru', timestamps: true })
export class CmsCategoryEntity extends Document {
  @Prop({
    type: String,
    required: true,
    default: generateShortId,
    index: true,
    unique: true,
  })
  id: string;

  @Prop({ type: Number, required: true })
  level: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  slug: string;

  @Prop({ type: Number, required: false, default: 0 })
  order: number;

  @Prop({ type: String, required: false, default: null })
  parentId: string | null;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CmsCategorySchema =
  SchemaFactory.createForClass(CmsCategoryEntity);
