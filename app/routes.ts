import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // Storefront
  layout("layouts/storefront-layout.tsx", [
    index("routes/home.tsx"),
    route("merchandise", "routes/merchandise/index.tsx"),
    route("merchandise/:slug", "routes/merchandise/product.tsx"),
    route("cart", "routes/cart.tsx"),
    route("checkout", "routes/checkout.tsx"),
    route("orders", "routes/orders.tsx"),
    route("orders/:id", "routes/order-tracking.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
  ]),

  // Admin (protected)
  layout("layouts/admin-layout.tsx", [
    route("admin", "routes/admin/dashboard.tsx"),
    route("admin/products", "routes/admin/products.tsx"),
    route("admin/products/new", "routes/admin/products-new.tsx"),
    route("admin/products/:id", "routes/admin/products-edit.tsx"),
    route("admin/orders", "routes/admin/orders.tsx"),
    route("admin/orders/:id", "routes/admin/orders-detail.tsx"),
    route("admin/users", "routes/admin/users.tsx"),
    route("admin/discounts", "routes/admin/discounts.tsx"),
    route("admin/analytics", "routes/admin/analytics.tsx"),
  ]),
] satisfies RouteConfig;
