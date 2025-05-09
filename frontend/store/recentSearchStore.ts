import {create} from "zustand"
import {persist} from "zustand/middleware"

interface RecentSearchState {
  recent: string[]
  addRecent: (id: string) => void
  clearRecent: () => void
}

export const useRecentSearchStore = create<RecentSearchState>()(
  persist(
    (set) => ({
      recent: [],
      addRecent: (id) =>
        set((state) => ({
          recent: [id, ...state.recent.filter((r) => r !== id)].slice(0, 10),
        })),
      clearRecent: () => set({recent: []}),
    }),
    {
      name: "recent-searches",
    }
  )
)
