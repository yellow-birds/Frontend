import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/api";
import type { Coupon } from "~/types";

const schema = z.object({
  code: z.string().min(3, "Min 3 chars").toUpperCase(),
  discountPercent: z.coerce.number().min(1).max(100),
  maxUses: z.coerce.number().min(1),
  expiresAt: z.string().min(1, "Required"),
});
type CouponForm = z.infer<typeof schema>;

export function meta() {
  return [{ title: "Discounts — yellowbirds Admin" }];
}

export default function AdminDiscountsPage() {
  const queryClient = useQueryClient();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: () => api.get<Coupon[]>("/admin/coupons"),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CouponForm>({
    resolver: zodResolver(schema),
  });

  const { mutate: createCoupon, isPending } = useMutation({
    mutationFn: (data: CouponForm) => api.post("/admin/coupons", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      reset();
    },
  });

  const { mutate: deleteCoupon } = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/coupons/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });

  const { mutate: toggleCoupon } = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      api.patch(`/admin/coupons/${id}`, { active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Discounts & Coupons</h1>

      {/* Create form */}
      <div className="bg-card border rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-4">Create Coupon</h2>
        <form onSubmit={handleSubmit((d) => createCoupon(d))} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-1">
            <label className="block text-xs font-medium mb-1">Code</label>
            <input {...register("code")} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring uppercase" placeholder="SAVE20" />
            {errors.code && <p className="text-xs text-destructive mt-1">{errors.code.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Discount %</label>
            <input {...register("discountPercent")} type="number" min={1} max={100} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            {errors.discountPercent && <p className="text-xs text-destructive mt-1">{errors.discountPercent.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Max Uses</label>
            <input {...register("maxUses")} type="number" min={1} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Expires</label>
            <input {...register("expiresAt")} type="date" className="w-full rounded-md border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="sm:col-span-4">
            <Button type="submit" disabled={isPending} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
              <Plus className="h-4 w-4 mr-1" /> {isPending ? "Creating..." : "Create Coupon"}
            </Button>
          </div>
        </form>
      </div>

      {/* Coupons list */}
      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Code</th>
                <th className="text-left px-4 py-3 font-medium">Discount</th>
                <th className="text-left px-4 py-3 font-medium">Uses</th>
                <th className="text-left px-4 py-3 font-medium">Expires</th>
                <th className="text-left px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {coupons?.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                  <td className="px-4 py-3">{c.discountPercent}%</td>
                  <td className="px-4 py-3">{c.usedCount} / {c.maxUses}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(c.expiresAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleCoupon({ id: c.id, active: !c.active })}
                      className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${c.active ? "bg-green-500" : "bg-muted"}`}
                    >
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow mt-0.5 transition-transform ${c.active ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteCoupon(c.id)} className="text-destructive hover:opacity-70">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
