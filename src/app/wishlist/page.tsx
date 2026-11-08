
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

type Product = {
  id: string;
  name: string;
  sku?: string;
  price: string | number;
  discountPrice?: string | number | null;
  stock: number;
  images?: string[];
  isActive?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function formatPrice(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

function getSellingPrice(product: Product) {
  return Number(product.discountPrice ?? product.price);
}

export default function WishlistPage() {
  const { wishlist, removeItem, clearItems } = useWishlist();
  const { addItem } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadWishlistProducts() {
      setLoading(true);
      setError("");

      try {
        const results = await Promise.all(
          wishlist.map(async (item) => {
            const response = await fetch(
              `${API_URL}/api/products/${item.productId}`
            );

            if (!response.ok) return null;

            const result = await response.json();
            return result.data as Product;
          })
        );

        if (!cancelled) {
          setProducts(
            results.filter(
              (product): product is Product =>
                product !== null && product.isActive !== false
            )
          );
        }
      } catch {
        if (!cancelled) {
          setError("Wishlist products load করা যাচ্ছে না। আবার চেষ্টা করো।");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadWishlistProducts();

    return () => {
      cancelled = true;
    };
  }, [wishlist]);

  function handleAddToCart(product: Product) {
    if (product.stock < 1) return;

    addItem(product.id, 1);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-16">
        <p className="text-center text-gray-500">Loading wishlist...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-10 sm:py-14">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-gray-500">Your favorites</p>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            My Wishlist
          </h1>
        </div>

        {products.length > 0 && (
          <button
            type="button"
            onClick={clearItems}
            className="text-sm font-medium text-gray-500 underline underline-offset-4 transition hover:text-[#7f1d2d]"
          >
            Clear all
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 px-5 py-16 text-center">
          <Heart size={38} className="mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900">
            Your wishlist is empty
          </h2>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            পছন্দের পণ্যগুলো Wishlist-এ যোগ করলে এখানে দেখতে পাবে।
          </p>
          <Link
            href="/shop"
            className="mt-6 rounded-full bg-[#7f1d2d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#641624]"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const image = product.images?.[0];
            const price = getSellingPrice(product);

            return (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center bg-gray-50">
                  {image ? (
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-4"
                    />
                  ) : (
                    <ShoppingBag size={42} className="text-gray-300" />
                  )}

                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="absolute right-3 top-3 rounded-full bg-white p-2 text-gray-600 shadow-sm transition hover:text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="p-5">
                  <Link
                    href={`/products/${product.id}`}
                    className="font-semibold text-gray-900 transition hover:text-[#7f1d2d]"
                  >
                    {product.name}
                  </Link>

                  {product.sku && (
                    <p className="mt-1 text-xs text-gray-400">
                      SKU: {product.sku}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(price)}
                    </span>

                    {product.discountPrice != null && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(Number(product.price))}
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-2 text-xs ${
                      product.stock > 0 ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {product.stock > 0
                      ? `In stock (${product.stock})`
                      : "Out of stock"}
                  </p>

                  <button
                    type="button"
                    disabled={product.stock < 1}
                    onClick={() => handleAddToCart(product)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#7f1d2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#641624] disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    <ShoppingBag size={17} />
                    Add to Cart
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}