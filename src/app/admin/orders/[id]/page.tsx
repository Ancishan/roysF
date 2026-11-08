
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const SOURCES = [
  "DIRECT",
  "FACEBOOK",
  "INSTAGRAM",
  "TIKTOK",
  "WHATSAPP",
  "WEBSITE",
] as const;

type OrderStatus = (typeof STATUSES)[number];
type OrderSource = (typeof SOURCES)[number];

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  city: string;
  area?: string | null;
  subtotal: number | string;
  deliveryCharge: number | string;
  totalAmount: number | string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: OrderStatus;
  adminNote?: string | null;
  source: OrderSource;
  campaignName?: string | null;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number | string;
    subtotal: number | string;
  }[];
}

const money = (value: number | string) =>
  `৳${Number(value || 0).toLocaleString("en-BD")}`;

const statusColor: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const [adminNote, setAdminNote] = useState("");
  const [source, setSource] = useState<OrderSource>("DIRECT");
  const [campaignName, setCampaignName] = useState("");

  const [savingNote, setSavingNote] = useState(false);
  const [savingSource, setSavingSource] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getHeaders = (): HeadersInit => {
    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/orders/${id}`,
        {
          headers: getHeaders(),
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Order not found");
      }

      const data: Order = result.data;

      setOrder(data);
      setAdminNote(data.adminNote || "");
      setSource(data.source || "DIRECT");
      setCampaignName(data.campaignName || "");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id, fetchOrder]);

  // UPDATE ADMIN NOTE
  const handleUpdateNote = async () => {
    if (!order) return;

    try {
      setSavingNote(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/orders/${id}/note`,
        {
          method: "PATCH",
          headers: getHeaders(),
          credentials: "include",
          body: JSON.stringify({ adminNote }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Note update failed");
      }

      setOrder((previous) =>
        previous
          ? {
              ...previous,
              ...result.data,
            }
          : previous
      );

      setAdminNote(result.data.adminNote || "");
      setMessage("Admin note saved successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Note update failed"
      );
    } finally {
      setSavingNote(false);
    }
  };

  // UPDATE ORDER SOURCE
  const handleUpdateSource = async () => {
    try {
      setSavingSource(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/orders/${id}/source`,
        {
          method: "PATCH",
          headers: getHeaders(),
          credentials: "include",
          body: JSON.stringify({
            source,
            campaignName,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Source update failed");
      }

      setOrder((previous) =>
        previous
          ? {
              ...previous,
              ...result.data,
            }
          : previous
      );

      setSource(result.data.source);
      setCampaignName(result.data.campaignName || "");
      setMessage("Order source updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Source update failed"
      );
    } finally {
      setSavingSource(false);
    }
  };

  // UPDATE ORDER STATUS
  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!order || order.orderStatus === newStatus) return;

    try {
      setUpdatingStatus(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/orders/${id}/status`,
        {
          method: "PATCH",
          headers: getHeaders(),
          credentials: "include",
          body: JSON.stringify({
            orderStatus: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Status update failed");
      }

      setOrder((previous) =>
        previous
          ? {
              ...previous,
              ...result.data,
            }
          : previous
      );

      setMessage("Order status updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Status update failed"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">
          {error || "Order not found"}
        </p>
        <Link
          href="/admin/orders"
          className="mt-4 inline-block text-[#7f1d2d] underline"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-rose-50/50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* HEADER */}
        <div className="rounded-2xl bg-gradient-to-r from-[#7f1d2d] to-rose-600 p-6 text-white">
          <button
            onClick={() => router.push("/admin/orders")}
            className="mb-4 text-sm text-rose-100 hover:text-white"
          >
            ← Back to Orders
          </button>

          <h1 className="text-2xl font-bold md:text-3xl">
            Order Details
          </h1>

          <p className="mt-2 text-rose-100">
            Order #{order.orderNumber}
          </p>
        </div>

        {/* MESSAGES */}
        {message && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* STATUS AND ORDER INFO */}
        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              Order Status
            </h2>

            <span
              className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${
                statusColor[order.orderStatus]
              }`}
            >
              {order.orderStatus}
            </span>

            <label className="mb-2 mt-5 block text-sm font-semibold text-gray-700">
              Change Status
            </label>

            <select
              value={order.orderStatus}
              disabled={updatingStatus}
              onChange={(e) =>
                handleUpdateStatus(e.target.value as OrderStatus)
              }
              className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-rose-500 disabled:opacity-50"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-gray-500">
              Backend only allows valid status transitions.
            </p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              Payment Information
            </h2>

            <p className="text-sm text-gray-600">
              Method: <strong>{order.paymentMethod}</strong>
            </p>

            <p className="mt-3 text-sm text-gray-600">
              Payment Status: <strong>{order.paymentStatus}</strong>
            </p>

            <p className="mt-3 text-sm text-gray-600">
              Order Date:{" "}
              <strong>
                {new Date(order.createdAt).toLocaleString("en-BD")}
              </strong>
            </p>
          </div>
        </section>

        {/* CUSTOMER INFORMATION */}
        <section className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-gray-800">
            Customer Information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500">Customer Name</p>
              <p className="mt-1 font-semibold">{order.customerName}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="mt-1 font-semibold">{order.customerPhone}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="mt-1 font-semibold">
                {order.customerEmail || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Address</p>
              <p className="mt-1 font-semibold">
                {order.shippingAddress}, {order.area || ""} {order.city}
              </p>
            </div>
          </div>
        </section>

        {/* ORDER ITEMS */}
        <section className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
          <div className="border-b border-rose-100 p-6">
            <h2 className="text-lg font-bold text-gray-800">
              Ordered Products
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-[#7f1d2d] text-white">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-4 font-semibold">
                      {item.productName}
                    </td>
                    <td className="p-4">{money(item.price)}</td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4 font-semibold">
                      {money(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-6">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{money(order.subtotal)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Delivery Charge</span>
              <span>{money(order.deliveryCharge)}</span>
            </div>

            <div className="flex justify-between border-t pt-4 text-lg font-bold text-[#7f1d2d]">
              <span>Total</span>
              <span>{money(order.totalAmount)}</span>
            </div>
          </div>
        </section>

        {/* ADMIN NOTE */}
        <section className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800">
            Admin Note
          </h2>

          <p className="mb-4 mt-1 text-sm text-gray-500">
            Add internal notes about this order.
          </p>

          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Write an admin note..."
            className="w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-rose-500"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              {adminNote.length}/500 characters
            </p>

            <button
              onClick={handleUpdateNote}
              disabled={savingNote}
              className="rounded-xl bg-gradient-to-r from-[#7f1d2d] to-rose-600 px-6 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {savingNote ? "Saving..." : "Update Note"}
            </button>
          </div>

          {/* SAVED NOTE */}
          <div className="mt-6 rounded-xl bg-rose-50 p-4">
            <h3 className="mb-2 text-sm font-bold text-[#7f1d2d]">
              Current Saved Note
            </h3>

            <p className="whitespace-pre-wrap text-sm text-gray-700">
              {order.adminNote || "No admin note added yet."}
            </p>
          </div>
        </section>

        {/* ORDER SOURCE */}
        <section className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800">
            Order Source
          </h2>

          <p className="mb-5 mt-1 text-sm text-gray-500">
            Track where this customer placed the order from.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Source
              </label>

              <select
                value={source}
                onChange={(e) =>
                  setSource(e.target.value as OrderSource)
                }
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-rose-500"
              >
                {SOURCES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Campaign Name
              </label>

              <input
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Example: Winter Sale 2026"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            onClick={handleUpdateSource}
            disabled={savingSource}
            className="mt-5 rounded-xl bg-gradient-to-r from-[#7f1d2d] to-rose-600 px-6 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {savingSource ? "Saving..." : "Update Source"}
          </button>

          <div className="mt-5 rounded-xl bg-rose-50 p-4">
            <p className="text-sm text-gray-600">
              Current Source:{" "}
              <strong className="text-[#7f1d2d]">
                {order.source}
              </strong>
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Campaign:{" "}
              <strong>
                {order.campaignName || "No campaign"}
              </strong>
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
