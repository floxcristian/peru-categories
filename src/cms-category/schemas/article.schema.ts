import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type ArticleDocument = ArticleEntity & Document;

@Schema({ collection: 'articles' })
export class ArticleEntity {
    @Prop({ type: SchemaTypes.ObjectId })
    _id: Types.ObjectId;
    @Prop()
    sku: string;
    @Prop()
    name: string;
    @Prop()
    category: string;
    @Prop()
    status: string;
    @Prop()
    manufacturer: string;
    @Prop()
    line: string;
    @Prop()
    brand: string;
    @Prop()
    sbu: string;
    @Prop()
    description: string;
    @Prop({ type: SchemaTypes.Mixed })
    images: {
        '150': string[];
        '250': string[];
        '450': string[];
        '600': string[];
        '1000': string[];
        '2000': string[];
    };
    @Prop()
    categories: [
        {
        id: number;
        slug: string;
        level: number;
        parentId: number | null;
        url: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        },
    ];
    @Prop()
    popularity: number;
    @Prop()
    visible: number;
    @Prop()
    assortment: number;
    @Prop()
    dropshipmentType: string;
    @Prop()
    dropshipment: number;
    @Prop()
    attributes: [
        {
        name: string;
        value: string;
        },
    ];
    @Prop()
    filters: [
        {
        name: string;
        value: string;
        order: number;
        },
    ];
    @Prop()
    promotionDetails: [
        {
        promotionId: string;
        name: string;
        type: string;
        validTo: string;
        skus: string[];
        },
    ];
    @Prop()
    synonyms: string[];
    @Prop()
    minimumPrice: number;
    @Prop()
    partNumber: string;
    @Prop()
    lineBossId: string;
    @Prop()
    salesQuantity: number;
    @Prop()
    price: number;
    @Prop()
    barcodesSearch: [
        {
        code: string;
        },
    ];
    @Prop()
    barcodes: [
        {
        code: string;
        },
    ];
    @Prop()
    score: number;
    @Prop()
    matrix: {
        sku: string;
    }[];
    @Prop()
    customerCodes: {
        code: string;
        documentId: string;
    }[];
    @Prop()
    tags: string[];
    @Prop()
    metaTags: {
        code: string;
        value: number | string;
    }[];
}

export const ArticleSchema = SchemaFactory.createForClass(ArticleEntity);
