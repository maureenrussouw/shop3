"use client";

import { ResourcePage } from "@/components/resource/resource-page";
import { orderItemResource } from "@/resources/order-items/order-items";

export default function OrderItemsPage() {
  return <ResourcePage resource={orderItemResource} />;
}
