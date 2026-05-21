import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Eye, Bell } from "lucide-react";
import { ordersQuery, orderKeys } from "~/queries/orders";
import { api } from "~/lib/api";
import type { Order, OrderStatus } from "~/types";

export function meta() {
  return [{ title: "Orders — yellowbirds Admin" }];
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING:    "bg-yellow-100 text-yellow-800",
  CONFIRMED:  "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED:    "bg-indigo-100 text-indigo-800",
  DELIVERED:  "bg-green-100 text-green-800",
  CANCELLED:  "bg-red-100 text-red-800",
};

const ALL_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery(ordersQuery);

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      api.patch(`/api/orders/${orderId}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });

  const pendingOrders = orders.filter((o: Order) => o.status === "PENDING");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        {pendingOrders.length > 0 && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-xl animate-pulse">
            <Bell className="h-4 w-4" />
            {pendingOrders.length} pending order{pendingOrders.length !== 1 ? "s" : ""} waiting for confirmation
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-muted-foreground" /></div>
      ) : orders.length === 0 ? (
        <div className="bg-card border rounded-xl p-16 text-center text-muted-foreground">
          No orders yet.
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Order ID</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Items</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order: Order) => (
                <tr
                  key={order.id}
                  className={`hover:bg-muted/20 transition-colors ${order.status === "PENDING" ? "bg-yellow-50/50" : ""}`}
                >
                  <td className="px-4 py-3 font-mono text-xs font-bold">
                    #{order.id.slice(0, 8).toUpperCase()}
                    {order.status === "PENDING" && (
                      <span className="ml-2 inline-block h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-xs">{order.customerFirstName} {order.customerLastName}</p>
                    <p className="text-muted-foreground text-[11px]">{order.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus({ orderId: order.id, status: e.target.value as OrderStatus })}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${STATUS_COLORS[order.status]}`}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
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
