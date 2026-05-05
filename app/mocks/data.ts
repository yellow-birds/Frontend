import type { Coupon, Order, Product, User } from "~/types";

// ─── Mock Users ───────────────────────────────────────────────────────────────
// Admin:  admin@yellowbirds.com  / Admin123!
// Buyer:  buyer@yellowbirds.com  / Buyer123!

export const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "user-admin-001",
    email: "admin@yellowbirds.com",
    fullName: "Alex Admin",
    role: "ADMIN",
    password: "Admin123!",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-buyer-001",
    email: "buyer@yellowbirds.com",
    fullName: "Blake Buyer",
    role: "CUSTOMER",
    password: "Buyer123!",
    createdAt: "2024-03-15T00:00:00Z",
  },
];

// ─── Categories (matching themerchlist.com exactly) ───────────────────────────

export const CATEGORIES = [
  { name: "T-shirts & Polos", count: 49, slug: "tshirts-polos", image: "https://picsum.photos/seed/tshirt-polo/400/400" },
  { name: "Hoodies & Jackets", count: 25, slug: "hoodies-jackets", image: "https://picsum.photos/seed/hoodie-jacket/400/400" },
  { name: "Jerseys & Sportswear", count: 81, slug: "jerseys-sportswear", image: "https://picsum.photos/seed/jersey-sport/400/400" },
  { name: "Uniforms & Workwear", count: 66, slug: "uniforms-workwear", image: "https://picsum.photos/seed/uniform-work/400/400" },
  { name: "Bottles & Mugs", count: 161, slug: "bottles-mugs", image: "https://picsum.photos/seed/bottle-mug/400/400" },
  { name: "Caps & Hats", count: 26, slug: "caps-hats", image: "https://picsum.photos/seed/caps-hats/400/400" },
  { name: "Bags & Backpacks", count: 133, slug: "bags-backpacks", image: "https://picsum.photos/seed/bag-backpack/400/400" },
  { name: "Office & Stationery", count: 372, slug: "office-stationery", image: "https://picsum.photos/seed/office-stat/400/400" },
  { name: "Boxes & Packaging", count: 24, slug: "boxes-packaging", image: "https://picsum.photos/seed/boxes-pack/400/400" },
  { name: "Travel & Tech", count: 190, slug: "travel-tech", image: "https://picsum.photos/seed/travel-tech/400/400" },
  { name: "Corporate Gifting", count: 519, slug: "corporate-gifting", image: "https://picsum.photos/seed/corp-gift/400/400" },
  { name: "Home & Wellness", count: 230, slug: "home-wellness", image: "https://picsum.photos/seed/home-well/400/400" },
  { name: "Printing Materials", count: 40, slug: "printing-materials", image: "https://picsum.photos/seed/printing/400/400" },
  { name: "Eco-friendly", count: 189, slug: "eco-friendly", image: "https://picsum.photos/seed/eco-green/400/400" },
  { name: "Promotional Giveaways", count: 638, slug: "promotional-giveaways", image: "https://picsum.photos/seed/promo-give/400/400" },
  { name: "Pants & Shorts", count: 8, slug: "pants-shorts", image: "https://picsum.photos/seed/pants-short/400/400" },
  { name: "Pet Merch", count: 6, slug: "pet-merch", image: "https://picsum.photos/seed/pet-merch/400/400" },
  { name: "Kids & School", count: 365, slug: "kids-school", image: "https://picsum.photos/seed/kids-school/400/400" },
  { name: "Stickers & Labels", count: 19, slug: "stickers-labels", image: "https://picsum.photos/seed/sticker-label/400/400" },
  { name: "Business Cards", count: 10, slug: "business-cards", image: "https://picsum.photos/seed/business-card/400/400" },
  { name: "Tradeshows & Exhibitions", count: 31, slug: "tradeshows", image: "https://picsum.photos/seed/tradeshow/400/400" },
  { name: "Food & Candy", count: 8, slug: "food-candy", image: "https://picsum.photos/seed/food-candy/400/400" },
];

// ─── Mock Products ────────────────────────────────────────────────────────────

