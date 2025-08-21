import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'articles', timestamps: true })
export class ArticleEntity extends Document {
  @Prop({ type: String, required: true })
  sku: string;

  /*@Prop({ type: String, required: false, default: null })
  categoria: string;

  @Prop({ type: String })
  cod_id_proveedor: string;

  @Prop({ type: Number })
  costo_cero: number;

  @Prop({ type: Number })
  costo_financiero: Number;

  @Prop({ type: String })
  estado: string;

  @Prop({ type: String })
  fabricante: string;

  @Prop({ type: Number })
  id_categoria: number;

  @Prop({ type: Number })
  id_linea: number;

  @Prop({ type: String })
  id_marca: string;

  @Prop({ type: String })
  sku_matriz: string;

  @Prop({ type: String })
  linea: string;

  @Prop({ type: String })
  marca: string;

  @Prop({ type: String })
  nombre: string;

  @Prop({ type: String })
  numero_parte: string;

  @Prop({ type: String })
  p_minimo: string;

  @Prop({ type: Number })
  product: number;

  @Prop({ type: String })
  uen: string;

  @Prop({ type: String })
  unit_id: string;

  @Prop({ type: String })
  fullText: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number })
  image_recid: number;

  @Prop({ type: Boolean })
  precio_escala: boolean;

  @Prop({ type: Boolean })
  transformado: boolean;

  @Prop({ type: Number })
  peso: number;

  @Prop({ type: Number })
  alto: number;

  @Prop({ type: Number })
  ancho: number;

  @Prop({ type: Number })
  largo: number;

  @Prop({ type: Array, default: [] })
  images: any[];*/

  @Prop()
  categories: CategoryEntity[];

  //codigos:
}

class CategoryEntity {
  @Prop({ type: String })
  slug: string;

  @Prop({ type: Number })
  level: number;

  /*@Prop({ type: Number, required: false, default: null })
  parent_id: number | null;*/

  /*@Prop({ type: String })
  url: string;*/

  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  id: number;
}

export const ArticleSchema = SchemaFactory.createForClass(ArticleEntity);
