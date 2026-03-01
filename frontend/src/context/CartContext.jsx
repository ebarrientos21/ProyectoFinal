import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(() =>
    JSON.parse(localStorage.getItem('carrito') || '[]')
  )

  const saveCart = (items) => {
    setCarrito(items)
    localStorage.setItem('carrito', JSON.stringify(items))
  }

  const addToCart = (comic) => {
    setCarrito(prev => {
      const exists = prev.find(i => i._id === comic._id)
      const updated = exists
        ? prev.map(i => i._id === comic._id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...comic, qty: 1 }]
      localStorage.setItem('carrito', JSON.stringify(updated))
      return updated
    })
  }

  const changeQty = (id, delta) => {
    setCarrito(prev => {
      const updated = prev
        .map(i => i._id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
      localStorage.setItem('carrito', JSON.stringify(updated))
      return updated
    })
  }

  const removeItem = (id) => {
    setCarrito(prev => {
      const updated = prev.filter(i => i._id !== id)
      localStorage.setItem('carrito', JSON.stringify(updated))
      return updated
    })
  }

  const clearCart = () => saveCart([])

  const totalItems = carrito.reduce((s, i) => s + i.qty, 0)
  const totalPrice = carrito.reduce((s, i) => s + i.precio * i.qty, 0)

  return (
    <CartContext.Provider value={{ carrito, addToCart, changeQty, removeItem, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)