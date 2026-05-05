import { queryOptions } from "@tanstack/react-query";
import { api } from "~/lib/api";
import type { Order, PaginatedResponse } from "~/types";

export const orderKeys = {
  all: ["orders"] as const,
  list: (page: number) => ["orders", "list", page] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};

export const ordersQuery = (page = 0) =>
  queryOptions({
    queryKey: orderKeys.list(page),
    queryFn: () =>
      api.get<PaginatedResponse<Order>>("/orders", { page, size: 20 }),
  });

export const orderDetailQuery = (id: string) =>
  queryOptions({
    queryKey: orderKeys.detail(id),
    queryFn: () => api.get<Order>(`/orders/${id}`),
    enabled: !!id,
  });
