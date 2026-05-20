import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Package, Users, Tag, ArrowRight, Loader2, Plus } from "lucide-react";
import { productsQuery } from "~/queries/products";
import { categoriesQuery } from "~/queries/categories";
import { api } from "~/lib/api";
import type { User } from "~/types";

export function meta() {
  return [{ title: "Dashboard — yellowbirds Admin" }];
}

export default function AdminDashboard() {
  const { data: products = [], isLoading: loadingProducts } = useQuery(productsQuery);
  const { data: categories = [], isLoading: loadingCategories } = useQuery(categoriesQuery);
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get<User[]>("/api/users"),
  });

  const isLoading = loadingProducts || loadingCategories || loadingUsers;

  const cards = [
    {
      label: "Total Products",
      value: isLoading ? null : products.length,
      icon: Package,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
      to: "/admin/products",
    },
    {
      label: "Categories",
      value: isLoading ? null : categories.length,
      icon: Tag,
      bg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      to: "/admin/categories",
    },
    {
      label: "Total Users",
      value: isLoading ? null : users.length,
      icon: Users,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
      to: "/admin/users",
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
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, bg, iconColor, to }) => (
          <Link
            key={label}
            to={to}
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-yellow-300 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300" />
            </div>
            {value === null ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-300 mb-1" />
            ) : (
              <p className="text-3xl font-extrabold text-gray-900 mb-0.5">{value}</p>
            )}
            <p className="text-sm text-gray-500">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <Link
            to="/admin/products/new"
            className="flex items-center gap-3 px-6 py-5 hover:bg-gray-50 transition-colors"
          >
            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">Add Product</p>
              <p className="text-xs text-gray-500">Create a new product listing</p>
            </div>
          </Link>
          <Link
            to="/admin/categories"
            className="flex items-center gap-3 px-6 py-5 hover:bg-gray-50 transition-colors"
          >
            <div className="h-9 w-9 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0">
              <Tag className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">Manage Categories</p>
              <p className="text-xs text-gray-500">Organise your product catalogue</p>
            </div>
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center gap-3 px-6 py-5 hover:bg-gray-50 transition-colors"
          >
            <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">View Users</p>
              <p className="text-xs text-gray-500">Browse registered accounts</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
