"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { CartItem } from "@/types/cart";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "@/lib/cart";

interface CartContextType {
  cart: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  updateItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearItems: () => void;
  cartCount: number;
}

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const addItem = (
    productId: string,
    quantity: number = 1
  ) => {
    addToCart(productId, quantity);
    setCart(getCart());
  };

  const updateItem = (
    productId: string,
    quantity: number
  ) => {
    updateCartQuantity(productId, quantity);
    setCart(getCart());
  };

  const removeItem = (productId: string) => {
    removeFromCart(productId);
    setCart(getCart());
  };

  const clearItems = () => {
    clearCart();
    setCart([]);
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        updateItem,
        removeItem,
        clearItems,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};