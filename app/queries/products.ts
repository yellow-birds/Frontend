import { queryOptions } from "@tanstack/react-query";
import { api } from "~/lib/api";
import type { PaginatedResponse, Product, ProductFilters } from "~/types";

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const productKeys = {
  all: ["products"] as const,
  list: (filters: ProductFilters) => ["products", "list", filters] as const,
  detail: (slug: string) => ["products", "detail", slug] as const,
};

// ─── Query Options ────────────────────────────────────────────────────────────

export const productsQuery = (filters: ProductFilters) =>
  queryOptions({
    queryKey: productKeys.list(filters),
    queryFn: () =>
      api.get<PaginatedResponse<Product>>("/products", {
        ...filters,
        colors: filters.colors?.join(","),
        tags: filters.tags?.join(","),
      }),
  });

export const productDetailQuery = (slug: string) =>
  queryOptions({
    queryKey: productKeys.detail(slug),
    queryFn: () => api.get<Product>(`/products/${slug}`),
    enabled: !!slug,
  });
