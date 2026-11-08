"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import api from "@/lib/axios";

export default function EditProductPage() {
  const params = useParams();

  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);

  const [brands, setBrands] = useState<any[]>([]);

  const [form, setForm] = useState<any>({
    name: "",

    slug: "",

    sku: "",

    categoryId: "",

    brandId: "",

    price: "",

    discountPrice: "",

    stock: "",

    lowStockAlert: "",

    description: "",

    shortDescription: "",

    material: "",

    warranty: "",

    isActive: true,

    isFeatured: false,

    isNewArrival: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productRes, categoryRes, brandRes] = await Promise.all([
          api.get(`/products/${id}`),

          api.get("/categories"),

          api.get("/brands"),
        ]);

        const product = productRes.data.data;

        setCategories(categoryRes.data.data);

        setBrands(brandRes.data.data);

        setForm({
          name: product.name || "",

          slug: product.slug || "",

          sku: product.sku || "",

          categoryId: product.categoryId || "",

          brandId: product.brandId || "",

          price: product.price || "",

          discountPrice: product.discountPrice || "",

          stock: product.stock || "",

          lowStockAlert: product.lowStockAlert || "",

          description: product.description || "",

          shortDescription: product.shortDescription || "",

          material: product.material || "",

          warranty: product.warranty || "",

          isActive: product.isActive,

          isFeatured: product.isFeatured,

          isNewArrival: product.isNewArrival,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {
      name,

      value,
    } = e.target;

    setForm({
      ...form,

      [name]: value,
    });
  };

  const updateProduct = async () => {
    try {
      setSaving(true);

      await api.patch(
        `/products/${id}`,

        {
          ...form,

          price: Number(form.price),

          discountPrice: form.discountPrice
            ? Number(form.discountPrice)
            : undefined,

          stock: Number(form.stock),

          lowStockAlert: Number(form.lowStockAlert),
        },
      );

      alert("Product updated successfully");

      router.push("/admin/products");

      router.refresh();
    } catch (error: any) {
      console.log(error);

      alert(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading Product...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>

      <div
        className="

bg-white

border

rounded-xl

p-6

space-y-6

"
      >
        {/* NAME */}

        <div>
          <label className="block mb-2 font-medium">Product Name</label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="

border

w-full

p-3

rounded-lg

"
          />
        </div>

        {/* SKU SLUG */}

        <div
          className="

grid

grid-cols-1

md:grid-cols-2

gap-5

"
        >
          <div>
            <label className="block mb-2 font-medium">SKU</label>

            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              className="border w-full p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Slug</label>

            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="border w-full p-3 rounded-lg"
            />
          </div>
        </div>

        {/* CATEGORY BRAND */}

        <div
          className="

grid

grid-cols-1

md:grid-cols-2

gap-5

"
        >
          <div>
            <label className="block mb-2 font-medium">Category</label>

            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm({
                  ...form,

                  categoryId: e.target.value,
                })
              }
              className="border w-full p-3 rounded-lg"
            >
              <option value="">Select Category</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Brand</label>

            <select
              value={form.brandId}
              onChange={(e) =>
                setForm({
                  ...form,

                  brandId: e.target.value,
                })
              }
              className="border w-full p-3 rounded-lg"
            >
              <option value="">Select Brand</option>

              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PRICE */}

        <div
          className="

grid

grid-cols-1

sm:grid-cols-2

lg:grid-cols-3

gap-5

"
        >
          <div>
            <label className="block mb-2 font-medium">Price (৳)</label>

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              className="border w-full p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Discount Price (৳)</label>

            <input
              name="discountPrice"
              value={form.discountPrice}
              onChange={handleChange}
              className="border w-full p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Stock Quantity</label>

            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="border w-full p-3 rounded-lg"
            />
          </div>
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="block mb-2 font-medium">Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="

border

w-full

p-3

rounded-lg

h-36

"
          />
        </div>

        {/* STATUS */}

        <div className="flex flex-wrap gap-6">
          <label>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({
                  ...form,

                  isActive: e.target.checked,
                })
              }
            />
            Active
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) =>
                setForm({
                  ...form,

                  isFeatured: e.target.checked,
                })
              }
            />
            Featured
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.isNewArrival}
              onChange={(e) =>
                setForm({
                  ...form,

                  isNewArrival: e.target.checked,
                })
              }
            />
            New Arrival
          </label>
        </div>

        <button
          onClick={updateProduct}
          disabled={saving}
          className="

bg-black

text-white

px-8

py-3

rounded-lg

"
        >
          {saving ? "Updating..." : "Update Product"}
        </button>
      </div>
    </div>
  );
}
