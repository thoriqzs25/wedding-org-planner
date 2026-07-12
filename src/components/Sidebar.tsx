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

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-white/95 lg:bg-white/70 backdrop-blur-sm border-r border-gold/30 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between p-5 border-b border-gold/30">
          <div>
            <h1 className="text-xl font-bold text-orange">
              Wedding<span className="text-pink">Kit</span>
            </h1>
            <p className="text-sm text-amber-800/60 mt-1">Organizer</p>
          </div>
          <button onClick={onClose}
            className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-gold/20 text-amber-600 transition-colors lg:hidden active:scale-90">
            <Icon name="close" size={22} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 min-h-[44px] rounded-xl text-sm font-medium transition-colors ${
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

        <div className="p-3 border-t border-gold/30">
          <div className="flex items-center gap-3 px-4 min-h-[44px]">
            <div className="w-9 h-9 rounded-full bg-pink/30 flex items-center justify-center text-sm font-semibold text-pink shrink-0">
              A
            </div>
            <div className="text-sm min-w-0">
              <p className="font-medium text-amber-900 truncate">Aisyah & Rizky</p>
              <p className="text-amber-800/50 text-xs">20 Des 2026</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
