import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, ArrowRight } from "lucide-react";
import { useState } from "react";
import { searchProductsQuery } from "~/queries/products";
import { categoriesQuery } from "~/queries/categories";
import { ProductCard } from "~/components/storefront/product-card";
import type { ProductResponse } from "~/queries/products";

const BRANDS = [
  "Google", "Microsoft", "Amazon", "Nike", "Apple",
  "Samsung", "Coca-Cola", "McDonald's", "Adidas", "BMW",
];

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    company: "TechStart Inc.",
    text: "Ordered 200 hoodies for our team retreat. Quality was outstanding, delivery was faster than expected, and the print was perfect. Will definitely reorder!",
    rating: 5,
    avatar: "SK",
  },
  {
    name: "Marcus D.",
    company: "Summit Events",
    text: "Used yellowbirds for three corporate events now. The no-minimum policy is a game changer for small runs and the bulk discounts are genuinely great.",
    rating: 5,
    avatar: "MD",
  },
  {
    name: "Priya M.",
    company: "GreenPath Co.",
    text: "Our eco-friendly water bottles turned out absolutely perfect. Logo looked sharp, packaging was beautiful, and our whole team loved them.",
    rating: 5,
    avatar: "PM",
  },
];

export function meta() {
  return [
    { title: "yellowbirds — Custom T-shirts, Merchandise & Gifts" },
    { name: "description", content: "Custom T-shirts, merchandise & gifts. 50,000+ happy customers. High quality, no minimums, free global shipping." },
  ];
}

const PRODUCT_TABS = [
  { id: "best_sellers", label: "Best Sellers" },
  { id: "new_arrivals", label: "New Arrivals" },
] as const;

function HeroProductTile({ product, className = "" }: { product: ProductResponse; className?: string }) {
  const [imgError, setImgError] = useState(false);
  return (
    <Link
      to={`/merchandise/${product.id}`}
      className={`group relative overflow-hidden rounded-2xl bg-gray-800 block ${className}`}
    >
      {product.mainImageUrl && !imgError ? (
        <img
          src={product.mainImageUrl}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: product.productColor || "#374151" }}
        >
          <span className="text-4xl">🐦</span>
        </div>
      )}
      {/* overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
      {/* bottom label */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white text-xs font-bold truncate">{product.name}</p>
        <p className="text-yellow-400 text-[10px] font-semibold uppercase tracking-wider">{product.categoryName}</p>
      </div>
    </Link>
  );
}

