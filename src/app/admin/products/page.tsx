"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import api from "@/lib/axios";

import ProductTable from "@/components/admin/ProductTable";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");

        setProducts(res.data.data || res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-6">Loading Products...</div>;
  }

  return (
    <div
      className="
space-y-6
"
    >
      <div
        className="
flex
justify-between
items-center
"
      >
        <div>
          <h1
            className="
text-3xl
font-bold
"
          >
            Products
          </h1>

          <p
            className="
text-gray-500
"
          >
            Manage your products
          </p>
        </div>

        <Link
          href="/admin/products/add"
          className="
bg-black
text-white
px-5
py-3
rounded-lg
"
        >
          + Add Product
        </Link>
      </div>

      <ProductTable products={products} />
    </div>
  );
}
