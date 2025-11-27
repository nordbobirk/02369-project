"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/dashboard/settings/FastSkema", label: "Fast skema" },
    { href: "/dashboard/settings/availability", label: "Tilgængelighed" },
    { href: "/dashboard/settings/editEmail", label: "Notifikationer" },
    { href: "/dashboard/settings/updateFaq", label: "Rediger FAQ" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 md:flex relative">

      {/* ----------------side panel menu knap ---------------- */}
      <button
        onClick={() => setOpen(true)}
        className="
          md:hidden fixed left-3 top-1/6
           -translate-y-1/2 z-40
          bg-rose-300 text-white p-3 rounded-full shadow-lg
        "
      >
        <Menu size={22} />
      </button>

      {/* ---------------- MOBILE DARK OVERLAY ---------------- */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ---------------- SIDEBAR ---------------- */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-40
          h-full md:h-auto w-64
          bg-white border-r border-gray-200
          shadow-xl md:shadow-sm
          rounded-none md:rounded-2xl
          p-6
          transform transition-transform duration-300

          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* CLOSE BUTTON (mobile only) */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 md:hidden"
        >
          <X size={26} />
        </button>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-2 text-sm mt-10 md:mt-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}  // CLOSE SIDEBAR WHEN CLICKED
              className={`
                block px-4 py-2 rounded-lg font-medium transition-all
                ${
                  pathname === link.href
                    ? "bg-rose-300 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-8 mx-4 md:mx-0 mt-4 md:mt-0">
        {children}
      </main>
    </div>
  );
}
