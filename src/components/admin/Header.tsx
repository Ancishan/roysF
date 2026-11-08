"use client";

import { Menu, Bell, UserCircle } from "lucide-react";

export default function Header({ setOpen }: any) {
  return (
    <header
      className="
h-16
bg-white
border-b
flex
items-center
justify-between
px-4
md:px-6
"
    >
      <button
        onClick={() => setOpen(true)}
        className="
md:hidden
"
      >
        <Menu />
      </button>

      <h2
        className="
font-semibold
hidden
md:block
"
      >
        Admin Dashboard
      </h2>

      <div
        className="
flex
items-center
gap-4
"
      >
        <Bell size={20} />

        <div
          className="
flex
items-center
gap-2
"
        >
          <UserCircle size={26} />

          <span
            className="
hidden
sm:block
"
          >
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
