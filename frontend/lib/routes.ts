export const publicRoutes = {
  home: "/",
}

export const dashboardRoutes = {
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

export const shoppingRoutes = {
  shop: "/shop",
  product: (slug: string) => `/shop/${slug}`,
  cart: "/shop/cart",
  checkout: "/shop/checkout",
  favorites: "/shop/favorites",
}
