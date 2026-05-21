import { queryOptions } from "@tanstack/react-query";
import { api } from "~/lib/api";
import type { Order } from "~/types";

export const orderKeys = {
  all: ["orders"] as const,
  list: () => ["orders", "list"] as const,
  my: () => ["orders", "my"] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};

// Admin: all orders (returns plain array)
export const ordersQuery = queryOptions({
  queryKey: orderKeys.list(),
  queryFn: () => api.get<Order[]>("/api/orders"),
});

// Customer: own orders
export const myOrdersQuery = queryOptions({
  queryKey: orderKeys.my(),
  queryFn: () => api.get<Order[]>("/api/orders/my"),
});

export const orderDetailQuery = (id: string) =>
  queryOptions({
    queryKey: orderKeys.detail(id),
    queryFn: () => api.get<Order>(`/api/orders/${id}`),
    enabled: !!id,
  });
