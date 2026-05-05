import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/api";
import { productDetailQuery, productKeys } from "~/queries/products";

const variantSchema = z.object({
  id: z.string().optional(),
  color: z.string().min(1, "Required"),
  colorHex: z.string().min(4, "Required"),
  size: z.string().min(1, "Required"),
  stock: z.coerce.number().min(0),
  price: z.coerce.number().min(0.01),
});

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(1),
  tags: z.string(),
  basePrice: z.coerce.number().min(0.01),
  variants: z.array(variantSchema).min(1),
});

type ProductForm = z.infer<typeof schema>;

export function meta() {
  return [{ title: "Edit Product — yellowbirds Admin" }];
}

export default function AdminProductsEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: product, isLoading } = useQuery(productDetailQuery(id!));

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        slug: product.slug,
        description: product.description,
        category: product.category,
        tags: product.tags.join(", "),
        basePrice: product.basePrice,
        variants: product.variants,
      });
    }
  }, [product, reset]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: ProductForm) =>
      api.put(`/products/${id}`, {
        ...data,
        tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      navigate("/admin/products");
    },
  });

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: () => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      navigate("/admin/products");
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-3xl">
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

      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-6">
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Basic Info</h2>
          {[
            { id: "name", label: "Product Name" },
            { id: "slug", label: "Slug" },
            { id: "category", label: "Category" },
            { id: "tags", label: "Tags (comma separated)" },
          ].map(({ id: fieldId, label }) => (
            <div key={fieldId}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                {...register(fieldId as keyof ProductForm)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors[fieldId as keyof ProductForm] && (
                <p className="text-xs text-destructive mt-1">
                  {(errors[fieldId as keyof ProductForm] as { message?: string })?.message}
                </p>
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea {...register("description")} rows={3} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Base Price ($)</label>
            <input {...register("basePrice")} type="number" step="0.01" className="w-40 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Variants</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ color: "", colorHex: "#000000", size: "", stock: 0, price: 0 })}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          {fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 border rounded-lg bg-muted/20">
              <div><label className="block text-xs font-medium mb-1">Color</label><input {...register(`variants.${i}.color`)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" /></div>
              <div><label className="block text-xs font-medium mb-1">Hex</label><input {...register(`variants.${i}.colorHex`)} type="color" className="w-full h-9 rounded-md border bg-background px-1 py-1 cursor-pointer" /></div>
              <div><label className="block text-xs font-medium mb-1">Size</label><input {...register(`variants.${i}.size`)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" /></div>
              <div><label className="block text-xs font-medium mb-1">Stock</label><input {...register(`variants.${i}.stock`)} type="number" className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" /></div>
              <div className="flex gap-2 items-end">
                <div className="flex-1"><label className="block text-xs font-medium mb-1">Price</label><input {...register(`variants.${i}.price`)} type="number" step="0.01" className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" /></div>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(i)} className="text-destructive hover:opacity-70 pb-1.5"><Trash2 className="h-4 w-4" /></button>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-destructive">{(error as { message: string }).message}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
