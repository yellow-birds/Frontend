import { useSearchParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { FilterSidebar } from "~/components/storefront/filter-sidebar";
import { ProductCard } from "~/components/storefront/product-card";
import { searchProductsQuery } from "~/queries/products";
import { categoriesQuery } from "~/queries/categories";

export function meta() {
  return [{ title: "Merchandise — yellowbirds" }];
}

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "newest", label: "Newest" },
  { value: "best_seller", label: "Best Sellers" },
];

export default function MerchandisePage() {
  const [params, setParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data: categories = [] } = useQuery(categoriesQuery);

  const categoryName = params.get("category") ?? undefined;
  const categoryId = categoryName
    ? categories.find((c) => c.name === categoryName)?.id
    : undefined;

  // Color filter: URL stores hex values (e.g. #FF5733)
  const activeColorHexes = params.getAll("colors");

  const searchParams = {
    q: params.get("search") ?? undefined,
    categoryId,
    color: activeColorHexes[0] ?? undefined,
    page: params.get("page") ? Number(params.get("page")) : 1,
    hitsPerPage: 20,
  };

  const { data, isLoading } = useQuery(searchProductsQuery(searchParams));

  const sort = params.get("sort") ?? "";

  // Client-side sort (backend search API has no sort params)
  const hits = (data?.hits ?? [])
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0; // default / best_seller: keep API order
    });

  const activeSearch = params.get("search");
  const activeCategory = params.get("category");

  function setSort(val: string) {
    const next = new URLSearchParams(params);
    val ? next.set("sort", val) : next.delete("sort");
    setParams(next);
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-yellow-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Merchandise</span>
          {activeCategory && (
            <>
              <span>/</span>
              <span className="text-gray-900 font-medium">{activeCategory}</span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Page title + controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {activeCategory ?? activeSearch ? (
                <>
                  {activeCategory && activeCategory}
                  {activeSearch && `Search: "${activeSearch}"`}
                </>
              ) : (
                "All Merchandise"
              )}
            </h1>
            {!isLoading && (
              <p className="text-sm text-gray-500 mt-0.5">
                {hits.length} product{hits.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            {/* Sort */}
            <select
              value={params.get("sort") ?? ""}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        {(activeCategory || activeColorHexes.length > 0 || params.get("search")) && (
          <div className="flex flex-wrap gap-2 mb-5">
            {activeCategory && (
              <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-yellow-200">
                {activeCategory}
                <button onClick={() => { const n = new URLSearchParams(params); n.delete("category"); setParams(n); }}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {activeColorHexes.map((hex) => (
              <span key={hex} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200">
                <span className="h-3 w-3 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: hex }} />
                {hex}
                <button onClick={() => {
                  const n = new URLSearchParams(params);
                  n.delete("colors");
                  activeColorHexes.filter((x) => x !== hex).forEach((x) => n.append("colors", x));
                  setParams(n);
                }}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {params.get("search") && (
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200">
                "{params.get("search")}"
                <button onClick={() => { const n = new URLSearchParams(params); n.delete("search"); setParams(n); }}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          {/* Mobile filter drawer */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
              <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
              </div>
            )}

            {!isLoading && hits.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-5xl mb-4">🔍</p>
                <p className="font-bold text-gray-900 text-lg mb-2">No products found</p>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search term.</p>
                <button
                  onClick={() => setParams(new URLSearchParams())}
                  className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {!isLoading && hits.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {hits.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      disabled={searchParams.page === 1}
                      onClick={() => {
                        const n = new URLSearchParams(params);
                        n.set("page", String((searchParams.page ?? 1) - 1));
                        setParams(n);
                      }}
                      className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: data.totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => { const n = new URLSearchParams(params); n.set("page", String(i + 1)); setParams(n); }}
                          className={`h-9 w-9 rounded-xl text-sm font-bold transition-colors ${
                            (searchParams.page ?? 1) === i + 1
                              ? "bg-yellow-400 text-black"
                              : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      disabled={(searchParams.page ?? 1) === data.totalPages}
                      onClick={() => {
                        const n = new URLSearchParams(params);
                        n.set("page", String((searchParams.page ?? 1) + 1));
                        setParams(n);
                      }}
                      className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
