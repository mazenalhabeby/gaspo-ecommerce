import {create} from "zustand"

interface ProductState {
  products: Product[]
  toggleStatus: (id: string) => void
  deleteProduct: (id: string) => void
}

export interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
  active: boolean
}

export const useProductStore = create<ProductState>((set) => ({
  products: [
    {
      id: "1",
      name: "Coffee Maker",
      price: 49.99,
      imageUrl: "/images/coffee.jpg",
      active: true,
    },
    {
      id: "2",
      name: "MacBook Pro",
      price: 1999,
      imageUrl: "/images/macbook.jpg",
      active: false,
    },
  ],
  toggleStatus: (id) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? {...p, active: !p.active} : p
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}))
