"use client";

import { useState } from "react";

import Sidebar from "@/components/admin/Sidebar";

import Header from "@/components/admin/Header";

import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return children;
  }

  return (
    <div
      className="
flex
min-h-screen
bg-gray-100
"
    >
      <Sidebar open={open} setOpen={setOpen} />

      <div
        className="
flex-1
min-w-0
"
      >
        <Header setOpen={setOpen} />

        <main
          className="
p-4
md:p-6
"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
