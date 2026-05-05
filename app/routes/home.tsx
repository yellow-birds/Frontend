import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, CheckCircle2 } from "lucide-react";
import { CATEGORIES } from "~/mocks/data";
import { productsQuery } from "~/queries/products";
import { ProductCard } from "~/components/storefront/product-card";

const FEATURES = [
  { icon: "🌍", title: "1000+ Custom Products" },
  { icon: "✅", title: "High Quality. No Minimums!" },
  { icon: "💰", title: "Up to 40% Bulk Discounts!" },
  { icon: "🚀", title: "Fast & Free Shipping - Global Delivery. On-time!" },
  { icon: "💬", title: "Worry Free! Instant 24/7 Support" },
];

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

export default function Home() {
  const { data: bestSellersData } = useQuery(productsQuery({ sort: "best_seller", page: 0 }));
  const bestSellers = bestSellersData?.data ?? [];

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden"
        style={{ minHeight: "480px" }}
      >
        {/* background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
        />

        <div className="relative max-w-screen-xl mx-auto px-4 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          {/* Left: text */}
          <div className="flex-1 text-center md:text-left">
            {/* Stars */}
            <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-2 text-base font-semibold text-yellow-300">50,000+ Happy Customers</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Custom T-shirts,<br />
              <span className="text-yellow-400">Merchandise</span> &amp; Gifts
            </h1>

            <ul className="space-y-2.5 mb-8 text-left inline-block">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex items-center gap-3 text-base text-gray-200">
                  <span className="text-xl">{f.icon}</span>
                  <span>{f.title}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                to="/merchandise"
                className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-base px-10 py-4 rounded-full uppercase tracking-wide transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                CUSTOMIZE NOW
              </Link>
              <Link
                to="/merchandise?sort=best_seller"
                className="inline-flex items-center justify-center border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold text-base px-8 py-4 rounded-full uppercase tracking-wide transition-all"
              >
                Best Sellers
              </Link>
            </div>
          </div>

          {/* Right: feature image */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative">
              <img
                src="https://picsum.photos/seed/hero-merch/520/420"
                alt="Custom merchandise"
                className="rounded-2xl shadow-2xl w-full max-w-md object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-black rounded-2xl px-4 py-3 shadow-lg">
                <p className="font-extrabold text-2xl leading-none">40%</p>
                <p className="text-xs font-bold uppercase">Bulk Discount</p>
              </div>
              <div className="absolute -top-4 -right-4 bg-white text-gray-900 rounded-2xl px-4 py-3 shadow-lg">
                <p className="font-extrabold text-lg leading-none">1000+</p>
                <p className="text-xs font-bold uppercase text-gray-600">Products</p>
              </div>
            </div>
          </div>
        </div>
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
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/merchandise?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-yellow-400 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col"
            >
              <div className="aspect-square overflow-hidden bg-gray-50">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 flex flex-col gap-2 flex-1">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-yellow-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-0.5">{cat.count} products</p>
                </div>
                <div className="mt-auto">
                  <span className="block w-full text-center bg-gray-900 group-hover:bg-yellow-400 group-hover:text-black text-white text-xs font-bold py-2 rounded-xl transition-colors uppercase tracking-wide">
                    CUSTOMIZE
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Best Sellers tile */}
          <Link
            to="/merchandise?sort=best_seller"
            className="group bg-yellow-400 border border-yellow-400 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col"
          >
            <div className="aspect-square overflow-hidden bg-yellow-300 flex items-center justify-center">
              <div className="text-center px-4">
                <Star className="h-12 w-12 text-yellow-700 mx-auto fill-yellow-600" />
                <p className="font-extrabold text-yellow-900 mt-2 text-lg leading-tight">Best Sellers</p>
              </div>
            </div>
            <div className="p-3 flex flex-col gap-2 flex-1">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Best Sellers</h3>
                <p className="text-gray-700 text-xs mt-0.5">Top 100+ products</p>
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

      {/* ── Best Sellers Products ─────────────────────────────────────────────── */}
      {bestSellers.length > 0 && (
        <section className="bg-gray-50 py-14 border-y border-gray-100">
          <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-yellow-600 font-bold text-sm uppercase tracking-widest mb-1">Trending</p>
                <h2 className="text-3xl font-extrabold text-gray-900">Best Sellers</h2>
              </div>
              <Link
                to="/merchandise?sort=best_seller"
                className="text-sm font-bold text-gray-900 border-b-2 border-yellow-400 hover:text-yellow-600 transition-colors pb-0.5"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {bestSellers.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

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
