"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  X,
} from "lucide-react";

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
];

export default function Sidebar({ open, setOpen }: any) {
  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
fixed
inset-0
bg-black/40
z-40
md:hidden
"
        />
      )}

      <aside
        className={`
fixed
md:static
z-50
top-0
left-0
h-screen
w-64
bg-white
border-r
transition-transform

${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}

`}
      >
        <div
          className="
p-5
border-b
flex
justify-between
"
        >
          <h1
            className="
font-bold
text-xl
"
          >
            ROYS ADMIN
          </h1>

          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <nav
          className="
p-4
space-y-2
"
        >
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setOpen(false)}
                className="
flex
items-center
gap-3
px-4
py-3
rounded-lg
hover:bg-gray-100
"
              >
                <Icon size={20} />

                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
