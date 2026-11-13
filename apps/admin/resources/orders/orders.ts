import { defineResource } from "@/lib/resource";
import { CreateOrderSchema } from "@repo/shared/schemas";
import custom from "./orders.custom";

export const orderResource = defineResource({
  name: "Order",
  slug: "orders",
  endpoint: "/api/orders",
  icon: "ShoppingCart",
  label: { singular: "Order", plural: "Orders" },
  table: {
    columns: [
      // grit:cols:auto-start
      { key: "number", label: "Number", sortable: true, searchable: true, onClick: "link" },
      { key: "customer_name", label: "Customer Name", sortable: true, searchable: true },
      { key: "customer_email", label: "Customer Email", sortable: true, searchable: true },
      { key: "shipping_address", label: "Shipping Address", searchable: true },
      { key: "subtotal", label: "Subtotal", sortable: true },
      { key: "shipping", label: "Shipping", sortable: true },
      { key: "total", label: "Total", sortable: true },
      { key: "payment_intent", label: "Payment Intent", sortable: true, searchable: true },
      { key: "tracking_number", label: "Tracking Number", sortable: true, searchable: true },
      { key: "status", label: "Status" },
      { key: "created_at", label: "Created", sortable: true, format: "relative" },
      // grit:cols:auto-end
    ],
    filters: [
    ],
    defaultSort: { key: "created_at", direction: "desc" },
    searchable: true,
    pageSize: 20,
    // Shown once rows are ticked. Drop "archive" here and the Archived tab
    // goes with it; the model keeps its archived_at either way.
    bulkActions: ["edit", "archive", "restore", "export", "delete"],
  },
  form: {
    // The same schema the API validates the request against, so the form and
    // the server agree about what is required rather than agreeing by
    // coincidence because one generator wrote both sets of rules (grit#145).
    //
    // It is ANDed with the per-field rules below, not instead of them: those
    // know a rating's max and whether a conditional field is even visible,
    // and this knows a refinement that reads a sibling field.
    //
    // Remove it and the form falls back to the field rules alone, which is
    // what every form did before v3.475.0.
    schema: CreateOrderSchema,
    fields: [
      // grit:fields:auto-start
    { key: "number", label: "Number", type: "text" },
    { key: "customer_name", label: "Customer Name", type: "text" },
    { key: "customer_email", label: "Customer Email", type: "text" },
    { key: "shipping_address", label: "Shipping Address", type: "textarea" },
    { key: "subtotal", label: "Subtotal", type: "number", numberKind: "float" },
    { key: "shipping", label: "Shipping", type: "number", numberKind: "float" },
    { key: "total", label: "Total", type: "number", numberKind: "float" },
    { key: "payment_intent", label: "Payment Intent", type: "text" },
    { key: "tracking_number", label: "Tracking Number", type: "text" },
    { key: "status", label: "Status", type: "select", options: [{ value: "pending", label: "Pending payment" }, { value: "paid", label: "Paid" }, { value: "packed", label: "Packed" }, { value: "shipped", label: "Shipped" }, { value: "delivered", label: "Delivered" }, { value: "cancelled", label: "Cancelled" }] },
      // grit:fields:auto-end
    ],
  },
  dashboard: {
    widgets: [
      {
        type: "stat",
        label: "Total Orders",
        endpoint: "/api/orders",
        icon: "ShoppingCart",
        color: "accent",
      },
    ],
  },
  // One card per value, counted over the rows the table is showing. Generated
  // from the model: status. Delete a line to drop its cards, or set
  // stats: { countBy: [] } to keep only the four defaults.
  stats: {
    countBy: [
      {
        field: "status",
        label: "Status",
        labels: { "pending": "Pending payment", "paid": "Paid", "packed": "Packed", "shipped": "Shipped", "delivered": "Delivered", "cancelled": "Cancelled" },
        only: ["pending", "paid", "packed", "shipped", "delivered", "cancelled"],
      },
    ],
  },
  // The collapsible charts above the table: created over time, and these
  // columns by value. Nothing is requested until somebody opens the panel.
  insights: {
    breakdown: ["status"],
    labels: {
      status: { "pending": "Pending payment", "paid": "Paid", "packed": "Packed", "shipped": "Shipped", "delivered": "Delivered", "cancelled": "Cancelled" },
    },
  },
}, custom);
