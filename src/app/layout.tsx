import type { Metadata } from "next";

import "./globals.css";

import { CartProvider } from "@/context/CartContext";

import { WishlistProvider } from "@/context/WishlistContext";

import NavbarWrapper from "@/components/layout/NavbarWrapper";

export const metadata: Metadata = {
  title: "ROYS",
  description: "ROYS - More Than Just a Brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="bg-white text-gray-900 antialiased"
      >
        <CartProvider>
          <WishlistProvider>
            <NavbarWrapper>{children}</NavbarWrapper>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
