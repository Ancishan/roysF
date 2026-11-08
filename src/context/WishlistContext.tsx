"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type WishlistItem = {
  productId: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearItems: () => void;
  wishlistCount: number;
};

const STORAGE_KEY = "roys-wishlist";

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // -----------------------------------------
  // Load wishlist from LocalStorage
  // -----------------------------------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setWishlist(parsed as WishlistItem[]);
        }
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      setWishlist([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  // -----------------------------------------
  // Save wishlist to LocalStorage
  // -----------------------------------------
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(wishlist)
      );
    } catch (error) {
      console.error("Failed to save wishlist:", error);
    }
  }, [wishlist, hydrated]);

  // -----------------------------------------
  // Add item
  // -----------------------------------------
  const addItem = useCallback((productId: string) => {
    setWishlist((current) => {
      // Already exists
      if (
        current.some(
          (item) => item.productId === productId
        )
      ) {
        return current;
      }

      return [
        ...current,
        {
          productId,
        },
      ];
    });
  }, []);

  // -----------------------------------------
  // Remove item
  // -----------------------------------------
  const removeItem = useCallback((productId: string) => {
    setWishlist((current) =>
      current.filter(
        (item) => item.productId !== productId
      )
    );
  }, []);

  // -----------------------------------------
  // Clear all wishlist
  // -----------------------------------------
  const clearItems = useCallback(() => {
    setWishlist([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addItem,
        removeItem,
        clearItems,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}