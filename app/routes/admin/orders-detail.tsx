import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { orderDetailQuery } from "~/queries/orders";
import type { OrderStatus } from "~/types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function meta() {
  return [{ title: "Order Detail — yellowbirds Admin" }];
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery(orderDetailQuery(id!));

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-muted-foreground" /></div>;
  }

  if (!order) return <div className="py-16 text-center">Order not found.</div>;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>{order.status}</span>
      </div>

      <div className="space-y-4">
        {/* Order items */}
        <div className="bg-card border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold">Items</h2>
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover border" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.color} / {item.size} × {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-3">Shipping Address</h2>
          <address className="text-sm text-muted-foreground not-italic space-y-0.5">
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </address>
        </div>

        {/* Metadata */}
        <div className="bg-card border rounded-xl p-5 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Placed</span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last updated</span>
            <span>{new Date(order.updatedAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-mono text-xs">{order.userId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
