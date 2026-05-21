import { Link, useNavigate } from "react-router";
import type { ProductResponse } from "~/queries/products";

const WA_NUMBER = "905350297167";

interface Props {
  product: ProductResponse;
}

function waInquiry(product: ProductResponse) {
  const msg = `Hi! I'm interested in *${product.name}* (SKU: ${product.code}).\nCould you help me with pricing and customization options? 🙏`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function ProductCard({ product }: Props) {
  const navigate = useNavigate();

  return (
    <div className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-yellow-300 transition-all duration-200">
      {/* Image */}
      <Link to={`/merchandise/${product.id}`} className="relative aspect-square overflow-hidden bg-white block">
        {product.mainImageUrl ? (
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl select-none">
            🐦
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
          {/* Two CTA buttons like themerchlist */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/merchandise/${product.id}`)}
              className="flex-1 bg-gray-900 hover:bg-yellow-400 hover:text-black text-white text-xs font-extrabold py-2.5 rounded-xl transition-colors uppercase tracking-wide"
            >
              CUSTOMIZE
            </button>
            <a
              href={waInquiry(product)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#20b858] text-white text-xs font-extrabold py-2.5 rounded-xl transition-colors uppercase tracking-wide"
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              INQUIRE
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
