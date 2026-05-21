import { useParams, Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { ShoppingCart, Loader2, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { productDetailQuery } from "~/queries/products";
import { useCartStore } from "~/store/cart.store";

const WA_NUMBER = "905350297167";

const COLOR_PALETTE = [
  { name: "Black", hex: "#111827" },
  { name: "White", hex: "#F9FAFB" },
  { name: "Navy Blue", hex: "#1E3A5F" },
  { name: "Royal Blue", hex: "#1D4ED8" },
  { name: "Red", hex: "#DC2626" },
  { name: "Dark Red", hex: "#8B0000" },
  { name: "Forest Green", hex: "#228B22" },
  { name: "Dark Green", hex: "#1B5E20" },
  { name: "Yellow", hex: "#FACC15" },
  { name: "Orange", hex: "#FF6600" },
  { name: "Purple", hex: "#7B1FA2" },
  { name: "Hot Pink", hex: "#FF69B4" },
  { name: "Grey", hex: "#9E9E9E" },
  { name: "Light Grey", hex: "#D3D3D3" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Brown", hex: "#6F4E37" },
  { name: "Teal", hex: "#008080" },
  { name: "Cyan", hex: "#00BCD4" },
];

export function meta() {
  return [{ title: "Product — yellowbirds" }];
}

export default function ProductPage() {
  const { slug: id } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useQuery(productDetailQuery(id!));
  const addItem = useCartStore((s) => s.addItem);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [customColor, setCustomColor] = useState<string>("");
  const [sizeError, setSizeError] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 4;

  const changeZoom = useCallback((delta: number) => {
    setZoom((z) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta));
      if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    changeZoom(e.deltaY < 0 ? 0.3 : -0.3);
  }, [changeZoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    setPan({
      x: dragStart.current.px + (e.clientX - dragStart.current.x),
      y: dragStart.current.py + (e.clientY - dragStart.current.y),
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  const handleImageClick = useCallback(() => {
    if (isDragging) return;
    if (zoom >= MAX_ZOOM) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else {
      changeZoom(zoom === 1 ? 1.5 : 1);
    }
  }, [zoom, isDragging, changeZoom]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-red-500">
        Product not found.
      </div>
    );
  }

  const sizes = product.availableSizes ?? [];
  // Don't auto-select — require an explicit choice when sizes are available
  const activeSize = selectedSize;
  const displayColor = customColor || product.productColor;

  function handleAddToCart() {
    if (!product) return;
    if (sizes.length > 0 && !activeSize) {
      setSizeError(true);
      toast.error("Please select a size first");
      return;
    }
    setSizeError(false);
    const added = addItem({
      productId: product.id,
      variantId: `${product.id}-${activeSize}-${displayColor}`,
      name: product.name,
      image: product.mainImageUrl ?? "",
      color: displayColor,
      size: activeSize,
      quantity,
      unitPrice: product.salePrice,
    });
    if (added) {
      toast.success(`${product.name} added to cart`, {
        description: [activeSize, COLOR_PALETTE.find(c => c.hex === displayColor)?.name].filter(Boolean).join(" · "),
        action: { label: "View Cart", onClick: () => navigate("/cart") },
      });
    } else {
      toast.info("Already in your cart", {
        description: "Adjust the quantity using +/− in your cart.",
        action: { label: "Go to Cart", onClick: () => navigate("/cart") },
      });
    }
  }

  function waInquiry() {
    const colorInfo = customColor
      ? `\nCustom Color: ${COLOR_PALETTE.find(c => c.hex === customColor)?.name ?? customColor}`
      : `\nColor: ${product.productColor}`;
    const sizeInfo = activeSize ? `\nSize: ${activeSize}` : sizes.length > 0 ? "\nSize: (not yet selected — please advise)" : "";
    const msg = `Hi! I'm interested in *${product.name}* (SKU: ${product.code})${colorInfo}${sizeInfo}\n\nCould you confirm availability and pricing for qty: ${quantity}? 🙏`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  const isLight = (hex: string) =>
    ["#F9FAFB", "#FACC15", "#D3D3D3", "#F5F5DC"].includes(hex);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-yellow-600 transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <Link to="/merchandise" className="hover:text-yellow-600 transition-colors">Merchandise</Link>
        {product.categoryName && (
          <>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link
              to={`/merchandise?category=${encodeURIComponent(product.categoryName)}`}
              className="hover:text-yellow-600 transition-colors"
            >
              {product.categoryName}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Image viewer with zoom */}
        <div className="space-y-3">
          <div
            ref={imgContainerRef}
            className="aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-white relative select-none"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
          >
            {product.mainImageUrl && !imgError ? (
              <>
                <div
                  className="w-full h-full transition-transform duration-150 ease-out"
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    transformOrigin: "center center",
                  }}
                  onClick={handleImageClick}
                >
                  <img
                    src={product.mainImageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-2"
                    draggable={false}
                    onError={() => setImgError(true)}
                  />
                  {/* Color overlay */}
                  {customColor && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ backgroundColor: customColor, mixBlendMode: "color" }}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200 text-9xl">
                🐦
              </div>
            )}

            {/* Zoom controls */}
            {product.mainImageUrl && (
              <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); changeZoom(0.5); }}
                  disabled={zoom >= MAX_ZOOM}
                  className="h-8 w-8 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 shadow flex items-center justify-center text-gray-600 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); changeZoom(-0.5); }}
                  disabled={zoom <= MIN_ZOOM}
                  className="h-8 w-8 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 shadow flex items-center justify-center text-gray-600 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                {zoom > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setZoom(1); setPan({ x: 0, y: 0 }); }}
                    className="h-8 w-8 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 shadow flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all"
                    title="Reset zoom"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Zoom level pill */}
            {zoom > 1 && (
              <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                {zoom.toFixed(1)}×
              </div>
            )}

            {/* Color name badge */}
            {customColor && (
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-gray-100">
                <div className="h-4 w-4 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: customColor }} />
                <span className="text-xs font-semibold text-gray-700">
                  {COLOR_PALETTE.find(c => c.hex === customColor)?.name ?? customColor}
                </span>
                <button onClick={(e) => { e.stopPropagation(); setCustomColor(""); }} className="text-xs text-gray-400 hover:text-gray-600 ml-1 leading-none">✕</button>
              </div>
            )}

            {/* Hint — only at 1× */}
            {zoom === 1 && (
              <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg pointer-events-none">
                Click or scroll to zoom
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          {/* Category + name */}
          <div>
            {product.categoryName && (
              <Link
                to={`/merchandise?category=${encodeURIComponent(product.categoryName)}`}
                className="inline-block text-xs font-bold text-yellow-600 uppercase tracking-widest mb-2 hover:text-yellow-700 transition-colors"
              >
                {product.categoryName}
              </Link>
            )}
            <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-400 mt-1 font-mono">SKU: {product.code}</p>
            <p className="text-xs text-green-600 font-semibold mt-1">✓ No Minimums · Free Global Shipping</p>
            <p className="text-xs text-yellow-600 font-semibold mt-1">💬 Price negotiated via WhatsApp</p>
          </div>

          {/* Color customization */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">
                Customize Color
                {customColor && (
                  <span className="ml-2 text-xs font-normal text-yellow-600">
                    — {COLOR_PALETTE.find(c => c.hex === customColor)?.name ?? customColor}
                  </span>
                )}
              </p>
              {customColor && (
                <button
                  onClick={() => setCustomColor("")}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Reset to original
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {COLOR_PALETTE.map((c) => {
                const active = displayColor === c.hex;
                return (
                  <button
                    key={c.hex}
                    title={c.name}
                    onClick={() => setCustomColor(c.hex === product.productColor ? "" : c.hex)}
                    className={`relative h-8 w-8 rounded-full border-2 transition-all hover:scale-110 ${
                      active
                        ? "border-yellow-400 scale-110 shadow-md"
                        : isLight(c.hex)
                        ? "border-gray-300 hover:border-gray-500"
                        : "border-transparent hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {active && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className={`h-2 w-2 rounded-full ${isLight(c.hex) ? "bg-gray-800" : "bg-white"}`} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sizes */}
          {sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">
                  Size
                  {activeSize && (
                    <span className="ml-2 font-normal text-gray-500">— {activeSize}</span>
                  )}
                </p>
                {sizeError && (
                  <span className="text-xs font-bold text-red-500">Please select a size</span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`px-4 py-2.5 rounded-xl border-2 text-sm font-extrabold transition-all hover:scale-105 ${
                      activeSize === size
                        ? "bg-yellow-400 border-yellow-400 text-black shadow-sm scale-105"
                        : sizeError
                        ? "border-red-300 text-gray-700 hover:border-yellow-400"
                        : "border-gray-200 text-gray-700 hover:border-yellow-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!activeSize && !sizeError && (
                <p className="text-xs text-gray-400 mt-1.5">Select your size above</p>
              )}
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Quantity</p>
            <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-lg font-bold hover:bg-gray-50 transition-colors"
              >−</button>
              <span className="px-5 py-2 text-sm font-bold min-w-[3rem] text-center border-x border-gray-200">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2 text-lg font-bold hover:bg-gray-50 transition-colors"
              >+</button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              onClick={handleAddToCart}
              className={`font-extrabold text-base rounded-xl transition-colors ${
                sizes.length > 0 && !activeSize
                  ? "bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-default"
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              }`}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {sizes.length > 0 && !activeSize ? "Select a Size First" : "Add to Cart"}
            </Button>

            <a
              href={waInquiry()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-extrabold text-base text-white transition-colors"
              style={{ backgroundColor: "#25D366" }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = "#20b858")}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = "#25D366")}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send Inquiry via WhatsApp
            </a>
          </div>

          {/* Meta */}
          <div className="pt-4 border-t border-gray-100 space-y-1 text-xs text-gray-400">
            <p>Category: <span className="font-medium text-gray-600">{product.categoryName}</span></p>
            <p>SKU: <span className="font-mono text-gray-600">{product.code}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
