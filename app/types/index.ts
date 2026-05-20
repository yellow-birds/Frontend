// ─── Product ────────────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string;
  color: string;
  colorHex: string;
  size: string;
  stock: number;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  images: string[];
  variants: ProductVariant[];
  basePrice: number;
  discountTiers: DiscountTier[];
  isBestSeller: boolean;
  isNewArrival: boolean;
  createdAt: string;
}

export interface DiscountTier {
  minQty: number;
  discountPercent: number;
}

// ─── Cart ───────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

// ─── Order ──────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

// ─── User ───────────────────────────────────────────────────────────────────

export type UserRole = "CUSTOMER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  role: UserRole;
}

// ─── Address ─────────────────────────────────────────────────────────────────

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// ─── Discount / Coupon ──────────────────────────────────────────────────────

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}

// ─── API Response Wrappers ──────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
}

// ─── Filter State ────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  colors?: string[];
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "best_seller";
  page?: number;
}
