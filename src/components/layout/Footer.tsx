import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About Us", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const customerLinks = [
  { name: "My Account", href: "/account" },
  { name: "Wishlist", href: "/wishlist" },
  { name: "Cart", href: "/cart" },
  { name: "Shipping Policy", href: "/shipping" },
  { name: "Return Policy", href: "/returns" },
];

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-3xl font-extrabold tracking-[0.18em]"
            >
              ROYS
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
              More than just a brand. Discover premium products,
              timeless style and a shopping experience made for you.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-sm font-semibold text-gray-400 transition hover:border-white hover:text-white"
              >
                f
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-sm font-semibold text-gray-400 transition hover:border-white hover:text-white"
              >
                ig
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-sm font-semibold text-gray-400 transition hover:border-white hover:text-white"
              >
                𝕏
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-sm font-semibold text-gray-400 transition hover:border-white hover:text-white"
              >
                in
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Customer Service
            </h3>

            <ul className="mt-5 space-y-3">
              {customerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">

              <div className="flex gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-gray-400"
                />

                <p className="text-sm leading-6 text-gray-400">
                  Chattogram, Bangladesh
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={17}
                  className="shrink-0 text-gray-400"
                />

                <a
                  href="tel:+8800000000000"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  +880 0000 000000
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  size={17}
                  className="shrink-0 text-gray-400"
                />

                <a
                  href="mailto:info@roys.com"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  info@roys.com
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-center sm:flex-row lg:px-8 sm:text-left">

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ROYS. All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="text-xs text-gray-500 transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-xs text-gray-500 transition hover:text-white"
            >
              Terms & Conditions
            </Link>
          </div>

        </div>
      </div>

    </footer>
  );
}