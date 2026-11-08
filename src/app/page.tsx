"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import { useWishlist } from "@/context/WishlistContext";

type Product = {
  id: string;

  name: string;

  description?: string | null;

  price: number | string;

  discountPrice?: number | string | null;

  images?: {
    id?: string;
    url: string;
    altText?: string | null;
    isPrimary?: boolean;
  }[] | null;

  stock?: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function formatPrice(value: number | string) {
  return `৳${Number(value).toLocaleString("en-BD")}`;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Wishlist
  const {
    wishlist,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
  } = useWishlist();

  useEffect(() => {
    async function fetchProducts() {
      try {
        if (!API_URL) {
          throw new Error("NEXT_PUBLIC_API_URL পাওয়া যায়নি।");
        }

        const response = await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
          throw new Error("Products load করা যায়নি।");
        }

        const result = await response.json();

        // API response:
        // { success, message, data: [...] }

        const productList = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : [];

        setProducts(productList);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "কিছু একটা সমস্যা হয়েছে।"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="bg-[#f8f1f2]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">

          {/* Hero Content */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#7f1d2d]">
              Welcome to ROYS
            </p>

            <h1 className="max-w-xl text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Find Your Style.
              <span className="block text-[#7f1d2d]">
                Shop with ROYS.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-gray-600">
              Discover products picked for your everyday style.
              Explore our latest collection and find something
              you love.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-flex rounded-md bg-[#7f1d2d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#641624]"
            >
              Shop Now
            </Link>
          </div>

          {/* Hero Visual */}
          <div className="flex min-h-64 items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm">
            <div>
              <p className="text-5xl font-bold tracking-widest text-[#7f1d2d]">
                ROYS
              </p>

              <p className="mt-3 text-sm text-gray-500">
                Your style, your choice.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
          PRODUCTS SECTION
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#7f1d2d]">
              Our Collection
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-sm font-semibold text-[#7f1d2d] transition hover:underline"
          >
            View All Products →
          </Link>

        </div>

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading && (
          <p className="py-12 text-center text-gray-500">
            Products loading...
          </p>
        )}

        {/* =====================================================
            ERROR
        ====================================================== */}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">

            <p className="text-sm text-red-700">
              {error}
            </p>

            <p className="mt-2 text-xs text-red-600">
              Backend server চালু আছে কি না এবং API URL ঠিক আছে
              কি না দেখো।
            </p>

          </div>
        )}

        {/* =====================================================
            EMPTY PRODUCTS
        ====================================================== */}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-lg border border-gray-200 p-10 text-center">

            <p className="font-medium text-gray-800">
              এখনো কোনো product পাওয়া যায়নি।
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Prisma Studio থেকে Product table-এ product যোগ করো।
            </p>

          </div>
        )}

        {/* =====================================================
            PRODUCT GRID
        ====================================================== */}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {products.map((product) => {

              const sellingPrice =
                product.discountPrice != null
                  ? product.discountPrice
                  : product.price;

              const hasDiscount =
                product.discountPrice != null &&
                Number(product.discountPrice) <
                  Number(product.price);

              const image = product.images?.[0]?.url;

              // Check wishlist status
              const isWishlisted = wishlist.some(
                (item) => item.productId === product.id
              );

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* =================================================
                      PRODUCT IMAGE
                  ================================================== */}

                  <div className="relative aspect-square overflow-hidden bg-gray-100">

                    {/* Image */}
                    <Link
                      href={`/products/${product.id}`}
                      className="block h-full w-full"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-400">
                          No image available
                        </div>
                      )}
                    </Link>

                    {/* =================================================
                        WISHLIST BUTTON
                    ================================================== */}

                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        if (isWishlisted) {
                          removeFromWishlist(product.id);
                        } else {
                          addToWishlist(product.id);
                        }
                      }}
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      aria-pressed={isWishlisted}
                      className={`absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm transition-all duration-300 ${
                        isWishlisted
                          ? "text-[#7f1d2d] shadow-[0_6px_20px_rgba(127,29,45,0.25)]"
                          : "text-gray-700 shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:scale-110 hover:text-[#7f1d2d] hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)]"
                      }`}
                    >
                      <Heart
                        size={20}
                        strokeWidth={1.8}
                        fill={
                          isWishlisted
                            ? "#7f1d2d"
                            : "none"
                        }
                      />
                    </button>

                    {/* Discount Badge */}
                    {hasDiscount && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-[#7f1d2d] px-3 py-1 text-xs font-semibold text-white shadow-md">
                        Sale
                      </span>
                    )}

                  </div>

                  {/* =================================================
                      PRODUCT INFORMATION
                  ================================================== */}

                  <div className="p-4">

                    {/* Product Name */}
                    <Link
                      href={`/products/${product.id}`}
                    >
                      <h3 className="line-clamp-2 min-h-12 font-semibold text-gray-900 transition hover:text-[#7f1d2d]">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Description */}
                    {product.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {product.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">

                      <span className="text-lg font-bold text-[#7f1d2d]">
                        {formatPrice(sellingPrice)}
                      </span>

                      {hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}

                    </div>

                  </div>

                  {/* =================================================
                      VIEW DETAILS BUTTON
                  ================================================== */}

                  <div className="px-4 pb-4">

                    <Link
                      href={`/products/${product.id}`}
                      className="block rounded-md border border-[#7f1d2d] px-4 py-2.5 text-center text-sm font-semibold text-[#7f1d2d] transition hover:bg-[#7f1d2d] hover:text-white"
                    >
                      View Details
                    </Link>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </section>

    </main>
  );
}