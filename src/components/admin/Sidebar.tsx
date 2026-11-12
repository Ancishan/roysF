
"use client";

import Link from "next/link";
import { useState } from "react";

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  BookOpen,
  X,
  LogOut,
} from "lucide-react";

import api from "@/lib/axios";

const menu = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Customers",
    path: "/admin/customers",
    icon: Users,
  },
  {
    name: "Reviews",
    path: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
  {
    name: "About Us",
    path: "/admin/about",
    icon: BookOpen,
  },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      // Backend logout API
      const response = await api.post("/auth/logout");

      if (!response.data.success) {
        throw new Error("Logout failed");
      }

      // Close mobile sidebar
      setOpen(false);

      // Redirect to login and remove current page from history
      window.location.replace("/admin/login");
    } catch (error: any) {
      console.error("Logout failed:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Logout failed. Please try again."
      );

      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static
          z-50 top-0 left-0
          h-screen w-64
          bg-white border-r
          flex flex-col
          transition-transform duration-300
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b flex justify-between items-center">
          <h1 className="font-bold text-xl">
            ROYS ADMIN
          </h1>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setOpen(false)}
                className="
                  flex items-center gap-3
                  px-4 py-3 rounded-lg
                  text-gray-700
                  hover:bg-gray-100
                  transition
                "
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="
              w-full flex items-center gap-3
              px-4 py-3 rounded-lg
              text-red-600
              hover:bg-red-50
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <LogOut size={20} />

            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
