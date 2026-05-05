import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { useCartStore } from "~/store/cart.store";

const schema = z.object({
  fullName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  line1: z.string().min(3, "Required"),
  line2: z.string().optional(),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  country: z.string().min(1, "Required"),
  postalCode: z.string().min(3, "Required"),
});

type CheckoutForm = z.infer<typeof schema>;

export function meta() {
  return [{ title: "Checkout — yellowbirds" }];
}

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.totalPrice());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({ resolver: zodResolver(schema) });

  async function onSubmit(data: CheckoutForm) {
    // TODO: POST /orders with items + address when API is ready
    console.log("Order payload:", { items, shippingAddress: data });
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: "fullName", label: "Full Name", col: "sm:col-span-2" },
            { id: "email", label: "Email", col: "sm:col-span-2" },
            { id: "line1", label: "Address Line 1", col: "sm:col-span-2" },
            { id: "line2", label: "Address Line 2 (optional)", col: "sm:col-span-2" },
            { id: "city", label: "City" },
            { id: "state", label: "State / Province" },
            { id: "country", label: "Country" },
            { id: "postalCode", label: "Postal Code" },
          ].map(({ id, label, col }) => (
            <div key={id} className={col}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                {...register(id as keyof CheckoutForm)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors[id as keyof CheckoutForm] && (
                <p className="text-xs text-destructive mt-1">
                  {errors[id as keyof CheckoutForm]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-2">
          <h2 className="font-semibold">Order Total</h2>
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
              <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      </form>
    </div>
  );
}
