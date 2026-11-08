"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}

      <main>{children}</main>

      {!isAdmin && <Footer />}
    </>
  );
}
