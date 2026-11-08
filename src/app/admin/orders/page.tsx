
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ==========================================
// TYPES
// ==========================================

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number | string;
  subtotal: number | string;
}

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
  createdAt: string;
  items: OrderItem[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Stats {
  all: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

// ==========================================
// HELPERS
// ==========================================

const formatPrice = (amount: number | string) => {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyle = (status: OrderStatus) => {
  const styles: Record<OrderStatus, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-purple-100 text-purple-700",
    SHIPPED: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return styles[status];
};

// ==========================================
// COMPONENT
// ==========================================

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("ALL");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [stats, setStats] = useState<Stats>({
    all: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  // ==========================================
  // AUTH HEADERS
  // ==========================================

  const getHeaders = (): HeadersInit => {
    let token = "";

    if (typeof window !== "undefined") {
      token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        "";
    }

    return {
      "Content-Type": "application/json",
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    };
  };

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        status: filter,
      });

      const response = await fetch(
        `${API_URL}/api/orders?${params.toString()}`,
        {
          method: "GET",
          headers: getHeaders(),
          credentials: "include",
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load orders",
        );
      }

      setOrders(result.data || []);

      setPagination(
        result.pagination || {
          page: 1,
          limit,
          total: 0,
          totalPages: 0,
        },
      );

      setStats(
        result.stats || {
          all: 0,
          pending: 0,
          confirmed: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        },
      );
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    try {
      setUpdatingId(orderId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: getHeaders(),
          credentials: "include",
          body: JSON.stringify({
            orderStatus: newStatus,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Status update failed",
        );
      }

      setSuccess("Order status updated successfully!");

      // Database থেকে updated orders এবং stats আবার আনবে
      await fetchOrders();
    } catch (err: any) {
      setError(err.message || "Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // STATS CARDS
  // ==========================================

  const cards = [
    {
      label: "All Orders",
      value: stats.all,
      status: "ALL",
      icon: ShoppingBag,
      color: "text-gray-700",
    },
    {
      label: "Pending",
      value: stats.pending,
      status: "PENDING",
      icon: Clock,
      color: "text-amber-600",
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      status: "CONFIRMED",
      icon: CheckCircle,
      color: "text-blue-600",
    },
    {
      label: "Processing",
      value: stats.processing,
      status: "PROCESSING",
      icon: Package,
      color: "text-purple-600",
    },
    {
      label: "Shipped",
      value: stats.shipped,
      status: "SHIPPED",
      icon: Truck,
      color: "text-indigo-600",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      status: "DELIVERED",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      status: "CANCELLED",
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-rose-50/40 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-[#7f1d2d]">
              ROYS ADMIN PANEL
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Orders Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage customer orders and track their status.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#7f1d2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#641624] disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Orders
          </button>
        </div>

        {/* SUCCESS / ERROR */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* STATS */}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.status}
                onClick={() => {
                  setFilter(card.status);
                  setPage(1);
                }}
                className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                  filter === card.status
                    ? "border-[#7f1d2d] ring-2 ring-[#7f1d2d]/10"
                    : "border-rose-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Icon size={21} className={card.color} />
                  <span className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </span>
                </div>

                <p className="mt-3 text-xs font-medium text-gray-500">
                  {card.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* SEARCH AND FILTER */}

        <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* SEARCH */}

            <div className="relative md:col-span-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search order, name or phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#7f1d2d] focus:ring-2 focus:ring-[#7f1d2d]/10"
              />
            </div>

            {/* STATUS FILTER */}

            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#7f1d2d]"
            >
              <option value="ALL">All Orders</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            {/* PAGE LIMIT */}

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#7f1d2d]"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        {/* ORDERS TABLE */}

        <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-2 border-b border-rose-100 p-5 sm:flex-row sm:items-center">
            <h2 className="text-lg font-bold text-gray-900">
              Order List
            </h2>

            <p className="text-sm text-gray-500">
              {pagination.total} total orders
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">

              <thead className="bg-rose-50/70 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Products</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-rose-50">

                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-16 text-center text-gray-500"
                    >
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-16 text-center text-gray-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-rose-50/40"
                    >
                      {/* ORDER NUMBER */}

                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#7f1d2d]">
                          {order.orderNumber}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {order.id.slice(0, 8)}
                        </p>
                      </td>

                      {/* CUSTOMER */}

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {order.customerName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {order.customerPhone}
                        </p>
                      </td>

                      {/* DATE */}

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* PRODUCTS */}

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {order.items?.length || 0} items
                      </td>

                      {/* TOTAL */}

                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </td>

                      {/* PAYMENT */}

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(order.orderStatus)}`}
                          >
                            {order.orderStatus}
                          </span>

                          <select
                            value={order.orderStatus}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value as OrderStatus,
                              )
                            }
                            className="w-36 rounded-lg border border-gray-200 px-2 py-2 text-xs outline-none focus:border-[#7f1d2d] disabled:opacity-50"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>

                          {updatingId === order.id && (
                            <span className="text-xs text-gray-400">
                              Updating...
                            </span>
                          )}
                        </div>
                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4 text-center">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          title="View Order Details"
                          className="inline-flex items-center justify-center rounded-lg bg-[#7f1d2d] p-2.5 text-white transition hover:bg-[#641624]"
                        >
                          <Eye size={17} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          <div className="flex flex-col items-center justify-between gap-4 border-t border-rose-100 p-5 sm:flex-row">

            <p className="text-sm text-gray-500">
              Showing{" "}
              {pagination.total === 0
                ? 0
                : (pagination.page - 1) * pagination.limit + 1}
              {" - "}
              {Math.min(
                pagination.page * pagination.limit,
                pagination.total,
              )}
              {" of "}
              {pagination.total} orders
            </p>

            <div className="flex items-center gap-3">

              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => current - 1)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <span className="min-w-20 text-center text-sm font-semibold text-[#7f1d2d]">
                {pagination.page} / {pagination.totalPages || 1}
              </span>

              <button
                disabled={
                  page >= pagination.totalPages || loading
                }
                onClick={() => setPage((current) => current + 1)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={17} />
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
