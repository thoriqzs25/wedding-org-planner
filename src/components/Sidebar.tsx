"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

const navItems = [
  { label: "Dashboard", href: "/", icon: "dashboard" },
  { label: "Elemen Pernikahan", href: "/wedding-elements", icon: "checklist" },
  { label: "Vendor Tracker", href: "/vendors", icon: "storefront" },
  { label: "Mood Board", href: "/mood-board", icon: "collections" },
  { label: "Invoice", href: "/invoices", icon: "receipt_long" },
  { label: "Kalender", href: "/calendar", icon: "calendar_month" },
  { label: "FAQ", href: "/faq", icon: "help" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-white/95 lg:bg-white/70 backdrop-blur-sm border-r border-gold/30 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-5 border-b border-gold/30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-orange">
                Wedding<span className="text-pink">Kit</span>
              </h1>
              <p className="text-sm text-amber-800/60 mt-1">Organizer</p>
            </div>
            <button onClick={onClose}
              className="cursor-pointer flex items-center justify-center w-11 h-11 rounded-xl hover:bg-gold/20 text-amber-600 transition-colors lg:hidden active:scale-90">
              <Icon name="close" size={22} />
            </button>
          </div>
          <button onClick={() => setShowGuide(!showGuide)}
            className="cursor-pointer mt-3 flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-gold/10 hover:bg-gold/20 text-amber-800/70 hover:text-amber-900 transition-colors text-xs font-medium">
            <Icon name={showGuide ? "expand_less" : "help"} size={16} />
            Where to Start
          </button>
          {showGuide && (
            <div className="mt-3 space-y-2 text-xs text-amber-800/70 leading-relaxed bg-cream/50 rounded-xl p-3 border border-gold/20">
              <p>1. Add vendor drafts & to-dos in <span className="font-medium text-amber-900">Elemen Pernikahan</span></p>
              <p>2. Select a final vendor for each wedding element</p>
              <p>3. Track vendor tasks in <span className="font-medium text-amber-900">Vendor Tracker</span></p>
              <p>4. Record payments in <span className="font-medium text-amber-900">Invoice</span></p>
              <p>5. Save references in <span className="font-medium text-amber-900">Mood Board</span></p>
              <p>6. Mark important dates in <span className="font-medium text-amber-900">Kalender</span></p>
            </div>
          )}
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

        <div className="p-3 border-t border-gold/30 space-y-1">
          <div className="flex items-center gap-3 px-4 min-h-[44px]">
            <div className="w-9 h-9 rounded-full bg-pink/30 flex items-center justify-center text-sm font-semibold text-pink shrink-0">
              A
            </div>
            <div className="text-sm min-w-0">
              <p className="font-medium text-amber-900 truncate">Aisyah & Rizky</p>
              <p className="text-amber-800/50 text-xs">20 Des 2026</p>
            </div>
          </div>
          <a href="/login"
            className="flex items-center gap-3 px-4 min-h-[44px] rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-medium">
            <Icon name="logout" size={20} />
            Keluar
          </a>
        </div>
      </aside>
    </>
  );
}
