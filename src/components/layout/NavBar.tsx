"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Announcement bar */}
      <div className="bg-[#7f1d2d] px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        Free Shipping on Orders Over ৳2000
      </div>

      {/* Main navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="text-2xl font-bold tracking-wide text-[#7f1d2d]"
        >
          ROYS
        </Link>

        {/* Desktop navigation links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 transition hover:text-[#7f1d2d]"
          >
            Home
          </Link>

          <Link
            href="/shop"
            className="text-sm font-medium text-gray-700 transition hover:text-[#7f1d2d]"
          >
            Shop
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium text-gray-700 transition hover:text-[#7f1d2d]"
          >
            About Us
          </Link>

          <Link
            href="/blog"
            className="text-sm font-medium text-gray-700 transition hover:text-[#7f1d2d]"
          >
            Blog
          </Link>

          <Link
            href="/contact"
            className="text-sm font-medium text-gray-700 transition hover:text-[#7f1d2d]"
          >
            Contact
          </Link>
        </div>

        {/* Navbar action icons */}
        <div className="flex items-center gap-4">
          <Link
            href="/shop"
            aria-label="Search products"
            className="text-gray-700 transition hover:text-[#7f1d2d]"
          >
            <Search size={21} />
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} items`}
            className="relative text-gray-700 transition hover:text-[#7f1d2d]"
          >
            <Heart size={21} />

            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7f1d2d] px-1 text-[10px] font-semibold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label={`Shopping cart, ${cartCount} items`}
            className="relative text-gray-700 transition hover:text-[#7f1d2d]"
          >
            <ShoppingBag size={21} />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7f1d2d] px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/login"
            aria-label="My account"
            className="hidden text-gray-700 transition hover:text-[#7f1d2d] sm:block"
          >
            <User size={21} />
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="text-gray-700 transition hover:text-[#7f1d2d] md:hidden"
          >
            {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="text-sm font-medium text-gray-700 hover:text-[#7f1d2d]"
            >
              Home
            </Link>

            <Link
              href="/shop"
              onClick={closeMobileMenu}
              className="text-sm font-medium text-gray-700 hover:text-[#7f1d2d]"
            >
              Shop
            </Link>

            <Link
              href="/about"
              onClick={closeMobileMenu}
              className="text-sm font-medium text-gray-700 hover:text-[#7f1d2d]"
            >
              About Us
            </Link>

            <Link
              href="/blog"
              onClick={closeMobileMenu}
              className="text-sm font-medium text-gray-700 hover:text-[#7f1d2d]"
            >
              Blog
            </Link>

            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="text-sm font-medium text-gray-700 hover:text-[#7f1d2d]"
            >
              Contact
            </Link>

            <Link
              href="/login"
              onClick={closeMobileMenu}
              className="text-sm font-medium text-gray-700 hover:text-[#7f1d2d]"
            >
              My Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}