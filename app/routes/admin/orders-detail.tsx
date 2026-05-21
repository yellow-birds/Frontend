import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { orderDetailQuery, orderKeys } from "~/queries/orders";
import { api } from "~/lib/api";
import type { OrderStatus } from "~/types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING:    "bg-yellow-100 text-yellow-800",
  CONFIRMED:  "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED:    "bg-indigo-100 text-indigo-800",
  DELIVERED:  "bg-green-100 text-green-800",
  CANCELLED:  "bg-red-100 text-red-800",
};

const ALL_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function meta() {
  return [{ title: "Order Detail — yellowbirds Admin" }];
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useQuery(orderDetailQuery(id!));

  const { mutate: updateStatus } = useMutation({
    mutationFn: (status: OrderStatus) =>
      api.patch(`/api/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id!) });
    },
  });

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
        <select
          value={order.status}
          onChange={(e) => updateStatus(e.target.value as OrderStatus)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${STATUS_COLORS[order.status]}`}
        >
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {/* Customer info */}
        <div className="bg-card border rounded-xl p-5 text-sm space-y-1.5">
          <h2 className="font-semibold mb-2">Customer</h2>
          <p><span className="text-muted-foreground">Name: </span>{order.customerFirstName} {order.customerLastName}</p>
          <p><span className="text-muted-foreground">Email: </span>{order.customerEmail}</p>
          {order.customerNotes && (
            <p><span className="text-muted-foreground">Notes: </span>{order.customerNotes}</p>
          )}
        </div>

        {/* Order items */}
        <div className="bg-card border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold">Items</h2>
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="h-12 w-12 rounded-lg border bg-gray-50 overflow-hidden shrink-0">
                {item.mainImageUrl ? (
                  <img src={item.mainImageUrl} alt={item.productName} className="h-full w-full object-contain p-1" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-lg">🐦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.productCode}{item.size ? ` · ${item.size}` : ""}{item.productColor ? ` · ${item.productColor}` : ""} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold shrink-0">${item.subtotal.toFixed(2)}</p>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>${order.totalAmount?.toFixed(2) ?? "—"}</span>
          </div>
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
        </div>
      </div>
    </div>
  );
}
