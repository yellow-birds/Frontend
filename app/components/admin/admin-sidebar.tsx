import { Link, useLocation, useNavigate } from "react-router";
import {
  Bird, LayoutDashboard, Package, ShoppingBag,
  Users, Tag, BarChart3, LogOut, ChevronRight, FolderOpen,
} from "lucide-react";
import { useAuthStore } from "~/store/auth.store";

const NAV = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Categories", to: "/admin/categories", icon: FolderOpen },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Discounts", to: "/admin/discounts", icon: Tag },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const { pathname } = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <aside className="w-64 shrink-0 bg-gray-900 text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-gray-800">
        <div className="h-8 w-8 rounded-lg bg-yellow-400 flex items-center justify-center shrink-0">
          <Bird className="h-5 w-5 text-black" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-white leading-none">yellowbirds</p>
          <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV.map(({ label, to, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? "bg-yellow-400 text-black"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${active ? "text-black" : "text-gray-500 group-hover:text-white"}`} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 text-black" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-1">
        <div className="px-3 py-2 rounded-xl bg-gray-800">
          <p className="text-xs font-bold text-white truncate">{user ? `${user.firstName} ${user.lastName}` : ""}</p>
          <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
