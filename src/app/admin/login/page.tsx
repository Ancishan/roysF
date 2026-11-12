
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import api from "@/lib/axios";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        router.replace("/admin/dashboard");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl min-h-[650px] bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* Left Branding Section */}
        <section className="hidden lg:flex relative bg-[#7f1d2d] text-white p-12 flex-col justify-between overflow-hidden">

          {/* Background Decorations */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border-[40px] border-white/5" />
          <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                <ShoppingBag className="text-[#7f1d2d]" size={27} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-wider">
                  ROYS
                </h1>
                <p className="text-xs text-white/70 tracking-[3px]">
                  E-COMMERCE
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[3px] text-white/70 mb-5">
              Administration Portal
            </p>

            <h2 className="text-5xl font-bold leading-tight mb-6">
              Manage your business with confidence.
            </h2>

            <p className="text-white/75 text-base leading-8">
              Welcome to the ROYS administration panel.
              Manage products, orders, customers and your
              online store from one secure place.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-[#7f1d2d]" />
                <div className="w-9 h-9 rounded-full bg-white/30 border-2 border-[#7f1d2d]" />
                <div className="w-9 h-9 rounded-full bg-white/40 border-2 border-[#7f1d2d]" />
              </div>

              <p className="text-sm text-white/80">
                Your store, your control.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-white/60">
            <p>© {new Date().getFullYear()} ROYS. All rights reserved.</p>
            <p>Admin Portal</p>
          </div>
        </section>

        {/* Right Login Section */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">

          <div className="w-full max-w-md">

            {/* Mobile Brand */}
            <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-xl bg-[#7f1d2d] flex items-center justify-center">
                <ShoppingBag className="text-white" size={26} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-[#7f1d2d] tracking-wider">
                  ROYS
                </h1>
                <p className="text-xs text-gray-500 tracking-[3px]">
                  E-COMMERCE
                </p>
              </div>
            </div>

            {/* Login Heading */}
            <div className="mb-9">
              <div className="w-14 h-14 rounded-2xl bg-[#7f1d2d]/10 flex items-center justify-center mb-6">
                <LockKeyhole className="text-[#7f1d2d]" size={28} />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Admin Login
              </h2>

              <p className="text-gray-500 leading-6">
                Sign in to access your ROYS store dashboard.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={login} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-[#7f1d2d] focus:ring-4 focus:ring-[#7f1d2d]/10 transition text-gray-800"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-[#7f1d2d] focus:ring-4 focus:ring-[#7f1d2d]/10 transition text-gray-800"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7f1d2d] transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#7f1d2d] hover:bg-[#641624] text-white font-semibold py-3.5 rounded-xl transition duration-200 shadow-lg shadow-[#7f1d2d]/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-100 flex gap-3">
              <ShieldCheck
                size={22}
                className="text-green-600 shrink-0"
              />

              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Secure Admin Access
                </p>

                <p className="text-xs text-gray-500 mt-1 leading-5">
                  This area is restricted to authorized ROYS administrators only.
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">
              ROYS Admin Panel · Secure Login
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}
