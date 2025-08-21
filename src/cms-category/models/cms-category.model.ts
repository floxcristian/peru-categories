export interface CmsCategory {
  id: number;
  level: number;
  name: string;
  slug: string;
  parentId: number | null;
}
