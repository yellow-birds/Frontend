import { Link, redirect, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "~/store/auth.store";
import { useEffect } from "react";
import { Package, ChevronRight, Loader2, ShoppingBag } from "lucide-react";
import { api } from "~/lib/api";
import type { Order } from "~/types";
import { getToken } from "~/lib/auth";

export function clientLoader() {
  if (!getToken()) throw redirect("/login");
  return null;
}

export function meta() {
  return [{ title: "My Orders — yellowbirds" }];
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  PENDING:    { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
  CONFIRMED:  { bg: "bg-blue-100",   text: "text-blue-800",   label: "Confirmed" },
  PROCESSING: { bg: "bg-purple-100", text: "text-purple-800", label: "Processing" },
  SHIPPED:    { bg: "bg-indigo-100", text: "text-indigo-800", label: "Shipped" },
  DELIVERED:  { bg: "bg-green-100",  text: "text-green-800",  label: "Delivered" },
  CANCELLED:  { bg: "bg-red-100",    text: "text-red-800",    label: "Cancelled" },
};

function useOrders() {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await api.get<{ data: Order[]; total: number }>("/orders");
      return res.data;
    },
  });
}

export default function OrdersPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const { data: orders, isLoading } = useOrders();

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-yellow-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">My Orders</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-yellow-400 flex items-center justify-center">
            <Package className="h-5 w-5 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500">Track and manage your yellowbirds orders</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        )}

        {!isLoading && (!orders || orders.length === 0) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
              <ShoppingBag className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8 max-w-xs">
              You haven't placed any orders yet. Start customizing your merch!
            </p>
            <Link
              to="/merchandise"
              className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold px-8 py-3 rounded-full uppercase tracking-wide transition-colors"
            >
              Shop Now
            </Link>
          </div>
        )}

        {!isLoading && orders && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_STYLES[order.status] ?? STATUS_STYLES["PENDING"];
              const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
              const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              });

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-200 hover:border-yellow-300 hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Order header */}
                  <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Order ID</p>
                        <p className="font-extrabold text-gray-900 font-mono text-sm">{order.id}</p>
                      </div>
                      <div className="hidden sm:block h-8 w-px bg-gray-200" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Placed on</p>
                        <p className="font-semibold text-gray-900 text-sm">{orderDate}</p>
                      </div>
                      <div className="hidden sm:block h-8 w-px bg-gray-200" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Items</p>
                        <p className="font-semibold text-gray-900 text-sm">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                      <p className="font-extrabold text-gray-900 text-lg">${order.totalAmount.toFixed(2)}</p>
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex items-center gap-1 text-sm font-bold text-yellow-600 hover:text-yellow-700 transition-colors"
                      >
                        View <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Order items preview */}
                  <div className="px-6 py-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5">
                          <div className="h-12 w-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1 max-w-[120px]">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.color} · {item.size} · ×{item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <span className="text-xs text-gray-500 font-semibold">+{order.items.length - 4} more</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
