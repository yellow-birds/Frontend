import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { ImageUpload } from "~/components/ui/image-upload";
import { api } from "~/lib/api";
import { productKeys } from "~/queries/products";
import { categoriesQuery } from "~/queries/categories";

const SIZES = ["XS", "S", "MD", "L", "XL", "XXL", "XXXL"] as const;

const schema = z.object({
  name: z.string().min(1, "Required"),
  code: z.string().min(1, "Required"),
  salePrice: z.coerce.number().min(0.01, "Required"),
  productColor: z.string().regex(/^#([A-Fa-f0-9]{6})$/, "Must be a hex color e.g. #FF5733"),
  availableSizes: z.array(z.string()).min(1, "Select at least one size"),
  mainImageUrl: z.string().optional(),
  categoryId: z.string().min(1, "Select a category"),
});

type ProductForm = z.infer<typeof schema>;

export function meta() {
  return [{ title: "New Product — yellowbirds Admin" }];
}

export default function AdminProductsNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading: loadingCats } = useQuery(categoriesQuery);

  const { register, control, handleSubmit, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(schema),
    defaultValues: { availableSizes: [], mainImageUrl: "" },
  });

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
      if (imgUrl && imgUrl.startsWith("http")) {
        payload.mainImageUrl = imgUrl;
      }
      return api.post("/api/products", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      navigate("/admin/products");
    },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

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

        {/* Basic info */}
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm">Basic Info</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Name</label>
              <input
                {...register("name")}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Code / SKU</label>
              <input
                {...register("code")}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {errors.code && <p className="text-xs text-destructive mt-1">{errors.code.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sale Price ($)</label>
              <input
                {...register("salePrice")}
                type="number"
                step="0.01"
                min="0"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {errors.salePrice && <p className="text-xs text-destructive mt-1">{errors.salePrice.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Color</label>
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
                      className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                )}
              />
              {errors.productColor && <p className="text-xs text-destructive mt-1">{errors.productColor.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
            <select
              {...register("categoryId")}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">
                {loadingCats ? "Loading categories..." : "— Select a category —"}
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-destructive mt-1">{errors.categoryId.message}</p>}
            {!loadingCats && categories.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">
                No categories found. <a href="/admin/categories" className="underline font-semibold">Create one first →</a>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Available Sizes</label>
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
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${
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
            {isPending ? "Saving..." : "Save Product"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
