import { queryOptions } from "@tanstack/react-query";
import { api } from "~/lib/api";

export interface CategoryResponse {
  id: string;
  name: string;
  code: string;
  imageUrl?: string;
}

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: () => api.get<CategoryResponse[]>("/api/categories"),
});
