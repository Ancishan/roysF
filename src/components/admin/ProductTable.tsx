"use client";

import Link from "next/link";
import api from "@/lib/axios";

interface Props {
  products: any[];

  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function ProductTable({
  products,

  setProducts,
}: Props) {
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);

      alert("Product deleted successfully");

      // remove from UI instantly

      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error: any) {
      console.log(error);

      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div
      className="
bg-white
rounded-xl
border
p-6
"
    >
      <div
        className="
overflow-x-auto
"
      >
        <table
          className="
w-full
min-w-[900px]
"
        >
          <thead>
            <tr
              className="
border-b
text-gray-500
"
            >
              <th className="p-3 text-left">Image</th>

              <th className="p-3 text-left">Product</th>

              <th className="p-3 text-left">Category</th>

              <th className="p-3 text-left">Price</th>

              <th className="p-3 text-left">Stock</th>

              <th className="p-3 text-left">Status</th>

              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="
border-b
hover:bg-gray-50
"
              >
                <td className="p-3">
                  <img
                    src={product.images?.[0]?.url || "/placeholder.png"}
                    alt={product.name}
                    className="
w-14
h-14
object-cover
rounded-lg
border
"
                  />
                </td>

                <td className="p-3">
                  <div
                    className="
font-medium
"
                  >
                    {product.name}
                  </div>

                  <div
                    className="
text-xs
text-gray-500
"
                  >
                    SKU:
                    {product.sku}
                  </div>
                </td>

                <td className="p-3">{product.category?.name || "-"}</td>

                <td className="p-3">৳ {Number(product.price)}</td>

                <td className="p-3">
                  <span
                    className="
bg-green-100
text-green-700
px-3
py-1
rounded-full
text-xs
"
                  >
                    {product.stock}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className="
bg-green-100
text-green-700
px-3
py-1
rounded-full
text-xs
"
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-3">
                  <div
                    className="
flex
gap-2
"
                  >
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="
bg-blue-100
text-blue-700
px-3
py-1
rounded
text-xs
"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="
bg-red-100
text-red-700
px-3
py-1
rounded
text-xs
"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