export const MOCK_PRODUCTS: Product[] = [
  // T-shirts & Polos
  {
    id: "prod-001", slug: "classic-unisex-tshirt", name: "Classic Unisex T-Shirt",
    description: "Premium 100% combed cotton. Soft, lightweight, and durable. Perfect for custom printing — logos, text, or full designs. Runs true to size.",
    category: "T-shirts & Polos", tags: ["t-shirt", "clothing", "bestseller"],
    images: ["https://picsum.photos/seed/tshirt1/600/600", "https://picsum.photos/seed/tshirt2/600/600"],
    variants: [
      { id: "v001-1", color: "Black", colorHex: "#111827", size: "S", stock: 200, price: 24.99 },
      { id: "v001-2", color: "Black", colorHex: "#111827", size: "M", stock: 300, price: 24.99 },
      { id: "v001-3", color: "Black", colorHex: "#111827", size: "L", stock: 250, price: 24.99 },
      { id: "v001-4", color: "White", colorHex: "#F9FAFB", size: "S", stock: 180, price: 24.99 },
      { id: "v001-5", color: "White", colorHex: "#F9FAFB", size: "M", stock: 220, price: 24.99 },
      { id: "v001-6", color: "Navy Blue", colorHex: "#1E3A5F", size: "M", stock: 180, price: 24.99 },
      { id: "v001-7", color: "Red", colorHex: "#DC2626", size: "M", stock: 120, price: 24.99 },
      { id: "v001-8", color: "Royal Blue", colorHex: "#1D4ED8", size: "M", stock: 100, price: 24.99 },
    ],
    basePrice: 24.99,
    discountTiers: [{ minQty: 10, discountPercent: 10 }, { minQty: 25, discountPercent: 20 }, { minQty: 50, discountPercent: 30 }, { minQty: 100, discountPercent: 40 }],
    isBestSeller: true, isNewArrival: false, createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "prod-002", slug: "polo-shirt-pique", name: "Classic Piqué Polo Shirt",
    description: "100% piqué cotton polo with ribbed collar and two-button placket. Perfect for corporate uniforms and team branding.",
    category: "T-shirts & Polos", tags: ["polo", "corporate", "bestseller"],
    images: ["https://picsum.photos/seed/polo1/600/600", "https://picsum.photos/seed/polo2/600/600"],
    variants: [
      { id: "v002-1", color: "White", colorHex: "#F9FAFB", size: "S", stock: 150, price: 29.99 },
      { id: "v002-2", color: "White", colorHex: "#F9FAFB", size: "M", stock: 200, price: 29.99 },
      { id: "v002-3", color: "Black", colorHex: "#111827", size: "M", stock: 180, price: 29.99 },
      { id: "v002-4", color: "Navy Blue", colorHex: "#1E3A5F", size: "M", stock: 150, price: 29.99 },
    ],
    basePrice: 29.99,
    discountTiers: [{ minQty: 10, discountPercent: 10 }, { minQty: 25, discountPercent: 20 }],
    isBestSeller: true, isNewArrival: false, createdAt: "2024-01-10T00:00:00Z",
  },
  // Hoodies & Jackets
  {
    id: "prod-003", slug: "premium-pullover-hoodie", name: "Premium Pullover Hoodie",
    description: "80% cotton / 20% polyester fleece. Double-lined hood, kangaroo pocket, and ribbed cuffs. Ideal for team gear.",
    category: "Hoodies & Jackets", tags: ["hoodie", "clothing", "bestseller"],
    images: ["https://picsum.photos/seed/hoodie1/600/600", "https://picsum.photos/seed/hoodie2/600/600"],
    variants: [
      { id: "v003-1", color: "Black", colorHex: "#111827", size: "S", stock: 120, price: 49.99 },
      { id: "v003-2", color: "Black", colorHex: "#111827", size: "M", stock: 180, price: 49.99 },
      { id: "v003-3", color: "Black", colorHex: "#111827", size: "L", stock: 150, price: 49.99 },
      { id: "v003-4", color: "Grey", colorHex: "#6B7280", size: "M", stock: 140, price: 49.99 },
      { id: "v003-5", color: "Navy Blue", colorHex: "#1E3A5F", size: "M", stock: 100, price: 49.99 },
      { id: "v003-6", color: "Maroon", colorHex: "#7F1D1D", size: "M", stock: 80, price: 49.99 },
    ],
    basePrice: 49.99,
    discountTiers: [{ minQty: 10, discountPercent: 10 }, { minQty: 25, discountPercent: 20 }, { minQty: 50, discountPercent: 35 }],
    isBestSeller: true, isNewArrival: false, createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "prod-004", slug: "fleece-zip-jacket", name: "Fleece Zip-Up Jacket",
    description: "Mid-weight 270gsm anti-pill fleece. Full-zip with cadet collar and two front pockets. Left chest and full-back decoration available.",
    category: "Hoodies & Jackets", tags: ["jacket", "fleece", "clothing"],
    images: ["https://picsum.photos/seed/jacket1/600/600", "https://picsum.photos/seed/jacket2/600/600"],
    variants: [
      { id: "v004-1", color: "Black", colorHex: "#111827", size: "S", stock: 100, price: 64.99 },
      { id: "v004-2", color: "Black", colorHex: "#111827", size: "M", stock: 140, price: 64.99 },
      { id: "v004-3", color: "Navy Blue", colorHex: "#1E3A5F", size: "M", stock: 90, price: 64.99 },
      { id: "v004-4", color: "Grey", colorHex: "#6B7280", size: "M", stock: 80, price: 64.99 },
    ],
    basePrice: 64.99,
    discountTiers: [{ minQty: 6, discountPercent: 10 }, { minQty: 12, discountPercent: 20 }],
    isBestSeller: false, isNewArrival: true, createdAt: "2024-04-20T00:00:00Z",
  },
  // Caps & Hats
  {
    id: "prod-005", slug: "structured-snapback-cap", name: "Structured Snapback Cap",
    description: "6-panel structured cap with flat bill and snapback closure. Perfect embroidery surface for logos and text.",
    category: "Caps & Hats", tags: ["cap", "hat", "accessories"],
    images: ["https://picsum.photos/seed/cap1/600/600", "https://picsum.photos/seed/cap2/600/600"],
    variants: [
      { id: "v005-1", color: "Black", colorHex: "#111827", size: "One Size", stock: 300, price: 19.99 },
      { id: "v005-2", color: "Navy Blue", colorHex: "#1E3A5F", size: "One Size", stock: 250, price: 19.99 },
      { id: "v005-3", color: "White", colorHex: "#F9FAFB", size: "One Size", stock: 200, price: 19.99 },
      { id: "v005-4", color: "Red", colorHex: "#DC2626", size: "One Size", stock: 150, price: 19.99 },
    ],
    basePrice: 19.99,
    discountTiers: [{ minQty: 10, discountPercent: 10 }, { minQty: 50, discountPercent: 25 }],
    isBestSeller: false, isNewArrival: true, createdAt: "2024-03-01T00:00:00Z",
  },
  // Bottles & Mugs
  {
    id: "prod-006", slug: "ceramic-coffee-mug-11oz", name: "Ceramic Coffee Mug 11oz",
    description: "Classic white ceramic mug. Dishwasher and microwave safe. Crisp full-color printing wraps 360°. Great for office gifts.",
    category: "Bottles & Mugs", tags: ["mug", "coffee", "bestseller", "gift"],
    images: ["https://picsum.photos/seed/mug1/600/600", "https://picsum.photos/seed/mug2/600/600"],
    variants: [
      { id: "v006-1", color: "White", colorHex: "#F9FAFB", size: "11oz", stock: 500, price: 14.99 },
      { id: "v006-2", color: "White", colorHex: "#F9FAFB", size: "15oz", stock: 300, price: 17.99 },
      { id: "v006-3", color: "Black", colorHex: "#111827", size: "11oz", stock: 200, price: 14.99 },
    ],
    basePrice: 14.99,
    discountTiers: [{ minQty: 12, discountPercent: 10 }, { minQty: 48, discountPercent: 20 }, { minQty: 100, discountPercent: 35 }],
    isBestSeller: true, isNewArrival: false, createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "prod-007", slug: "stainless-tumbler-20oz", name: "Stainless Steel Tumbler 20oz",
    description: "Double-wall vacuum insulated. Keeps drinks cold 24 hrs, hot 12 hrs. Powder-coated finish is laser-engravable. BPA free.",
    category: "Bottles & Mugs", tags: ["tumbler", "drinkware", "eco"],
    images: ["https://picsum.photos/seed/tumbler1/600/600", "https://picsum.photos/seed/tumbler2/600/600"],
    variants: [
      { id: "v007-1", color: "Black", colorHex: "#111827", size: "20oz", stock: 200, price: 29.99 },
      { id: "v007-2", color: "Silver", colorHex: "#9CA3AF", size: "20oz", stock: 180, price: 29.99 },
      { id: "v007-3", color: "Navy Blue", colorHex: "#1E3A5F", size: "20oz", stock: 150, price: 29.99 },
      { id: "v007-4", color: "Rose Gold", colorHex: "#D4A5A5", size: "20oz", stock: 120, price: 31.99 },
    ],
    basePrice: 29.99,
    discountTiers: [{ minQty: 10, discountPercent: 10 }, { minQty: 25, discountPercent: 20 }],
    isBestSeller: false, isNewArrival: true, createdAt: "2024-04-01T00:00:00Z",
  },
  // Bags & Backpacks
  {
    id: "prod-008", slug: "canvas-tote-bag", name: "Canvas Tote Bag",
    description: "Heavy-duty 10oz canvas. Reinforced handles, gusset bottom for extra capacity. Excellent for large logo prints.",
    category: "Bags & Backpacks", tags: ["bag", "tote", "eco", "bestseller"],
    images: ["https://picsum.photos/seed/tote1/600/600", "https://picsum.photos/seed/tote2/600/600"],
    variants: [
      { id: "v008-1", color: "Natural", colorHex: "#D4C5A9", size: "Standard", stock: 400, price: 16.99 },
      { id: "v008-2", color: "Black", colorHex: "#111827", size: "Standard", stock: 300, price: 16.99 },
      { id: "v008-3", color: "Navy Blue", colorHex: "#1E3A5F", size: "Standard", stock: 250, price: 16.99 },
    ],
    basePrice: 16.99,
    discountTiers: [{ minQty: 10, discountPercent: 10 }, { minQty: 50, discountPercent: 25 }, { minQty: 100, discountPercent: 35 }],
    isBestSeller: true, isNewArrival: false, createdAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "prod-009", slug: "drawstring-backpack", name: "Drawstring Backpack",
    description: "Lightweight polyester drawstring bag. Cinch top closure, dual strap. Perfect for gyms, schools, trade shows.",
    category: "Bags & Backpacks", tags: ["bag", "backpack", "sport"],
    images: ["https://picsum.photos/seed/drawstring1/600/600", "https://picsum.photos/seed/drawstring2/600/600"],
    variants: [
      { id: "v009-1", color: "Black", colorHex: "#111827", size: "One Size", stock: 350, price: 12.99 },
      { id: "v009-2", color: "Navy Blue", colorHex: "#1E3A5F", size: "One Size", stock: 280, price: 12.99 },
      { id: "v009-3", color: "Red", colorHex: "#DC2626", size: "One Size", stock: 200, price: 12.99 },
    ],
    basePrice: 12.99,
    discountTiers: [{ minQty: 25, discountPercent: 15 }, { minQty: 100, discountPercent: 30 }],
    isBestSeller: false, isNewArrival: false, createdAt: "2024-02-01T00:00:00Z",
  },
  // Office & Stationery
  {
    id: "prod-010", slug: "spiral-notebook-a5", name: "Spiral Notebook A5",
    description: "100 ruled pages, 80gsm paper. Sturdy cardstock cover with full-bleed printing. Great for branded stationery.",
    category: "Office & Stationery", tags: ["notebook", "stationery", "office", "gift"],
    images: ["https://picsum.photos/seed/notebook1/600/600", "https://picsum.photos/seed/notebook2/600/600"],
    variants: [
      { id: "v010-1", color: "Black", colorHex: "#111827", size: "A5", stock: 500, price: 12.99 },
      { id: "v010-2", color: "White", colorHex: "#F9FAFB", size: "A5", stock: 400, price: 12.99 },
      { id: "v010-3", color: "Navy Blue", colorHex: "#1E3A5F", size: "A5", stock: 300, price: 12.99 },
    ],
    basePrice: 12.99,
    discountTiers: [{ minQty: 20, discountPercent: 10 }, { minQty: 50, discountPercent: 20 }, { minQty: 100, discountPercent: 30 }],
    isBestSeller: false, isNewArrival: false, createdAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "prod-011", slug: "ballpoint-pen-set", name: "Ballpoint Pen Set (10-pack)",
    description: "Smooth-writing 1.0mm ballpoint pens. Laser-engraved barrel with your logo. Consistent, professional impression.",
    category: "Office & Stationery", tags: ["pen", "stationery", "office", "gift"],
    images: ["https://picsum.photos/seed/pen1/600/600", "https://picsum.photos/seed/pen2/600/600"],
    variants: [
      { id: "v011-1", color: "Black", colorHex: "#111827", size: "10-pack", stock: 500, price: 18.99 },
      { id: "v011-2", color: "Silver", colorHex: "#9CA3AF", size: "10-pack", stock: 300, price: 18.99 },
    ],
    basePrice: 18.99,
    discountTiers: [{ minQty: 5, discountPercent: 10 }, { minQty: 20, discountPercent: 25 }],
    isBestSeller: false, isNewArrival: false, createdAt: "2024-02-05T00:00:00Z",
  },
  // Travel & Tech
  {
    id: "prod-012", slug: "custom-phone-case", name: "Custom Phone Case",
    description: "Slim hard shell case with vibrant full-color printing. Scratch-resistant matte finish. Precise cutouts for all buttons.",
    category: "Travel & Tech", tags: ["tech", "phone", "accessories"],
    images: ["https://picsum.photos/seed/phonecase1/600/600", "https://picsum.photos/seed/phonecase2/600/600"],
    variants: [
      { id: "v012-1", color: "Clear", colorHex: "#E5E7EB", size: "iPhone 15", stock: 200, price: 21.99 },
      { id: "v012-2", color: "Clear", colorHex: "#E5E7EB", size: "iPhone 15 Pro", stock: 180, price: 21.99 },
      { id: "v012-3", color: "Black", colorHex: "#111827", size: "iPhone 15", stock: 120, price: 21.99 },
    ],
    basePrice: 21.99,
    discountTiers: [{ minQty: 20, discountPercent: 15 }],
    isBestSeller: false, isNewArrival: true, createdAt: "2024-04-15T00:00:00Z",
  },
  // Eco-friendly
  {
    id: "prod-013", slug: "eco-water-bottle-500ml", name: "Eco Water Bottle 500ml",
    description: "BPA-free Tritan plastic. Leak-proof lid, wide mouth. Made from recycled materials. Show your brand's planet-first values.",
    category: "Eco-friendly", tags: ["eco", "bottle", "sustainable"],
    images: ["https://picsum.photos/seed/bottle1/600/600", "https://picsum.photos/seed/bottle2/600/600"],
    variants: [
      { id: "v013-1", color: "Green", colorHex: "#166534", size: "500ml", stock: 300, price: 22.99 },
      { id: "v013-2", color: "Navy Blue", colorHex: "#1E3A5F", size: "500ml", stock: 250, price: 22.99 },
      { id: "v013-3", color: "Clear", colorHex: "#E5E7EB", size: "500ml", stock: 200, price: 22.99 },
    ],
    basePrice: 22.99,
    discountTiers: [{ minQty: 10, discountPercent: 10 }, { minQty: 50, discountPercent: 25 }],
    isBestSeller: false, isNewArrival: false, createdAt: "2024-02-20T00:00:00Z",
  },
  // Jerseys & Sportswear
  {
    id: "prod-014", slug: "performance-sports-jersey", name: "Performance Sports Jersey",
    description: "100% polyester moisture-wicking fabric. Sublimation-ready for full-color all-over prints. Ideal for sports teams.",
    category: "Jerseys & Sportswear", tags: ["jersey", "sport", "team"],
    images: ["https://picsum.photos/seed/jersey1/600/600", "https://picsum.photos/seed/jersey2/600/600"],
    variants: [
      { id: "v014-1", color: "White", colorHex: "#F9FAFB", size: "S", stock: 150, price: 34.99 },
      { id: "v014-2", color: "White", colorHex: "#F9FAFB", size: "M", stock: 200, price: 34.99 },
      { id: "v014-3", color: "Black", colorHex: "#111827", size: "M", stock: 180, price: 34.99 },
      { id: "v014-4", color: "Royal Blue", colorHex: "#1D4ED8", size: "M", stock: 150, price: 34.99 },
    ],
    basePrice: 34.99,
    discountTiers: [{ minQty: 10, discountPercent: 15 }, { minQty: 25, discountPercent: 25 }],
    isBestSeller: false, isNewArrival: false, createdAt: "2024-02-15T00:00:00Z",
  },
  // Corporate Gifting
  {
    id: "prod-015", slug: "premium-gift-box-set", name: "Premium Corporate Gift Box",
    description: "Curated gift set in a branded box. Includes notebook, pen, mug, and tote bag. Perfect for client appreciation and onboarding.",
    category: "Corporate Gifting", tags: ["gift", "corporate", "premium", "bestseller"],
    images: ["https://picsum.photos/seed/giftbox1/600/600", "https://picsum.photos/seed/giftbox2/600/600"],
    variants: [
      { id: "v015-1", color: "Black", colorHex: "#111827", size: "Standard", stock: 100, price: 79.99 },
      { id: "v015-2", color: "Navy Blue", colorHex: "#1E3A5F", size: "Standard", stock: 80, price: 79.99 },
    ],
    basePrice: 79.99,
    discountTiers: [{ minQty: 10, discountPercent: 15 }, { minQty: 25, discountPercent: 25 }],
    isBestSeller: true, isNewArrival: false, createdAt: "2024-01-25T00:00:00Z",
  },
  // Uniforms & Workwear
  {
    id: "prod-016", slug: "workwear-polo-shirt", name: "Premium Workwear Polo",
    description: "Durable poly-cotton blend. Double-stitched seams, wrinkle-resistant. Available in custom colors. Perfect for uniforms.",
    category: "Uniforms & Workwear", tags: ["uniform", "workwear", "polo"],
    images: ["https://picsum.photos/seed/workwear1/600/600", "https://picsum.photos/seed/workwear2/600/600"],
    variants: [
      { id: "v016-1", color: "Black", colorHex: "#111827", size: "S", stock: 200, price: 32.99 },
      { id: "v016-2", color: "Black", colorHex: "#111827", size: "M", stock: 250, price: 32.99 },
      { id: "v016-3", color: "Navy Blue", colorHex: "#1E3A5F", size: "M", stock: 200, price: 32.99 },
      { id: "v016-4", color: "White", colorHex: "#F9FAFB", size: "M", stock: 180, price: 32.99 },
    ],
    basePrice: 32.99,
    discountTiers: [{ minQty: 10, discountPercent: 10 }, { minQty: 50, discountPercent: 25 }],
    isBestSeller: false, isNewArrival: false, createdAt: "2024-02-12T00:00:00Z",
  },
];

