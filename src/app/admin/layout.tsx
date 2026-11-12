
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import api from "@/lib/axios";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    let active = true;

    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await api.get("/admin/profile");

        if (active && res.data.success) {
          setAuthenticated(true);
        } else if (active) {
          setAuthenticated(false);
        }
      } catch (error) {
        if (active) {
          setAuthenticated(false);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    setAuthenticated(false);

    checkAuth();

    return () => {
      active = false;
    };
  }, [pathname, isLoginPage]);

  useEffect(() => {
    if (loading) return;

    if (!isLoginPage && !authenticated) {
      router.replace("/admin/login");
    }

    if (isLoginPage && authenticated) {
      router.replace("/admin/dashboard");
    }
  }, [loading, authenticated, isLoginPage, router]);

  // Login Page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Authentication Loading
  if (loading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-[#7f1d2d]"></span>

          <p className="mt-3 text-gray-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Protected Admin Dashboard
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 min-w-0">
        <Header setOpen={setOpen} />

        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
