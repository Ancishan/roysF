
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ProductImage {
  id?: string;
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
}

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  discountPrice?: number | string | null;
  images?: ProductImage[] | null;
  stock?: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function formatPrice(value: number | string) {
  return `৳${Number(value).toLocaleString("en-BD")}`;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
          throw new Error("Products load করা যায়নি।");
        }

        const result = await response.json();

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
      {/* Header */}
      <section className="bg-[#f8f1f2]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7f1d2d]">
            ROYS Collection
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            All Products
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Explore all products available at ROYS.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <p className="text-gray-500">Products loading...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-700">{error}</p>

            <p className="mt-2 text-xs text-red-600">
              Backend server চালু আছে কি না এবং API URL ঠিক আছে কি না দেখো।
            </p>
          </div>
        )}

        {/* Empty Products */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-lg border border-gray-200 p-10 text-center">
            <p className="font-medium text-gray-800">
              এখনো কোনো product পাওয়া যায়নি।
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            {/* Product Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {products.length}
                </span>{" "}
                products
              </p>
            </div>

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

                // Homepage-এর মতো image object থেকে URL নেওয়া
                const image = product.images?.[0]?.url;

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${product.id}`}
                      className="block"
                    >
                      <div className="flex aspect-square items-center justify-center overflow-hidden bg-gray-100">
                        {image ? (
                          <img
                            src={image}
                            alt={
                              product.images?.[0]?.altText ||
                              product.name
                            }
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="px-4 text-center text-sm text-gray-400">
                            No image available
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <h2 className="line-clamp-2 min-h-12 font-semibold text-gray-900 hover:text-[#7f1d2d]">
                          {product.name}
                        </h2>
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

                      {/* Stock */}
                      {product.stock !== undefined && (
                        <p className="mt-2 text-xs text-gray-500">
                          {product.stock > 0
                            ? `${product.stock} items available`
                            : "Out of stock"}
                        </p>
                      )}

                      {/* View Details */}
                      <Link
                        href={`/products/${product.id}`}
                        className="mt-4 block rounded-md border border-[#7f1d2d] px-4 py-2.5 text-center text-sm font-semibold text-[#7f1d2d] transition hover:bg-[#7f1d2d] hover:text-white"
                      >
                        View Details
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