// ─── Mock Orders ──────────────────────────────────────────────────────────────

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord-aabbcc001", userId: "user-buyer-001",
    items: [
      { productId: "prod-001", variantId: "v001-2", name: "Classic Unisex T-Shirt", image: "https://picsum.photos/seed/tshirt1/600/600", color: "Black", size: "M", quantity: 25, unitPrice: 19.99 },
      { productId: "prod-006", variantId: "v006-1", name: "Ceramic Coffee Mug 11oz", image: "https://picsum.photos/seed/mug1/600/600", color: "White", size: "11oz", quantity: 12, unitPrice: 13.49 },
    ],
    status: "SHIPPED", totalAmount: 661.63,
    shippingAddress: { line1: "123 Main St", city: "New York", state: "NY", country: "USA", postalCode: "10001" },
    createdAt: "2026-04-10T09:00:00Z", updatedAt: "2026-04-15T14:00:00Z",
  },
  {
    id: "ord-ddeeff002", userId: "user-buyer-001",
    items: [
      { productId: "prod-003", variantId: "v003-2", name: "Premium Pullover Hoodie", image: "https://picsum.photos/seed/hoodie1/600/600", color: "Black", size: "M", quantity: 10, unitPrice: 44.99 },
    ],
    status: "DELIVERED", totalAmount: 449.90,
    shippingAddress: { line1: "456 Oak Ave", city: "Los Angeles", state: "CA", country: "USA", postalCode: "90001" },
    createdAt: "2026-03-20T11:00:00Z", updatedAt: "2026-03-28T16:00:00Z",
  },
  {
    id: "ord-gghhii003", userId: "user-admin-001",
    items: [
      { productId: "prod-008", variantId: "v008-1", name: "Canvas Tote Bag", image: "https://picsum.photos/seed/tote1/600/600", color: "Natural", size: "Standard", quantity: 50, unitPrice: 12.74 },
    ],
    status: "PROCESSING", totalAmount: 637.00,
    shippingAddress: { line1: "789 Brand Blvd", city: "Chicago", state: "IL", country: "USA", postalCode: "60601" },
    createdAt: "2026-04-25T08:30:00Z", updatedAt: "2026-04-26T10:00:00Z",
  },
  {
    id: "ord-jjkkll004", userId: "user-buyer-001",
    items: [
      { productId: "prod-007", variantId: "v007-1", name: "Stainless Steel Tumbler 20oz", image: "https://picsum.photos/seed/tumbler1/600/600", color: "Black", size: "20oz", quantity: 5, unitPrice: 29.99 },
    ],
    status: "PENDING", totalAmount: 149.95,
    shippingAddress: { line1: "321 Park Ln", city: "Austin", state: "TX", country: "USA", postalCode: "73301" },
    createdAt: "2026-04-28T15:00:00Z", updatedAt: "2026-04-28T15:00:00Z",
  },
];

