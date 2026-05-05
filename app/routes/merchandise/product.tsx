import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { productDetailQuery } from "~/queries/products";
import { useCartStore } from "~/store/cart.store";

export function meta() {
  return [{ title: "Product — yellowbirds" }];
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useQuery(productDetailQuery(slug!));
  const addItem = useCartStore((s) => s.addItem);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-destructive">
        Product not found.
      </div>
    );
  }

  const variant =
    product.variants.find((v) => v.id === selectedVariantId) ??
    product.variants[0];

  // Compute bulk discount price
  const applicableTier = [...product.discountTiers]
    .sort((a, b) => b.minQty - a.minQty)
    .find((t) => quantity >= t.minQty);
  const discount = applicableTier?.discountPercent ?? 0;
  const unitPrice = variant?.price ?? product.basePrice;
  const discountedPrice = unitPrice * (1 - discount / 100);

  function handleAddToCart() {
    if (!variant) return;
    addItem({
      productId: product!.id,
      variantId: variant.id,
      name: product!.name,
      image: product!.images[0],
      color: variant.color,
      size: variant.size,
      quantity,
      unitPrice: discountedPrice,
    });
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="flex flex-col gap-3">
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-xl border"
          />
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                  selectedImage === i ? "border-foreground" : "border-border"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-2">{product.description}</p>
          </div>

          {/* Pricing */}
          <div>
            <p className="text-2xl font-bold">
              ${discountedPrice.toFixed(2)}{" "}
              <span className="text-sm font-normal text-muted-foreground">/ item</span>
            </p>
            {discount > 0 && (
              <p className="text-sm text-green-600 font-medium">
                {discount}% bulk discount applied!
              </p>
            )}
          </div>

          {/* Discount tiers */}
          {product.discountTiers.length > 0 && (
            <div className="bg-muted/40 rounded-lg p-3">
              <p className="text-xs font-semibold mb-2 uppercase tracking-wide">Bulk discounts</p>
              <div className="flex gap-3 flex-wrap">
                {product.discountTiers.map((t) => (
                  <span key={t.minQty} className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full font-medium">
                    {t.minQty}+ items → {t.discountPercent}% off
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Color */}
          <div>
            <p className="text-sm font-medium mb-2">Color: <span className="font-normal">{variant?.color}</span></p>
            <div className="flex gap-2 flex-wrap">
              {[...new Map(product.variants.map((v) => [v.color, v])).values()].map((v) => (
                <button
                  key={v.color}
                  title={v.color}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    variant?.color === v.color
                      ? "border-foreground scale-110"
                      : "border-border"
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <p className="text-sm font-medium mb-2">Size</p>
            <div className="flex gap-2 flex-wrap">
              {product.variants
                .filter((v) => v.color === (variant?.color ?? product.variants[0]?.color))
                .map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                      selectedVariantId === v.id || (!selectedVariantId && v === product.variants[0])
                        ? "bg-foreground text-background"
                        : "hover:bg-muted"
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium">Quantity</p>
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-lg hover:bg-muted transition-colors"
              >
                −
              </button>
              <span className="px-4 py-1.5 text-sm font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1.5 text-lg hover:bg-muted transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <Button size="lg" onClick={handleAddToCart} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart — ${(discountedPrice * quantity).toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}
