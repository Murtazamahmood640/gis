import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  brand: string;
  serviceType: string;
  vehicleCategory: string;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => setItems((prev) => [...prev, item]);
  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
