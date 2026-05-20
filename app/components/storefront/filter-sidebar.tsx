import { useSearchParams } from "react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoriesQuery } from "~/queries/categories";

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
  const { data: categories = [] } = useQuery(categoriesQuery);

  const activeCategory = params.get("category");
  const activeColors = params.getAll("colors");

  function setCategory(cat: string) {
    const next = new URLSearchParams(params);
    if (activeCategory === cat) {
      next.delete("category");
    } else {
      next.set("category", cat);
    }
    next.set("page", "1");
    setParams(next);
  }

  function toggleColor(hex: string) {
    const next = new URLSearchParams(params);
    const current = next.getAll("colors");
    next.delete("colors");
    if (current.includes(hex)) {
      current.filter((c) => c !== hex).forEach((c) => next.append("colors", c));
    } else {
      [...current, hex].forEach((c) => next.append("colors", c));
    }
    next.set("page", "1");
    setParams(next);
  }

  const hasFilters = activeCategory || activeColors.length > 0;
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
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={activeCategory === cat.name}
                  onChange={() => setCategory(cat.name)}
                  className="h-4 w-4 rounded border-gray-300 cursor-pointer accent-yellow-400"
                />
                <span className={`text-sm transition-colors leading-tight ${activeCategory === cat.name ? "text-gray-900 font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}>
                  {cat.name}
                </span>
              </label>
            ))}
            {categories.length === 0 && (
              <p className="text-xs text-gray-400 py-2">No categories yet.</p>
            )}
          </div>
        </Section>

        {/* Color */}
        <Section title="Color">
          <div className="grid grid-cols-6 gap-1.5 pt-1">
            {visibleColors.map((c) => {
              const active = activeColors.includes(c.hex);
              const isLight = ["#F9FAFB", "#F5F5DC", "#D3D3D3", "#F5DEB3", "#FACC15", "#FFD700", "#90EE90"].includes(c.hex);
              return (
                <button
                  key={c.hex}
                  title={c.name}
                  onClick={() => toggleColor(c.hex)}
                  className={`relative h-7 w-7 rounded-full border-2 transition-all hover:scale-110 ${
                    active
                      ? "border-yellow-400 scale-110 shadow-md"
                      : isLight
                      ? "border-gray-300 hover:border-gray-500"
                      : "border-transparent hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {active && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className={`h-1.5 w-1.5 rounded-full shadow-sm ${isLight ? "bg-gray-800" : "bg-white"}`} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {!showAllColors && COLORS.length > 24 && (
            <button
              onClick={() => setShowAllColors(true)}
              className="mt-2 text-xs text-yellow-600 font-bold hover:text-yellow-700 transition-colors"
            >
              + {COLORS.length - 24} more colors
            </button>
          )}
        </Section>

        {/* Sort */}
        <Section title="Sort By" defaultOpen={false}>
          <div className="flex flex-col gap-2 pt-1">
            {[
              { value: "", label: "Default" },
              { value: "newest", label: "Newest First" },
              { value: "best_seller", label: "Best Sellers" },
            ].map((opt) => {
              const active = (params.get("sort") ?? "") === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    const next = new URLSearchParams(params);
                    opt.value ? next.set("sort", opt.value) : next.delete("sort");
                    setParams(next);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                    active
                      ? "bg-yellow-400 border-yellow-400 text-black"
                      : "border-gray-200 text-gray-600 hover:border-yellow-400 hover:text-gray-900"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </Section>
      </div>
    </aside>
  );
}
