import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { api } from "~/lib/api";
import { ordersQuery } from "~/queries/orders";
import type { OrderStatus } from "~/types";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function meta() {
  return [{ title: "Dashboard — yellowbirds Admin" }];
}

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => api.get<Stats>("/admin/stats"),
  });

  const { data: ordersData } = useQuery(ordersQuery(0));
  const recentOrders = ordersData?.data.slice(0, 5) ?? [];

  const cards = [
    {
      label: "Total Products",
      value: stats?.totalProducts ?? "—",
      icon: Package,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
      change: "+2 this week",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? "—",
      icon: ShoppingBag,
      bg: "bg-green-50",
      iconColor: "text-green-600",
      change: "+12 this week",
    },
    {
      label: "Total Users",
      value: stats?.totalUsers ?? "—",
      icon: Users,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
      change: "+8 this week",
    },
    {
      label: "Total Revenue",
      value: stats ? `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—",
      icon: DollarSign,
      bg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      change: "+15% vs last month",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back. Here's what's happening.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          <Package className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Stat cards */}
      {statsLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-yellow-400" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map(({ label, value, icon: Icon, bg, iconColor, change }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${bg}`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900 mb-0.5">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xs text-green-600 font-semibold mt-2">{change}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-600 hover:text-yellow-700 transition-colors">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              to={`/admin/orders/${order.id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
              <p className="font-bold text-gray-900 text-sm">${order.totalAmount.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
