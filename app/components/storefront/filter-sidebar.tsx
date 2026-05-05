import { useSearchParams } from "react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  "T-shirts & Polos",
  "Hoodies & Jackets",
  "Jerseys & Sportswear",
  "Uniforms & Workwear",
  "Bottles & Mugs",
  "Caps & Hats",
  "Bags & Backpacks",
  "Office & Stationery",
  "Boxes & Packaging",
  "Travel & Tech",
  "Corporate Gifting",
  "Home & Wellness",
  "Printing Materials",
  "Eco-friendly",
  "Promotional Giveaways",
  "Pants & Shorts",
  "Pet Merch",
  "Kids & School",
  "Stickers & Labels",
  "Business Cards",
  "Tradeshows & Exhibitions",
  "Food & Candy",
];

const COLORS = [
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Black", hex: "#111827" },
  { name: "Bronze", hex: "#CD7F32" },
  { name: "Brown Coffee", hex: "#6F4E37" },
  { name: "Cadet Blue", hex: "#5F9EA0" },
  { name: "Cyan", hex: "#00BCD4" },
  { name: "Dark Blue", hex: "#0D1B4B" },
  { name: "Dark Green", hex: "#1B5E20" },
  { name: "Dark Red", hex: "#8B0000" },
  { name: "Forest Green", hex: "#228B22" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Green", hex: "#4CAF50" },
  { name: "Grey", hex: "#9E9E9E" },
  { name: "Hot Pink", hex: "#FF69B4" },
  { name: "Khaki", hex: "#C3B091" },
  { name: "Light Green", hex: "#90EE90" },
  { name: "Light Grey", hex: "#D3D3D3" },
  { name: "Navy Blue", hex: "#1E3A5F" },
  { name: "Olive", hex: "#808000" },
  { name: "Orange", hex: "#FF6600" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Purple", hex: "#7B1FA2" },
  { name: "Red", hex: "#DC2626" },
  { name: "Rose Gold", hex: "#B76E79" },
  { name: "Royal Blue", hex: "#1D4ED8" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Sky Blue", hex: "#87CEEB" },
  { name: "Steel Blue", hex: "#4682B4" },
  { name: "Tan", hex: "#D2B48C" },
  { name: "Teal Blue", hex: "#008080" },
  { name: "Titanium", hex: "#878681" },
  { name: "Wheat", hex: "#F5DEB3" },
  { name: "White", hex: "#F9FAFB" },
  { name: "Wine Red", hex: "#722F37" },
  { name: "Wood Brown", hex: "#9B5E2A" },
  { name: "Yellow", hex: "#FACC15" },
];

const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 – $50", min: 25, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "Over $100", min: 100, max: undefined },
];

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 text-sm font-bold text-gray-900 hover:text-yellow-600 transition-colors"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="space-y-0.5">{children}</div>}
    </div>
  );
}

