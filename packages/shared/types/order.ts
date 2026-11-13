export interface Order {
  id: string;
  number: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  subtotal: number;
  shipping: number;
  total: number;
  payment_intent: string;
  tracking_number: string;
  status: "pending" | "paid" | "packed" | "shipped" | "delivered" | "cancelled";
  version: number;
  created_at: string;
  updated_at: string;
  archived_at?: string | null;
}
