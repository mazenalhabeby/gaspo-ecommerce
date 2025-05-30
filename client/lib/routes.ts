const publicRoutes = {
  home: "/",
}

const dashboardRoutes = {
  dashboard: "/admin",
  categories: "/admin/categories",
  category: (slug: string) => `/admin/categories/${slug}`,
  categoryEdit: (slug: string) => `/admin/categories/${slug}/edit`,
  categoryCreate: "/admin/categories/create",
  orders: "/admin/orders",
  products: "/admin/products",
  product: (slug: string) => `/admin/products/${slug}`,
  productEdit: (slug: string) => `/admin/products/${slug}/edit`,
  productCreate: "/admin/products/create",
  shipping: "/admin/shipping",
  users: "/admin/users",
  settings: "/admin/settings",
}

const shoppingRoutes = {
  shop: "/shop",
  product: (slug: string) => `/shop/${slug}`,
  cart: "/shop/cart",
  checkout: "/shop/checkout",
  favorites: "/shop/favorites",
}

const Routes = {
  public: publicRoutes,
  dashboard: dashboardRoutes,
  shopping: shoppingRoutes,
}

export {Routes, publicRoutes, dashboardRoutes, shoppingRoutes}

export type RoutesType = typeof Routes
export type PublicRoutesType = typeof publicRoutes
export type DashboardRoutesType = typeof dashboardRoutes
export type ShoppingRoutesType = typeof shoppingRoutes
export type RouteKey = keyof typeof Routes

export function route<
  K extends keyof typeof Routes,
  P extends keyof (typeof Routes)[K]
>(
  group: K,
  key: P,
  ...args: (typeof Routes)[K][P] extends (...args: unknown[]) => unknown
    ? Parameters<(typeof Routes)[K][P]>
    : []
): string {
  const value = Routes[group][key]
  if (typeof value === "function") {
    return (value as (...args: unknown[]) => string)(...args)
  }
  return value as string
}
