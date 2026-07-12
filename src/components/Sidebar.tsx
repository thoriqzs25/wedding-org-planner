"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

const navItems = [
  { label: "Dashboard", href: "/", icon: "dashboard" },
  { label: "Kebutuhan", href: "/necessity", icon: "checklist" },
  { label: "Vendor", href: "/vendors", icon: "storefront" },
  { label: "Galeri Inspirasi", href: "/gallery", icon: "auto_awesome" },
  { label: "Invoice", href: "/invoices", icon: "receipt_long" },
  { label: "Kalender", href: "/calendar", icon: "calendar_month" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen sticky top-0 bg-white/70 backdrop-blur-sm border-r border-gold/30 flex flex-col">
      <div className="p-6 border-b border-gold/30">
        <h1 className="text-xl font-bold text-orange">
          Wedding<span className="text-pink">Kit</span>
        </h1>
        <p className="text-sm text-amber-800/60 mt-1">Organizer</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange text-white shadow-sm"
                  : "text-amber-900/70 hover:bg-orange/10 hover:text-orange"
              }`}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gold/30">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-pink/30 flex items-center justify-center text-sm font-semibold text-pink">
            A
          </div>
          <div className="text-sm">
            <p className="font-medium text-amber-900">Aisyah & Rizky</p>
            <p className="text-amber-800/50 text-xs">20 Des 2026</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
