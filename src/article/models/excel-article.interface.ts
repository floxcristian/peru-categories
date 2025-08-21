export interface ExcelArticle {
  sku: string;
  categories: ExcelCategoryArticle[];
}

export interface ExcelCategoryArticle {
  level: number;
  id: number;
  name: string;
  slug: string;
  /*parent_id: number | null;
  url: string;*/
}
