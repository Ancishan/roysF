
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { io, Socket } from "socket.io-client";

import {
  Menu,
  Bell,
  UserCircle,
  X,
  ShoppingBag,
  CheckCheck,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  orderId: string | null;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  createdAt: string;
  isRead: boolean;
}

interface HeaderProps {
  setOpen: (value: boolean) => void;
}

interface ApiNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  orderId: string | null;
  isRead: boolean;
  createdAt: string;
  order?: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    totalAmount: number | string;
  } | null;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: ApiNotification[];
  unreadCount?: number;
}

export default function Header({ setOpen }: HeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // ==========================================
  // NORMALIZE DATABASE NOTIFICATION
  // ==========================================

  const normalizeNotification = (
    item: ApiNotification
  ): Notification => ({
    id: item.id,
    title: item.title,
    message: item.message,
    type: item.type,
    orderId: item.orderId,
    orderNumber: item.order?.orderNumber || "",
    customerName: item.order?.customerName || "",
    customerPhone: item.order?.customerPhone || "",
    totalAmount: Number(item.order?.totalAmount || 0),
    createdAt: item.createdAt,
    isRead: item.isRead,
  });

  // ==========================================
  // LOAD NOTIFICATIONS FROM DATABASE
  // ==========================================

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/notifications`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result: ApiResponse = await response.json();

      console.log("Notification API status:", response.status);
      console.log("Notification API response:", result);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Notification API failed: ${response.status}`
        );
      }

      const formattedNotifications = (result.data || []).map(
        normalizeNotification
      );

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error("Notification loading failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // SOCKET.IO REALTIME CONNECTION
  // ==========================================

  useEffect(() => {
    fetchNotifications();

    const socket: Socket = io(API_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("🔔 Admin notification socket connected");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Notification socket disconnected");
      setConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error(
        "Socket authentication/connection error:",
        error.message
      );
      setConnected(false);
    });

    // ==========================================
    // NEW ORDER EVENT
    // ==========================================

    socket.on("new-order", (data: Notification) => {
      console.log("New order notification received:", data);

      const newNotification: Notification = {
        id: data.id,
        title: data.title || "New Order Received!",
        message: data.message || "",
        type: data.type || "NEW_ORDER",
        orderId: data.orderId || null,
        orderNumber: data.orderNumber || "",
        customerName: data.customerName || "",
        customerPhone: data.customerPhone || "",
        totalAmount: Number(data.totalAmount || 0),
        createdAt: data.createdAt || new Date().toISOString(),
        isRead: false,
      };

      setNotifications((previous) => {
        const alreadyExists = previous.some(
          (item) => item.id === newNotification.id
        );

        if (alreadyExists) return previous;

        return [newNotification, ...previous].slice(0, 50);
      });

      // Notification sound
      const audio = new Audio("/sounds/notification.mp3");
      audio.volume = 0.8;

      audio.play().catch((error) => {
        console.log("Browser blocked notification sound:", error);
      });

      // Browser notification
      if (
        "Notification" in window &&
        window.Notification.permission === "granted" &&
        document.visibilityState === "hidden"
      ) {
        new window.Notification("New ROYS Order!", {
          body: `${newNotification.orderNumber} from ${newNotification.customerName}`,
          icon: "/favicon.ico",
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchNotifications]);

  // ==========================================
  // MARK ONE NOTIFICATION AS READ
  // ==========================================

  const markAsRead = async (id: string) => {
    const notification = notifications.find(
      (item) => item.id === id
    );

    if (!notification || notification.isRead) return;

    try {
      const response = await fetch(
        `${API_URL}/api/notifications/${id}/read`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to mark as read"
        );
      }

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === id
            ? { ...item, isRead: true }
            : item
        )
      );
    } catch (error) {
      console.error("Mark as read failed:", error);
    }
  };

  // ==========================================
  // MARK ALL NOTIFICATIONS AS READ
  // ==========================================

  const markAllAsRead = async () => {
    if (unreadCount === 0 || markingAll) return;

    try {
      setMarkingAll(true);

      const response = await fetch(
        `${API_URL}/api/notifications/read-all`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to mark all as read"
        );
      }

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Mark all as read failed:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  // ==========================================
  // ENABLE BROWSER NOTIFICATION
  // ==========================================

  const enableBrowserNotification = async () => {
    if (
      "Notification" in window &&
      window.Notification.permission === "default"
    ) {
      const permission =
        await window.Notification.requestPermission();

      console.log("Browser notification permission:", permission);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <header className="relative z-40 flex h-16 items-center justify-between border-b border-rose-100 bg-white px-4 md:px-6">

      {/* LEFT SIDE */}

      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 transition hover:bg-rose-50 md:hidden"
        >
          <Menu size={22} />
        </button>

        <h2 className="hidden font-semibold text-gray-800 md:block">
          Admin Dashboard
        </h2>
      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center gap-5">

        {/* NOTIFICATION */}

        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications((previous) => !previous);
              enableBrowserNotification();
            }}
            className="relative rounded-full p-2 text-gray-600 transition hover:bg-rose-50 hover:text-[#7f1d2d]"
            aria-label="Notifications"
          >
            <Bell size={22} />

            {/* UNREAD BADGE */}

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}

            {/* SOCKET STATUS */}

            <span
              title={connected ? "Connected" : "Disconnected"}
              className={`absolute bottom-1 right-1 h-2 w-2 rounded-full border border-white ${
                connected ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </button>

          {/* DROPDOWN */}

          {showNotifications && (
            <div className="absolute right-0 top-14 z-50 w-[340px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-xl sm:w-[380px]">

              {/* DROPDOWN HEADER */}

              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Notifications
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {unreadCount} unread notifications
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0 || markingAll}
                    title="Mark all as read"
                    className="rounded-lg p-2 text-[#7f1d2d] transition hover:bg-rose-50 disabled:opacity-40"
                  >
                    <CheckCheck size={18} />
                  </button>

                  <button
                    onClick={() => setShowNotifications(false)}
                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* NOTIFICATION LIST */}

              <div className="max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="px-5 py-12 text-center text-sm text-gray-500">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                    <Bell size={32} className="text-gray-300" />

                    <p className="mt-3 font-medium text-gray-700">
                      No notifications yet
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      New orders will appear here.
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={
                        notification.orderId
                          ? `/admin/orders/${notification.orderId}`
                          : "/admin/orders"
                      }
                      onClick={() => {
                        void markAsRead(notification.id);
                        setShowNotifications(false);
                      }}
                      className={`flex gap-3 border-b border-gray-50 px-4 py-4 transition hover:bg-rose-50 ${
                        !notification.isRead ? "bg-rose-50/50" : ""
                      }`}
                    >
                      {/* ICON */}

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[#7f1d2d]">
                        <ShoppingBag size={19} />
                      </div>

                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-gray-800">
                            {notification.title}
                          </p>

                          {!notification.isRead && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
                          )}
                        </div>

                        <p className="mt-1 text-xs text-gray-600">
                          {notification.message ||
                            `${notification.orderNumber} from ${notification.customerName}`}
                        </p>

                        {notification.orderId && (
                          <p className="mt-1 text-xs font-semibold text-[#7f1d2d]">
                            ৳
                            {notification.totalAmount.toLocaleString("en-BD")}
                          </p>
                        )}

                        <p className="mt-1 text-[10px] text-gray-400">
                          {new Date(notification.createdAt).toLocaleString("en-BD")}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* FOOTER */}

              <Link
                href="/admin/orders"
                onClick={() => setShowNotifications(false)}
                className="block border-t border-gray-100 px-4 py-3 text-center text-sm font-semibold text-[#7f1d2d] hover:bg-rose-50"
              >
                View All Orders
              </Link>
            </div>
          )}
        </div>

        {/* ADMIN PROFILE */}

        <div className="flex items-center gap-2">
          <UserCircle size={26} className="text-gray-600" />

          <span className="hidden text-sm font-medium text-gray-700 sm:block">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
