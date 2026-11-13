import type { Order } from "./order";
import type { Product } from "./product";

export interface OrderItem {
  id: string;
  product_id: string;
  product?: Product;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  order_id: string;
  order?: Order;
  version: number;
  created_at: string;
  updated_at: string;
  archived_at?: string | null;
}
