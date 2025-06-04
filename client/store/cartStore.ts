import {create} from "zustand"
import {persist} from "zustand/middleware"

interface CartItem {
  id: string
  name: string
  image: string
  price: number
  slug: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) => {
        const exists = get().items.find((i) => i.id === item.id)
        if (exists) {
          set({
            items: get().items.map((i) =>
              i.id === item.id
                ? {...i, quantity: i.quantity + item.quantity}
                : i
            ),
          })
        } else {
          set({items: [...get().items, {...item, quantity: item.quantity}]})
        }
      },
      removeFromCart: (id) =>
        set((state) => ({items: state.items.filter((i) => i.id !== id)})),
      setQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? {...item, quantity: Math.max(1, quantity)} : item
          ),
        })),
      clearCart: () => set({items: []}),
    }),
    {name: "cart-storage"}
  )
)
