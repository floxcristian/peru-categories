import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class CmsCategoryLevel3MenuEntity {
  @Prop({ type: Number, required: true })
  id: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  slug: string;
}

export class CmsCategoryLevel2MenuEntity {
  @Prop({ type: Number, required: true })
  id: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  slug: string;

  @Prop()
  children: CmsCategoryLevel2MenuEntity[];
}

@Schema({ collection: 'cms_categories_menu' })
export class CmsCategoryMenuEntity extends Document {
  @Prop({ type: Number, required: true })
  id: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  slug: string;

  @Prop()
  children: CmsCategoryLevel2MenuEntity[];
}

export const CmsCategoryMenuSchema = SchemaFactory.createForClass(
  CmsCategoryMenuEntity,
);
