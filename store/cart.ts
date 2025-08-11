import { create } from 'zustand'
export type CartItem = { id: string; name: string; price: number; quantity: number }
type CartState = {
  items: CartItem[]
  add: (item: Omit<CartItem,'quantity'>) => void
  inc: (id: string) => void
  dec: (id: string) => void
  clear: () => void
}
export const useCart = create<CartState>((set, get)=> ({
  items: [],
  add: (it) => {
    const items = [...get().items]
    const idx = items.findIndex(x=>x.id===it.id)
    if (idx>-1) items[idx].quantity += 1
    else items.push({ ...it, quantity: 1 })
    set({ items })
  },
  inc: (id) => set({ items: get().items.map(i=> i.id===id ? {...i, quantity:i.quantity+1} : i ) }),
  dec: (id) => set({ items: get().items.flatMap(i=> i.id===id ? (i.quantity>1 ? [{...i, quantity:i.quantity-1}] : []) : [i]) }),
  clear: () => set({ items: [] })
}))
