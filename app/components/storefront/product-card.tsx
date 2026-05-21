import { Link, useNavigate } from "react-router";
import { useState } from "react";
import type { ProductResponse } from "~/queries/products";

interface Props {
  product: ProductResponse;
}

export function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-yellow-300 transition-all duration-200">
      {/* Image */}
      <Link to={`/merchandise/${product.id}`} className="relative aspect-square overflow-hidden bg-white block">
        {product.mainImageUrl && !imgError ? (
          <img
            src={product.mainImageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 select-none gap-2">
            <span className="text-5xl">🐦</span>
            <span className="text-xs text-gray-300 font-medium">No image</span>
          </div>
        )}
        {/* Color swatch badge */}
        {product.productColor && (
          <div
            className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: product.productColor }}
          />
        )}
      </Link>

      {/* Content */}
      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <p className="text-[11px] font-bold text-yellow-600 uppercase tracking-widest leading-none">
          {product.categoryName}
        </p>

        <Link to={`/merchandise/${product.id}`}>
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-yellow-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-400">No Minimums · Free Shipping</p>

        <div className="mt-auto pt-1">
          <button
            onClick={() => navigate(`/merchandise/${product.id}`)}
            className="w-full bg-gray-900 hover:bg-yellow-400 hover:text-black text-white text-xs font-extrabold py-2.5 rounded-xl transition-colors uppercase tracking-wide"
          >
            CUSTOMIZE
          </button>
        </div>
      </div>
    </div>
  );
}