// ─── Mock Coupons ─────────────────────────────────────────────────────────────

export const MOCK_COUPONS: Coupon[] = [
  { id: "coupon-001", code: "WELCOME20", discountPercent: 20, maxUses: 100, usedCount: 34, expiresAt: "2026-12-31T00:00:00Z", active: true },
  { id: "coupon-002", code: "BULK15", discountPercent: 15, maxUses: 500, usedCount: 127, expiresAt: "2026-06-30T00:00:00Z", active: true },
  { id: "coupon-003", code: "SAVE10", discountPercent: 10, maxUses: 200, usedCount: 200, expiresAt: "2025-12-31T00:00:00Z", active: false },
];

export const MOCK_STATS = {
  totalProducts: MOCK_PRODUCTS.length,
  totalOrders: MOCK_ORDERS.length,
  totalUsers: MOCK_USERS.length,
  totalRevenue: MOCK_ORDERS.reduce((s, o) => s + o.totalAmount, 0),
};

export const MOCK_ANALYTICS = {
  revenueByMonth: [
    { month: "Nov", revenue: 8200 }, { month: "Dec", revenue: 14500 },
    { month: "Jan", revenue: 9800 }, { month: "Feb", revenue: 11200 },
    { month: "Mar", revenue: 13400 }, { month: "Apr", revenue: 15800 },
  ],
  ordersByStatus: [
    { status: "PENDING", count: 12 }, { status: "CONFIRMED", count: 8 },
    { status: "PROCESSING", count: 15 }, { status: "SHIPPED", count: 22 },
    { status: "DELIVERED", count: 48 }, { status: "CANCELLED", count: 5 },
  ],
  topProducts: [
    { name: "Classic T-Shirt", sold: 580 }, { name: "Pullover Hoodie", sold: 420 },
    { name: "Coffee Mug", sold: 390 }, { name: "Canvas Tote", sold: 310 },
    { name: "Snapback Cap", sold: 270 },
  ],
};
