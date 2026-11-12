
"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const WHATSAPP_NUMBER = "8801568042599"; // নিজের নম্বর বসাবে

export default function WhatsAppButton() {
  const pathname = usePathname();

  // Hide WhatsApp button from all admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const message = encodeURIComponent(
    "Hello ROYS! I want to know more about your products."
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with ROYS on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform duration-300 hover:scale-110"
    >
      {/* Rotating Circle */}
      <span className="absolute -inset-1 animate-spin rounded-full border-[3px] border-transparent border-t-[#25D366] border-r-[#128C7E]" />

      {/* Inner Circle */}
      <span className="absolute inset-1 rounded-full bg-[#25D366]" />

      {/* WhatsApp Icon */}
      <MessageCircle
        size={32}
        strokeWidth={2.2}
        className="relative z-10"
      />
    </a>
  );
}
