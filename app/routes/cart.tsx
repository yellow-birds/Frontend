import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, ShoppingBag, Minus, Plus, Loader2 } from "lucide-react";
import { useCartStore } from "~/store/cart.store";
import { useAuthStore } from "~/store/auth.store";
import { api } from "~/lib/api";

const WA_NUMBER = "905350297167";

export function meta() {
  return [{ title: "Cart — yellowbirds" }];
}

function buildWhatsAppMessage(
  items: ReturnType<typeof useCartStore.getState>["items"],
  orderId: string
) {
  const lines = items.map(
    (item) =>
      `• *${item.name}*${item.size ? ` (Size: ${item.size})` : ""}${item.color ? `, Color: ${item.color}` : ""} × ${item.quantity}`
  );
  const msg = [
    `Hi! I just placed order *#${orderId.slice(0, 8).toUpperCase()}* on yellowbirds 🐦`,
    "",
    ...lines,
    "",
    "Please confirm pricing and delivery details. Thank you!",
  ].join("\n");
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  async function handlePlaceOrder() {
    if (!user) {
      toast.info("Please log in to place an order", {
        action: { label: "Login", onClick: () => navigate("/login") },
      });
      return;
    }

    setPlacing(true);
    try {
      const order = await api.post<{ id: string }>("/api/orders", {
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size || null,
          quantity: i.quantity,
        })),
        customerNotes: null,
      });

      window.open(buildWhatsAppMessage(items, order.id), "_blank", "noopener,noreferrer");

      clearCart();
      navigate("/orders");
      toast.success("Order placed — waiting for confirmation", {
        description: `Order #${order.id.slice(0, 8).toUpperCase()} is pending. Our team will confirm via WhatsApp.`,
        duration: 7000,
      });
    } catch (err: unknown) {
      const e = err as { message?: string; status?: number };
      console.error("[Place Order error]", e);
      toast.error(`Error ${e.status ?? ""}: ${e.message ?? "Something went wrong"}`, {
        description: "Check the browser console and Spring Boot logs for details.",
        duration: 8000,
      });
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 flex flex-col items-center gap-4 text-center">
        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
          <ShoppingBag className="h-10 w-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Your cart is empty</h1>
        <p className="text-gray-500">Add some products to get started.</p>
        <Link
          to="/merchandise"
          className="mt-2 inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Browse Merchandise
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Your Cart</h1>
        <button
          onClick={() => clearCart()}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-4 p-4 rounded-2xl border border-gray-200 bg-white hover:border-yellow-300 transition-colors">
              {/* Image */}
              <div className="h-20 w-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-2xl">🐦</div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.color && (
                    <span className="h-3.5 w-3.5 rounded-full border border-gray-200 shrink-0" style={{ backgroundColor: item.color }} />
                  )}
                  <p className="text-xs text-gray-500">{[item.size, item.color].filter(Boolean).join(" · ")}</p>
                </div>
                <p className="text-xs text-yellow-600 font-semibold mt-1">Price confirmed on WhatsApp</p>

                {/* Qty controls */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="px-2.5 py-1 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 py-1 text-sm font-bold border-x border-gray-200 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="px-2.5 py-1 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-gray-300 hover:text-red-400 transition-colors ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Qty badge */}
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">× {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-extrabold text-gray-900 text-lg mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price</span>
                <span className="font-semibold text-yellow-600">Confirmed on WhatsApp</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl font-extrabold text-base text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#25D366" }}
              onMouseOver={e => { if (!placing) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#20b858"; }}
              onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#25D366"; }}
            >
              {placing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              )}
              {placing ? "Placing Order…" : "Place Order via WhatsApp"}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Order saved as <span className="font-semibold text-yellow-600">Pending</span> — WhatsApp opens to confirm pricing &amp; delivery.
            </p>
          </div>

          <Link
            to="/merchandise"
            className="block text-center text-sm font-semibold text-gray-500 hover:text-yellow-600 transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
