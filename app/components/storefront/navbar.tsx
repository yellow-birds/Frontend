import { Link, useNavigate } from "react-router";
import { ShoppingCart, Bird, Search, User, Phone, MapPin, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { useCartStore } from "~/store/cart.store";
import { useAuthStore } from "~/store/auth.store";

const NAV_CATEGORIES = [
  "Best Sellers", "New Arrivals",
  "T-shirts & Polos", "Hoodies & Jackets", "Jerseys & Sportswear",
  "Uniforms & Workwear", "Bottles & Mugs", "Caps & Hats",
  "Bags & Backpacks", "Office & Stationery", "Boxes & Packaging",
  "Travel & Tech", "Corporate Gifting", "Home & Wellness",
  "Printing Materials", "Eco-friendly", "Promotional Giveaways",
  "Pants & Shorts", "Pet Merch", "Kids & School",
  "Stickers & Labels", "Business Cards", "Tradeshows & Exhibitions",
  "Food & Candy",
];

export function Navbar() {
  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/merchandise?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  }

  function handleCategoryClick(cat: string) {
    if (cat === "Best Sellers") navigate("/merchandise?sort=best_seller");
    else if (cat === "New Arrivals") navigate("/merchandise?sort=newest");
    else navigate(`/merchandise?category=${encodeURIComponent(cat)}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top utility bar */}
      <div className="bg-gray-900 text-white text-xs py-1.5">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="tel:+97158224" className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors">
              <Phone className="h-3 w-3" />
              <span className="font-medium">800-MERCH</span>
            </a>
            <span className="hidden sm:flex items-center gap-1.5 text-gray-400">
              <MapPin className="h-3 w-3" />
              Free Global Delivery
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <span>High Quality · No Minimums · Up to 40% Bulk Discounts</span>
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-2">
            <div className="h-9 w-9 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Bird className="h-5 w-5 text-black" />
            </div>
            <span className="font-extrabold text-xl text-gray-900 hidden sm:block tracking-tight">
              yellowbirds
            </span>
          </Link>

          {/* Search — takes remaining space */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400 h-[18px] w-[18px]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 1000+ products (T-shirts, Mugs, Bags...)"
                className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors group"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-700 group-hover:text-gray-900" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 h-[18px] w-[18px] min-w-[18px] rounded-full bg-yellow-400 text-black text-[10px] font-extrabold flex items-center justify-center leading-none">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </div>
              <span className="hidden lg:block text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                Cart
              </span>
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-extrabold text-black">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="hidden lg:block text-sm font-semibold text-gray-700 max-w-[80px] truncate">
                    {user.fullName.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs font-bold text-gray-900 truncate">{user.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${user.role === "ADMIN" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600"}`}>
                        {user.role}
                      </span>
                    </div>
                    {user.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-yellow-700 hover:bg-yellow-50 transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl transition-colors uppercase"
                >
                  SIGN UP
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category navigation — horizontal scroll */}
      <div className="bg-white border-b border-gray-100 overflow-x-auto scrollbar-none">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
          <div className="flex items-stretch min-w-max">
            {NAV_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`whitespace-nowrap px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors hover:text-yellow-600 hover:border-yellow-400 ${
                  cat === "Best Sellers"
                    ? "text-yellow-600 border-yellow-400"
                    : "text-gray-600 border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
