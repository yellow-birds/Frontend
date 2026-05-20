import { queryOptions } from "@tanstack/react-query";
import { api } from "~/lib/api";

export interface ProductResponse {
  id: string;
  name: string;
  code: string;
  salePrice: number;
  availableSizes: string[];
  productColor: string;
  mainImageUrl: string;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchProductsParams {
  q?: string;
  categoryId?: string;
  color?: string;
  page?: number;
  hitsPerPage?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface SearchResultPaginated {
  totalHits: number;
  hitsPerPage: number;
  page: number;
  totalPages: number;
  hits: ProductResponse[];
}

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const productKeys = {
  all: ["products"] as const,
  list: () => ["products", "list"] as const,
  search: (params: SearchProductsParams) => ["products", "search", params] as const,
  detail: (id: string) => ["products", "detail", id] as const,
};

// ─── Query Options ────────────────────────────────────────────────────────────

// Simple full list — used by admin
export const productsQuery = queryOptions({
  queryKey: productKeys.list(),
  queryFn: () => api.get<ProductResponse[]>("/api/products"),
});

// Filtered search — used by storefront
export const searchProductsQuery = (params: SearchProductsParams) =>
  queryOptions({
    queryKey: productKeys.search(params),
    queryFn: () =>
      api.get<SearchResultPaginated>("/api/search/products", {
        q: params.q ?? "",
        categoryId: params.categoryId,
        color: params.color,
        page: params.page ?? 1,
        hitsPerPage: params.hitsPerPage ?? 20,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
      }),
  });

export const productDetailQuery = (id: string) =>
  queryOptions({
    queryKey: productKeys.detail(id),
    queryFn: () => api.get<ProductResponse>(`/api/products/${id}`),
    enabled: !!id,
  });
