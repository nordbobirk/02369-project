"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/settings/FastSkema", label: "Fast skema" },
    { href: "/dashboard/settings/availability", label: "Tilgængelighed" },
    {href: "/dashboard/settings/editEmail", label: "Notifikationer"},
    {href: "/dashboard/settings/updateFaq", label: "Rediger FAQ"}
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      {/* Sidebar */}
      <aside className="w-64 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mr-6">
        
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === link.href
                  ? "bg-rose-300 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        {children}
      </main>
    </div>
  );
}
