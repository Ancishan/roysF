import type { CartItem } from "@/types/cart";

const CART_KEY = "roys-cart";

export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const cart = localStorage.getItem(CART_KEY);

  if (!cart) {
    return [];
  }

  return JSON.parse(cart);
};

export const addToCart = (
  productId: string,
  quantity: number = 1
) => {
  const cart = getCart();

  const existingItem = cart.find(
    (item) => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );
};

export const updateCartQuantity = (
  productId: string,
  quantity: number
) => {
  const cart = getCart();

  const item = cart.find(
    (item) => item.productId === productId
  );

  if (!item) {
    return;
  }

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  item.quantity = quantity;

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );
};

export const removeFromCart = (
  productId: string
) => {
  const cart = getCart().filter(
    (item) => item.productId !== productId
  );

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};