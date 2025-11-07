import React, { createContext, useContext, useMemo, useState } from 'react'
import type { Book } from '../types'

interface CartItem { book: Book; quantity: number }
interface CartContextType {
  items: CartItem[]
  add: (book: Book) => void
  remove: (bookId: string) => void
  setQty: (bookId: string, qty: number) => void
  clear: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  function add(book: Book) {
    setItems(prev => {
      const i = prev.findIndex(x => x.book.id === book.id)
      if (i >= 0) {
        const clone = [...prev]
        clone[i] = { ...clone[i], quantity: clone[i].quantity + 1 }
        return clone
      }
      return [...prev, { book, quantity: 1 }]
    })
  }

  function remove(bookId: string) {
    setItems(prev => prev.filter(x => x.book.id !== bookId))
  }

  function setQty(bookId: string, qty: number) {
    setItems(prev => prev.map(x => x.book.id === bookId ? { ...x, quantity: Math.max(1, qty) } : x))
  }

  function clear() { setItems([]) }

  const { totalItems, totalPrice } = useMemo(() => {
    const totals = items.reduce((acc, it) => {
      acc.items += it.quantity
      acc.price += it.quantity * (it.book.price ?? 0)
      return acc
    }, { items: 0, price: 0 })
    return { totalItems: totals.items, totalPrice: totals.price }
  }, [items])

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
