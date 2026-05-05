/**
 * In-memory mock API.
 * Called by api.ts when VITE_USE_MOCK=true.
 * Mirrors the Spring Boot REST contract so swapping to the real API
 * is just flipping the flag in .env.
 */

import {
  MOCK_ANALYTICS,
  MOCK_COUPONS,
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  MOCK_STATS,
  MOCK_USERS,
} from "./data";
import type { Coupon, Order, OrderStatus, PaginatedResponse, Product, UserRole } from "~/types";

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

// simple in-memory mutable copies
let products = [...MOCK_PRODUCTS];
let orders = [...MOCK_ORDERS];
let coupons = [...MOCK_COUPONS];

function paginate<T>(items: T[], page = 0, size = 12): PaginatedResponse<T> {
  const start = page * size;
  return {
    data: items.slice(start, start + size),
    page,
    pageSize: size,
    total: items.length,
    totalPages: Math.ceil(items.length / size),
  };
}

export async function mockRequest<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  await delay();

  // ── Auth ──────────────────────────────────────────────────────────────────
  if (method === "POST" && path === "/auth/login") {
    const { email, password } = body as { email: string; password: string };
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw { message: "Invalid email or password.", status: 401 };
    const { password: _, ...safeUser } = user;
    return { token: `mock-jwt-${safeUser.id}`, user: safeUser } as T;
  }

  if (method === "POST" && path === "/auth/register") {
    const { fullName, email, password } = body as {
      fullName: string;
      email: string;
      password: string;
    };
    if (MOCK_USERS.find((u) => u.email === email)) {
      throw { message: "Email already registered.", status: 409 };
    }
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      role: "CUSTOMER" as UserRole,
      createdAt: new Date().toISOString(),
    };
    return { token: `mock-jwt-${newUser.id}`, user: newUser } as T;
  }

  // ── Products ──────────────────────────────────────────────────────────────
  if (method === "GET" && path === "/products") {
    const { category, colors, minPrice, maxPrice, search, sort, page } =
      (params ?? {}) as Record<string, string>;

    let filtered = [...products];

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (colors) {
      const colorList = colors.split(",").map((c) => c.trim().toLowerCase());
      filtered = filtered.filter((p) =>
        p.variants.some((v) => colorList.includes(v.color.toLowerCase()))
      );
    }
    if (minPrice) {
      filtered = filtered.filter((p) => p.basePrice >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.basePrice <= Number(maxPrice));
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sort === "price_asc") filtered.sort((a, b) => a.basePrice - b.basePrice);
    else if (sort === "price_desc") filtered.sort((a, b) => b.basePrice - a.basePrice);
    else if (sort === "newest") filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else if (sort === "best_seller") filtered = filtered.filter((p) => p.isBestSeller).concat(filtered.filter((p) => !p.isBestSeller));

    return paginate(filtered, page ? Number(page) : 0) as T;
  }

  if (method === "GET" && path.match(/^\/products\/[^/]+$/)) {
    const slug = path.split("/products/")[1];
    const product = products.find((p) => p.slug === slug || p.id === slug);
    if (!product) throw { message: "Product not found.", status: 404 };
    return product as T;
  }

  if (method === "POST" && path === "/products") {
    const newProduct: Product = {
      ...(body as Product),
      id: `prod-${Date.now()}`,
      images: ["https://picsum.photos/seed/newproduct/600/600"],
      createdAt: new Date().toISOString(),
    };
    products = [newProduct, ...products];
    return newProduct as T;
  }

  if (method === "PUT" && path.match(/^\/products\/[^/]+$/)) {
    const id = path.split("/products/")[1];
    products = products.map((p) =>
      p.id === id ? { ...p, ...(body as Partial<Product>) } : p
    );
    return products.find((p) => p.id === id) as T;
  }

  if (method === "DELETE" && path.match(/^\/products\/[^/]+$/)) {
    const id = path.split("/products/")[1];
    products = products.filter((p) => p.id !== id);
    return undefined as T;
  }

  // ── Orders ────────────────────────────────────────────────────────────────
  if (method === "GET" && path === "/orders") {
    const { page } = (params ?? {}) as Record<string, string>;
    return paginate(orders, page ? Number(page) : 0, 20) as T;
  }

  if (method === "GET" && path.match(/^\/orders\/[^/]+$/) && !path.includes("/status")) {
    const id = path.split("/orders/")[1];
    const order = orders.find((o) => o.id === id);
    if (!order) throw { message: "Order not found.", status: 404 };
    return order as T;
  }

  if (method === "POST" && path === "/orders") {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId: "user-buyer-001",
      status: "PENDING",
      totalAmount: 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...(body as Partial<Order>),
    };
    orders = [newOrder, ...orders];
    return newOrder as T;
  }

  if (method === "PATCH" && path.match(/^\/orders\/[^/]+\/status$/)) {
    const id = path.split("/orders/")[1].replace("/status", "");
    const { status } = body as { status: OrderStatus };
    orders = orders.map((o) =>
      o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
    );
    return orders.find((o) => o.id === id) as T;
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  if (method === "GET" && path === "/admin/stats") {
    return {
      ...MOCK_STATS,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((s, o) => s + o.totalAmount, 0),
    } as T;
  }

  if (method === "GET" && path === "/admin/users") {
    const safeUsers = MOCK_USERS.map(({ password: _, ...u }) => u);
    return paginate(safeUsers) as T;
  }

  if (method === "PATCH" && path.match(/^\/admin\/users\/[^/]+\/role$/)) {
    // role changes don't persist in this mock but returns success
    return undefined as T;
  }

  if (method === "GET" && path === "/admin/analytics") {
    return MOCK_ANALYTICS as T;
  }

  if (method === "GET" && path === "/admin/coupons") {
    return coupons as T;
  }

  if (method === "POST" && path === "/admin/coupons") {
    const newCoupon: Coupon = {
      id: `coupon-${Date.now()}`,
      usedCount: 0,
      active: true,
      ...(body as Partial<Coupon>),
    } as Coupon;
    coupons = [newCoupon, ...coupons];
    return newCoupon as T;
  }

  if (method === "PATCH" && path.match(/^\/admin\/coupons\/[^/]+$/)) {
    const id = path.split("/admin/coupons/")[1];
    coupons = coupons.map((c) =>
      c.id === id ? { ...c, ...(body as Partial<Coupon>) } : c
    );
    return coupons.find((c) => c.id === id) as T;
  }

  if (method === "DELETE" && path.match(/^\/admin\/coupons\/[^/]+$/)) {
    const id = path.split("/admin/coupons/")[1];
    coupons = coupons.filter((c) => c.id !== id);
    return undefined as T;
  }

  throw { message: `Mock: no handler for ${method} ${path}`, status: 404 };
}
