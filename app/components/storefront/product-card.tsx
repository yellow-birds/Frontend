import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "~/store/cart.store";
import type { Product } from "~/types";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const firstVariant = product.variants[0];

  const uniqueColors = [...new Map(product.variants.map((v) => [v.color, v])).values()].slice(0, 6);
  const extraColors = [...new Set(product.variants.map((v) => v.color))].length - 6;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant) return;
    addItem({
      productId: product.id,
      variantId: firstVariant.id,
      name: product.name,
      image: product.images[0],
      color: firstVariant.color,
      size: firstVariant.size,
      quantity: 1,
      unitPrice: firstVariant.price,
    });
  }

  return (
    <Link
      to={`/merchandise/${product.slug}`}
      className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-yellow-300 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
        />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isBestSeller && (
            <span className="bg-yellow-400 text-black text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide leading-none shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-gray-900 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide leading-none shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Hover overlay: Add to cart */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-250">
          <button
            onClick={handleQuickAdd}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-yellow-400 hover:text-black text-white text-sm font-bold py-2.5 rounded-lg transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col gap-2.5 flex-1">
        {/* Category */}
        <p className="text-[11px] font-bold text-yellow-600 uppercase tracking-widest leading-none">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-yellow-600 transition-colors">
          {product.name}
        </h3>

        {/* Colors */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {uniqueColors.map((v) => (
            <span
              key={v.color}
              title={v.color}
              className="h-5 w-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 flex-shrink-0"
              style={{ backgroundColor: v.colorHex }}
            />
          ))}
          {extraColors > 0 && (
            <span className="text-xs text-gray-500 font-semibold">+{extraColors} more</span>
          )}
        </div>

        {/* Price + Discount */}
        <div className="mt-auto pt-1 flex items-end justify-between gap-2">
          <div>
            <p className="text-gray-900 font-extrabold text-lg leading-none">
              From ${product.basePrice.toFixed(2)}
            </p>
            {product.discountTiers.length > 0 && (
              <p className="text-green-600 text-xs font-bold mt-1">
                Up to {Math.max(...product.discountTiers.map((t) => t.discountPercent))}% bulk discount
              </p>
            )}
          </div>
        </div>

        {/* Customize CTA */}
        <button
          onClick={(e) => { e.preventDefault(); window.location.href = `/merchandise/${product.slug}`; }}
          className="w-full bg-gray-900 hover:bg-yellow-400 hover:text-black text-white text-sm font-extrabold py-2.5 rounded-xl transition-colors uppercase tracking-wide"
        >
          CUSTOMIZE
        </button>
      </div>
    </Link>
  );
}
