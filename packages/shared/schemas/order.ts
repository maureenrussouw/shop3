import { z } from "zod";

export const OrderSchema = z.object({
  id: z.string(),
  number: z.string(),
  customer_name: z.string(),
  customer_email: z.string(),
  shipping_address: z.string(),
  subtotal: z.number(),
  shipping: z.number(),
  total: z.number(),
  payment_intent: z.string(),
  tracking_number: z.string(),
  status: z.enum(["pending", "paid", "packed", "shipped", "delivered", "cancelled"]),
  version: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
  archived_at: z.string().nullable().optional(),
});

export const CreateOrderSchema = z.object({
  number: z.string().optional(),
  customer_name: z.string().optional(),
  customer_email: z.string().optional(),
  shipping_address: z.string().optional(),
  subtotal: z.number().optional(),
  shipping: z.number().optional(),
  total: z.number().optional(),
  payment_intent: z.string().optional(),
  tracking_number: z.string().optional(),
  status: z.enum(["pending", "paid", "packed", "shipped", "delivered", "cancelled"]).optional(),
});

export const UpdateOrderSchema = z.object({
  number: z.string().optional(),
  customer_name: z.string().optional(),
  customer_email: z.string().optional(),
  shipping_address: z.string().optional(),
  subtotal: z.number().optional(),
  shipping: z.number().optional(),
  total: z.number().optional(),
  payment_intent: z.string().optional(),
  tracking_number: z.string().optional(),
  status: z.enum(["pending", "paid", "packed", "shipped", "delivered", "cancelled"]).optional(),
});

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
