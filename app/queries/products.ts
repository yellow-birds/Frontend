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

// Filtered search — uses /api/products with client-side filtering/pagination
export const searchProductsQuery = (params: SearchProductsParams) =>
  queryOptions({
    queryKey: productKeys.search(params),
    queryFn: async (): Promise<SearchResultPaginated> => {
      const all = await api.get<ProductResponse[]>("/api/products");

      // Client-side filtering
      let hits = all;
      if (params.q) {
        const q = params.q.toLowerCase();
        hits = hits.filter((p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
      }
      if (params.categoryId) {
        hits = hits.filter((p) => p.categoryId === params.categoryId);
      }
      if (params.color) {
        hits = hits.filter((p) => p.productColor === params.color);
      }
      if (params.minPrice != null) {
        hits = hits.filter((p) => p.salePrice >= params.minPrice!);
      }
      if (params.maxPrice != null) {
        hits = hits.filter((p) => p.salePrice <= params.maxPrice!);
      }

      // Client-side pagination
      const page = params.page ?? 1;
      const hitsPerPage = params.hitsPerPage ?? 20;
      const totalHits = hits.length;
      const totalPages = Math.max(1, Math.ceil(totalHits / hitsPerPage));
      const start = (page - 1) * hitsPerPage;
      const paginated = hits.slice(start, start + hitsPerPage);

      return { totalHits, hitsPerPage, page, totalPages, hits: paginated };
    },
  });

export const productDetailQuery = (id: string) =>
  queryOptions({
    queryKey: productKeys.detail(id),
    queryFn: () => api.get<ProductResponse>(`/api/products/${id}`),
    enabled: !!id,
  });
