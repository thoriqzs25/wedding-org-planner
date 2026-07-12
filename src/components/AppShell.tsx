"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Icon from "./Icon";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthPage = pathname === "/login" || pathname === "/questionnaire" || pathname.startsWith("/admin");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 lg:hidden flex items-center gap-3 bg-cream/90 backdrop-blur-sm border-b border-gold/20 px-4 py-3">
          <button onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-gold/20 text-amber-800 transition-colors active:scale-90">
            <Icon name="menu" size={24} />
          </button>
          <h1 className="text-lg font-bold text-orange flex-1">
            Wedding<span className="text-pink">Kit</span>
          </h1>
          <a href="/login"
            className="flex items-center justify-center w-11 h-11 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors active:scale-90">
            <Icon name="logout" size={20} />
          </a>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
