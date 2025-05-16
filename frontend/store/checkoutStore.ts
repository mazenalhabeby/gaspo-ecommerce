import {create} from "zustand"
import {persist} from "zustand/middleware"

interface CheckoutState {
  user: {
    name: string
    phone: string
    email: string
  }
  address: {
    line: string
    city: string
    zip: string
    country: string
    note: string
  }
  paymentMethod: "card" | "paypal" | null

  // Actions
  setUser: (data: Partial<CheckoutState["user"]>) => void
  setAddress: (data: Partial<CheckoutState["address"]>) => void
  setPaymentMethod: (method: "card" | "paypal") => void
  resetCheckout: () => void
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      user: {
        name: "",
        phone: "",
        email: "",
      },
      address: {
        line: "",
        city: "",
        zip: "",
        country: "",
        note: "",
      },
      paymentMethod: null,

      // Merge user state instead of replacing
      setUser: (data) =>
        set((state) => ({
          user: {
            ...state.user,
            ...data,
          },
        })),

      // Merge address state instead of replacing
      setAddress: (data) =>
        set((state) => ({
          address: {
            ...state.address,
            ...data,
          },
        })),

      setPaymentMethod: (method) =>
        set(() => ({
          paymentMethod: method,
        })),

      resetCheckout: () =>
        set(() => ({
          user: {name: "", phone: "", email: ""},
          address: {line: "", city: "", zip: "", country: "", note: ""},
          paymentMethod: null,
        })),
    }),
    {
      name: "checkout-store",
    }
  )
)
