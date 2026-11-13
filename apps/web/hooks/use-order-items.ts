import type { OrderItem } from "@repo/shared/types";
import type { CreateOrderItemInput, UpdateOrderItemInput } from "@repo/shared/schemas";
import { resourceHooks } from "./use-resource";

// React Query hooks for order_items.
//
// The bodies live in ./use-resource.ts, so a fix to the hook shape, a new
// query parameter or a change to how the cache is invalidated reaches every
// resource in this project at once. Edit this file to change what THIS
// resource does; edit use-resource.ts to change what they all do.
const order_items = resourceHooks<OrderItem, CreateOrderItemInput, UpdateOrderItemInput>(
  "order_items",
  "/api/order_items",
);

export const useOrderItems = order_items.useList;
export const useGetOrderItem = order_items.useOne;
export const useCreateOrderItem = order_items.useCreate;
export const useUpdateOrderItem = order_items.useUpdate;
export const useDeleteOrderItem = order_items.useRemove;

/** The cache keys, for an invalidation this file does not already do. */
export const orderItemKeys = order_items.keys;
