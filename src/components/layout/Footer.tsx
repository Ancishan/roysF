
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

// =====================================
// API URL
// =====================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// =====================================
// TYPES
// =====================================

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;

  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
}

// =====================================
// DEFAULT SETTINGS
// =====================================

const defaultSettings: StoreSettings = {
  storeName: "ROYS",
  storeEmail: "info@roys.com",
  storePhone: "+880 0000 000000",
  storeAddress: "Chattogram, Bangladesh",

  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  tiktokUrl: "",
};

// =====================================
// FOOTER COMPONENT
// =====================================

export default function Footer() {
  const [settings, setSettings] =
    useState<StoreSettings>(defaultSettings);

  // =====================================
  // FETCH PUBLIC SETTINGS
  // =====================================

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/settings/public`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch public settings: ${response.status}`
          );
        }

        const result = await response.json();

        console.log("Footer API Response:", result);

        if (isMounted && result.success && result.data) {
          setSettings({
            ...defaultSettings,
            ...result.data,
          });
        }
      } catch (error) {
        console.error("Footer settings error:", error);
      }
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================
  // SOCIAL MEDIA LINKS
  // =====================================

  const socialLinks = [
    {
      name: "Facebook",
      url: settings.facebookUrl,
      icon: FaFacebookF,
    },
    {
      name: "Instagram",
      url: settings.instagramUrl,
      icon: FaInstagram,
    },
    {
      name: "YouTube",
      url: settings.youtubeUrl,
      icon: FaYoutube,
    },
    {
      name: "TikTok",
      url: settings.tiktokUrl,
      icon: FaTiktok,
    },
  ];

  // =====================================
  // CONTACT INFORMATION
  // =====================================

  const phone = settings.storePhone;
  const email = settings.storeEmail;

  const phoneLink = phone.replace(/[^\d+]/g, "");

  // =====================================
  // UI
  // =====================================

  return (
    <footer className="bg-[#111111] text-white">

      {/* MAIN FOOTER */}

      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* BRAND SECTION */}

          <div>

            <Link
              href="/"
              className="inline-block text-3xl font-bold tracking-wider text-white"
            >
              {settings.storeName || "ROYS"}
              <span className="text-[#7f1d2d]">.</span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
              Discover quality products with a better shopping
              experience. Thank you for choosing{" "}
              {settings.storeName || "ROYS"}.
            </p>

            {/* SOCIAL MEDIA */}

            <div className="mt-6">

              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Follow Us
              </h3>

              <div className="flex items-center gap-3">

                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  const url = social.url?.trim();
                  const hasUrl = Boolean(url);

                  return (
                    <a
                      key={social.name}
                      href={hasUrl ? url : undefined}
                      target={hasUrl ? "_blank" : undefined}
                      rel={
                        hasUrl
                          ? "noopener noreferrer"
                          : undefined
                      }
                      aria-label={social.name}
                      title={social.name}
                      onClick={(e) => {
                        if (!hasUrl) {
                          e.preventDefault();
                        }
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-300 transition-all duration-300 hover:border-[#7f1d2d] hover:bg-[#7f1d2d] hover:text-white"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}

              </div>

            </div>

          </div>

          {/* QUICK LINKS */}

          <div>

            <h3 className="mb-6 text-base font-semibold uppercase tracking-wider">
              Quick Links
            </h3>

            <ul className="space-y-4 text-sm text-gray-400">

              <li>
                <Link href="/" className="transition hover:text-white">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/shop" className="transition hover:text-white">
                  Shop
                </Link>
              </li>

              <li>
                <Link href="/about" className="transition hover:text-white">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/blog" className="transition hover:text-white">
                  Blog
                </Link>
              </li>

              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Contact Us
                </Link>
              </li>

            </ul>

          </div>

          {/* CUSTOMER SERVICE */}

          <div>

            <h3 className="mb-6 text-base font-semibold uppercase tracking-wider">
              Customer Service
            </h3>

            <ul className="space-y-4 text-sm text-gray-400">

              <li>
                <Link href="/my-orders" className="transition hover:text-white">
                  My Orders
                </Link>
              </li>

              <li>
                <Link href="/cart" className="transition hover:text-white">
                  Shopping Cart
                </Link>
              </li>

              <li>
                <Link href="/wishlist" className="transition hover:text-white">
                  Wishlist
                </Link>
              </li>

              <li>
                <Link href="/privacy-policy" className="transition hover:text-white">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/terms" className="transition hover:text-white">
                  Terms & Conditions
                </Link>
              </li>

            </ul>

          </div>

          {/* CONTACT INFORMATION */}

          <div>

            <h3 className="mb-6 text-base font-semibold uppercase tracking-wider">
              Contact Us
            </h3>

            <ul className="space-y-5 text-sm text-gray-400">

              {/* ADDRESS */}

              <li className="flex items-start gap-3">

                <MapPin
                  size={19}
                  className="mt-0.5 shrink-0 text-[#7f1d2d]"
                />

                <span className="leading-6">
                  {settings.storeAddress ||
                    defaultSettings.storeAddress}
                </span>

              </li>

              {/* PHONE */}

              <li className="flex items-center gap-3">

                <Phone
                  size={18}
                  className="shrink-0 text-[#7f1d2d]"
                />

                <a
                  href={`tel:${phoneLink}`}
                  className="transition hover:text-white"
                >
                  {phone || defaultSettings.storePhone}
                </a>

              </li>

              {/* EMAIL */}

              <li className="flex items-center gap-3">

                <Mail
                  size={18}
                  className="shrink-0 text-[#7f1d2d]"
                />

                <a
                  href={`mailto:${email}`}
                  className="break-all transition hover:text-white"
                >
                  {email || defaultSettings.storeEmail}
                </a>

              </li>

            </ul>

          </div>

        </div>

      </div>

      {/* BOTTOM FOOTER */}

      <div className="border-t border-gray-800">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-center md:flex-row md:px-8 md:text-left">

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()}{" "}
            {settings.storeName || "ROYS"}. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-sm text-gray-500">

            <Link
              href="/privacy-policy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-white"
            >
              Terms & Conditions
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}
