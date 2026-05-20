import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ImageUpload } from "~/components/ui/image-upload";
import { api } from "~/lib/api";
import { productKeys } from "~/queries/products";
import { categoriesQuery } from "~/queries/categories";

const SIZES = ["XS", "S", "MD", "L", "XL", "XXL", "XXXL"] as const;

interface ProductResponse {
  id: string;
  name: string;
  code: string;
  salePrice: number;
  productColor: string;
  availableSizes: string[];
  mainImageUrl: string;
  categoryId: string;
  categoryName: string;
}

const schema = z.object({
  name: z.string().min(1, "Required"),
  code: z.string().min(1, "Required"),
  salePrice: z.coerce.number().min(0, "Required"),
  productColor: z.string().regex(/^#([A-Fa-f0-9]{6})$/, "Must be a hex color e.g. #FF5733"),
  availableSizes: z.array(z.string()).min(1, "Select at least one size"),
  mainImageUrl: z.string().optional(),
  categoryId: z.string().min(1, "Select a category"),
});

type ProductForm = z.infer<typeof schema>;

export function meta() {
  return [{ title: "Edit Product — yellowbirds Admin" }];
}

export default function AdminProductsEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => api.get<ProductResponse>(`/api/products/${id}`),
    enabled: !!id,
  });

  const { data: categories = [] } = useQuery(categoriesQuery);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(schema),
    defaultValues: { availableSizes: [] },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        code: product.code,
        salePrice: product.salePrice,
        productColor: product.productColor,
        availableSizes: product.availableSizes ?? [],
        mainImageUrl: product.mainImageUrl ?? "",
        categoryId: product.categoryId,
      });
    }
  }, [product, reset]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: ProductForm) => {
      const payload: Record<string, unknown> = {
        name: data.name,
        code: data.code,
        salePrice: data.salePrice,
        productColor: data.productColor,
        availableSizes: data.availableSizes,
        categoryId: data.categoryId,
      };
      const imgUrl = data.mainImageUrl?.trim();
      if (imgUrl && imgUrl.startsWith("http")) payload.mainImageUrl = imgUrl;
      return api.put(`/api/products/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      navigate("/admin/products");
    },
  });

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: () => api.delete(`/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      navigate("/admin/products");
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <Button
          variant="destructive"
          size="sm"
          disabled={isDeleting}
          onClick={() => { if (confirm("Delete this product?")) deleteProduct(); }}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>

      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-5">

        {/* Image */}
        <div className="bg-card border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-sm">Product Image</h2>
          <Controller
            control={control}
            name="mainImageUrl"
            render={({ field }) => (
              <ImageUpload value={field.value ?? ""} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm">Basic Info</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                {...register("name")}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Code / SKU</label>
              <input
                {...register("code")}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.code && <p className="text-xs text-destructive mt-1">{errors.code.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sale Price</label>
              <input
                {...register("salePrice")}
                type="number"
                step="0.01"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.salePrice && <p className="text-xs text-destructive mt-1">{errors.salePrice.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Product Color</label>
              <Controller
                control={control}
                name="productColor"
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={field.value || "#000000"}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="h-10 w-14 rounded-lg border cursor-pointer bg-background p-1"
                    />
                    <input
                      type="text"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="#FF5733"
                      className="flex-1 rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                )}
              />
              {errors.productColor && <p className="text-xs text-destructive mt-1">{errors.productColor.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              {...register("categoryId")}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">— Select a category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-destructive mt-1">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Available Sizes</label>
            <Controller
              control={control}
              name="availableSizes"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => {
                    const checked = field.value.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            checked
                              ? field.value.filter((s) => s !== size)
                              : [...field.value, size]
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                          checked
                            ? "bg-yellow-400 border-yellow-400 text-black"
                            : "border-gray-200 text-gray-600 hover:border-yellow-400"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.availableSizes && <p className="text-xs text-destructive mt-1">{errors.availableSizes.message}</p>}
          </div>

        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {(error as { message: string }).message}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending} className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
