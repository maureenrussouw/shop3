import type { Category } from "./category";
import type { FileRef } from "../schemas/file-ref";

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  compare_at_price: number;
  stock: number;
  images: FileRef[];
  category_id: string;
  category?: Category;
  active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  archived_at?: string | null;
}
