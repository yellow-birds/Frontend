import { Link } from "react-router";
import { Trash2, ShoppingBag } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCartStore } from "~/store/cart.store";

export function meta() {
  return [{ title: "Cart — yellowbirds" }];
}

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice());

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center gap-4 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">Add some products to get started.</p>
        <Link to="/merchandise"><Button>Browse Merchandise</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-4 p-4 rounded-xl border bg-card">
              <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover border" />
              <div className="flex-1 flex flex-col gap-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.color} / {item.size}</p>
                <p className="text-sm font-medium">${item.unitPrice.toFixed(2)} each</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center border rounded-md">
                    <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="px-2 py-1 hover:bg-muted text-sm">−</button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="px-2 py-1 hover:bg-muted text-sm">+</button>
                  </div>
                  <button onClick={() => removeItem(item.variantId)} className="text-destructive hover:opacity-70 ml-auto">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right font-bold text-sm">
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card border rounded-xl p-6 h-fit space-y-4">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="block">
            <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