export function FilterSidebar() {
  const [params, setParams] = useSearchParams();
  const [showAllColors, setShowAllColors] = useState(false);

  const activeCategory = params.get("category");
  const activeColors = params.getAll("colors");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");

  function setCategory(cat: string) {
    const next = new URLSearchParams(params);
    if (activeCategory === cat) {
      next.delete("category");
    } else {
      next.set("category", cat);
    }
    next.set("page", "0");
    setParams(next);
  }

  function toggleColor(color: string) {
    const next = new URLSearchParams(params);
    const current = next.getAll("colors");
    next.delete("colors");
    if (current.includes(color)) {
      current.filter((c) => c !== color).forEach((c) => next.append("colors", c));
    } else {
      [...current, color].forEach((c) => next.append("colors", c));
    }
    next.set("page", "0");
    setParams(next);
  }

  function setPrice(min?: number, max?: number) {
    const next = new URLSearchParams(params);
    min !== undefined ? next.set("minPrice", String(min)) : next.delete("minPrice");
    max !== undefined ? next.set("maxPrice", String(max)) : next.delete("maxPrice");
    next.set("page", "0");
    setParams(next);
  }

  const hasFilters = activeCategory || activeColors.length > 0 || minPrice || maxPrice;
  const visibleColors = showAllColors ? COLORS : COLORS.slice(0, 24);

  return (
    <aside className="w-60 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-extrabold text-gray-900 text-base">Filters</h2>
        {hasFilters && (
          <button
            onClick={() => setParams(new URLSearchParams())}
            className="text-xs text-yellow-600 font-bold hover:text-yellow-700 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-0">
        {/* Category */}
        <Section title="Category">
          <div className="max-h-64 overflow-y-auto pr-1 space-y-0.5">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={activeCategory === cat}
                  onChange={() => setCategory(cat)}
                  className="h-4 w-4 rounded border-gray-300 cursor-pointer accent-yellow-400"
                />
                <span className={`text-sm transition-colors leading-tight ${activeCategory === cat ? "text-gray-900 font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}>
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </Section>

        {/* Color */}
        <Section title="Color">
          <div className="grid grid-cols-6 gap-1.5 pt-1">
            {visibleColors.map((c) => (
              <button
                key={c.name}
                title={c.name}
                onClick={() => toggleColor(c.name)}
                className={`relative h-7 w-7 rounded-full border-2 transition-all hover:scale-110 ${
                  activeColors.includes(c.name)
                    ? "border-yellow-400 scale-110 shadow-md"
                    : c.hex === "#F9FAFB" || c.hex === "#F5F5DC" || c.hex === "#D3D3D3" || c.hex === "#F5DEB3"
                    ? "border-gray-300 hover:border-gray-500"
                    : "border-transparent hover:border-gray-400"
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {activeColors.includes(c.name) && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`h-1.5 w-1.5 rounded-full shadow-sm ${
                        c.hex === "#F9FAFB" || c.hex === "#FACC15" || c.hex === "#FFD700"
                          ? "bg-gray-800"
                          : "bg-white"
                      }`}
                    />
                  </span>
                )}
              </button>
            ))}
          </div>
          {!showAllColors && COLORS.length > 24 && (
            <button
              onClick={() => setShowAllColors(true)}
              className="mt-2 text-xs text-yellow-600 font-bold hover:text-yellow-700 transition-colors"
            >
              + {COLORS.length - 24} more colors
            </button>
          )}
          {activeColors.length > 0 && (
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{activeColors.join(", ")}</p>
          )}
        </Section>

        {/* Price */}
        <Section title="Price Range">
          {PRICE_RANGES.map((r) => {
            const active =
              params.get("minPrice") === String(r.min) &&
              (r.max === undefined ? !params.has("maxPrice") : params.get("maxPrice") === String(r.max));
            return (
              <label key={r.label} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
                <input
                  type="radio"
                  name="price"
                  checked={active}
                  onChange={() => setPrice(r.min, r.max)}
                  className="h-4 w-4 border-gray-300 accent-yellow-400 cursor-pointer"
                />
                <span className={`text-sm transition-colors ${active ? "text-gray-900 font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}>
                  {r.label}
                </span>
              </label>
            );
          })}
        </Section>

        {/* Sort */}
        <Section title="Sort By" defaultOpen={false}>
          {[
            { value: "", label: "Default" },
            { value: "price_asc", label: "Price: Low to High" },
            { value: "price_desc", label: "Price: High to Low" },
            { value: "newest", label: "Newest First" },
            { value: "best_seller", label: "Best Sellers" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
              <input
                type="radio"
                name="sort"
                checked={(params.get("sort") ?? "") === opt.value}
                onChange={() => {
                  const next = new URLSearchParams(params);
                  opt.value ? next.set("sort", opt.value) : next.delete("sort");
                  setParams(next);
                }}
                className="h-4 w-4 border-gray-300 accent-yellow-400 cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{opt.label}</span>
            </label>
          ))}
        </Section>
      </div>
    </aside>
  );
}