function HeroProductSkeleton({ className = "" }: { className?: string }) {
  return <div className={`rounded-2xl bg-gray-700/50 animate-pulse ${className}`} />;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"best_sellers" | "new_arrivals">("best_sellers");
  const { data: productsData, isLoading: productsLoading } = useQuery(searchProductsQuery({ page: 1, hitsPerPage: 12 }));
  const { data: categories = [] } = useQuery(categoriesQuery);

  const allProducts = productsData?.hits ?? [];
  const newArrivals = [...allProducts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const tabProducts = activeTab === "best_sellers" ? allProducts : newArrivals;

  // Hero gets first 5 products for the mosaic
  const heroProducts = allProducts.slice(0, 5);

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden min-h-[88vh] flex items-center">
        {/* dot grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }}
        />

        <div className="relative max-w-screen-xl mx-auto px-4 lg:px-8 py-14 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* ── Left: copy ── */}
          <div>
            {/* Stars */}
            <div className="flex items-center gap-1.5 mb-5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4.5 w-4.5 h-[18px] w-[18px] text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-1.5 text-sm font-semibold text-yellow-300">50,000+ Happy Customers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight mb-5">
              Custom T-shirts,<br />
              <span className="text-yellow-400">Merchandise</span><br />
              &amp; Gifts
            </h1>

            <p className="text-gray-300 text-lg mb-6 max-w-md">
              Premium quality branded merchandise. No minimums, free global shipping, up to 40% bulk discounts.
            </p>

            <ul className="space-y-2 mb-8">
              {[
                { icon: "✅", text: "High Quality. No Minimums!" },
                { icon: "💰", text: "Up to 40% Bulk Discounts!" },
                { icon: "🚀", text: "Fast & Free Shipping — Global Delivery" },
                { icon: "💬", text: "24/7 Expert Support" },
              ].map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm text-gray-200">
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/merchandise"
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-sm px-8 py-4 rounded-full uppercase tracking-wide transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/merchandise?sort=newest"
                className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white hover:bg-white/10 text-white font-bold text-sm px-8 py-4 rounded-full uppercase tracking-wide transition-all"
              >
                New Arrivals
              </Link>
            </div>
          </div>

          {/* ── Right: live product mosaic ── */}
          <div className="hidden lg:grid grid-cols-3 grid-rows-2 gap-3 h-[520px]">
            {/* Big tile: col 1, spans 2 rows */}
            {productsLoading ? (
              <HeroProductSkeleton className="col-span-1 row-span-2" />
            ) : heroProducts[0] ? (
              <HeroProductTile product={heroProducts[0]} className="col-span-1 row-span-2" />
            ) : (
              <div className="col-span-1 row-span-2 rounded-2xl bg-gray-700/40" />
            )}

            {/* Top-right 2 tiles */}
            {productsLoading ? (
              <>
                <HeroProductSkeleton className="col-span-1" />
                <HeroProductSkeleton className="col-span-1" />
              </>
            ) : (
              <>
                {heroProducts[1] ? (
                  <HeroProductTile product={heroProducts[1]} className="col-span-1" />
                ) : (
                  <div className="rounded-2xl bg-gray-700/40" />
                )}
                {heroProducts[2] ? (
                  <HeroProductTile product={heroProducts[2]} className="col-span-1" />
                ) : (
                  <div className="rounded-2xl bg-gray-700/40" />
                )}
              </>
            )}

            {/* Bottom-right 2 tiles */}
            {productsLoading ? (
              <>
                <HeroProductSkeleton className="col-span-1" />
                <HeroProductSkeleton className="col-span-1" />
              </>
            ) : (
              <>
                {heroProducts[3] ? (
                  <HeroProductTile product={heroProducts[3]} className="col-span-1" />
                ) : (
                  <div className="rounded-2xl bg-gray-700/40" />
                )}
                {heroProducts[4] ? (
                  <HeroProductTile product={heroProducts[4]} className="col-span-1" />
                ) : (
                  <div className="rounded-2xl bg-gray-700/40" />
                )}
              </>
            )}
          </div>

          {/* Mobile: show 2 product tiles side by side below the copy */}
          <div className="grid grid-cols-2 gap-3 h-44 lg:hidden">
            {productsLoading ? (
              <>
                <HeroProductSkeleton className="col-span-1" />
                <HeroProductSkeleton className="col-span-1" />
              </>
            ) : (
              <>
                {heroProducts[0] && <HeroProductTile product={heroProducts[0]} className="col-span-1" />}
                {heroProducts[1] && <HeroProductTile product={heroProducts[1]} className="col-span-1" />}
              </>
            )}
          </div>
        </div>

        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────────── */}
      <div className="bg-yellow-400 py-4">
        <div className="max-w-screen-xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 text-black">
          {[
            { label: "Happy Customers", value: "50,000+" },
            { label: "Custom Products", value: "1,000+" },
            { label: "Countries Delivered", value: "120+" },
            { label: "Bulk Discount", value: "Up to 40%" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold leading-none">{s.value}</p>
              <p className="text-xs font-bold uppercase tracking-wide mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category Grid ─────────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 lg:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Browse Our Categories
          </h2>
          <p className="text-gray-500 text-lg">1,000+ products across 22 categories, ready for your brand</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/merchandise?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-yellow-400 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col"
            >
              {cat.imageUrl ? (
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <span className="text-3xl font-extrabold text-gray-300 uppercase">{cat.name.slice(0, 2)}</span>
                </div>
              )}
              <div className="p-3 flex flex-col gap-2 flex-1">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-yellow-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-0.5 font-mono">{cat.code}</p>
                </div>
                <div className="mt-auto">
                  <span className="block w-full text-center bg-gray-900 group-hover:bg-yellow-400 group-hover:text-black text-white text-xs font-bold py-2 rounded-xl transition-colors uppercase tracking-wide">
                    CUSTOMIZE
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400 text-sm">
              No categories yet.
            </div>
          )}

          {/* All Products tile */}
          <Link
            to="/merchandise"
            className="group bg-yellow-400 border border-yellow-400 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col"
          >
            <div className="aspect-square overflow-hidden bg-yellow-300 flex items-center justify-center">
              <div className="text-center px-4">
                <Star className="h-12 w-12 text-yellow-700 mx-auto fill-yellow-600" />
                <p className="font-extrabold text-yellow-900 mt-2 text-lg leading-tight">All Products</p>
              </div>
            </div>
            <div className="p-3 flex flex-col gap-2 flex-1">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">All Products</h3>
                <p className="text-gray-700 text-xs mt-0.5">Browse everything</p>
              </div>
              <div className="mt-auto">
                <span className="block w-full text-center bg-gray-900 text-white text-xs font-bold py-2 rounded-xl uppercase tracking-wide">
                  SHOP NOW
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Tabbed Products Section ──────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14 border-y border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1 w-fit">
              {PRODUCT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    activeTab === tab.id
                      ? "bg-yellow-400 text-black shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Link
              to={activeTab === "best_sellers" ? "/merchandise" : "/merchandise?sort=newest"}
              className="text-sm font-bold text-gray-900 border-b-2 border-yellow-400 hover:text-yellow-600 transition-colors pb-0.5 self-start sm:self-auto"
            >
              View All →
            </Link>
          </div>

          {tabProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {tabProducts.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🐦</p>
              <p className="font-semibold">No products yet</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Brands ───────────────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 lg:px-8 py-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
            Customize World-Leading Brands
          </h2>
          <p className="text-gray-500">Trusted by 50,000+ businesses globally</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {BRANDS.map((brand) => (
            <div key={brand} className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="font-bold text-gray-500 text-sm">{brand}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="bg-gray-900 text-white py-14">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-2">Elevate Your Company</h2>
            <p className="text-gray-400 text-lg">Everything you need to create world-class branded merchandise</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "✅", title: "No Minimums", desc: "Order from just 1 item. Scale up whenever your needs grow." },
              { icon: "🚀", title: "Free Global Shipping", desc: "Every order ships free worldwide with full tracking." },
              { icon: "🎨", title: "Premium Quality", desc: "We use only top-grade materials and precision printing." },
              { icon: "💬", title: "24/7 Expert Support", desc: "Real humans always ready to help you create the perfect merch." },
            ].map((f) => (
              <div key={f.title} className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition-colors">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 lg:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Aww, thanks guys! 🙏</h2>
          <p className="text-gray-500 text-lg">What our customers say about yellowbirds</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-base leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-sm text-black">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-gray-500 text-sm">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────────── */}
      <section className="bg-yellow-400 py-16">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
            Ready to create your merch?
          </h2>
          <p className="text-yellow-900 text-xl mb-8 max-w-2xl mx-auto">
            50,000+ happy customers · No minimums · Free shipping everywhere
          </p>
          <Link
            to="/merchandise"
            className="inline-flex items-center justify-center bg-black hover:bg-gray-900 text-white font-extrabold text-lg px-12 py-4 rounded-full uppercase tracking-wide transition-all hover:shadow-2xl hover:-translate-y-0.5"
          >
            CUSTOMIZE NOW
          </Link>
        </div>
      </section>
    </div>
  );
}
