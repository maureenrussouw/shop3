"use client";

import { use } from "react";
import { ResourceDetailPage } from "@/components/resource/resource-detail-page";
import { orderItemResource } from "@/resources/order-items/order-items";

export default function OrderItemsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ResourceDetailPage resource={orderItemResource} id={id} />;
}
