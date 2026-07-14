"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Icon from "./Icon";
import { loadMaintenanceConfig, isPathUnderMaintenance } from "@/utils/maintenance";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [maintainedPaths, setMaintainedPaths] = useState<string[]>([]);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");

  useEffect(() => {
    const config = loadMaintenanceConfig();
    setMaintainedPaths(config.paths);
    setMaintenanceMessage(config.message);
  }, []);

  const isAuthPage = pathname === "/login" || pathname === "/questionnaire" || pathname.startsWith("/admin");

  if (isAuthPage) {
    return <>{children}</>;
  }

  const isMaintenance = isPathUnderMaintenance(pathname, maintainedPaths);

  return (
    <div className="flex h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} maintainedPaths={maintainedPaths} />

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 lg:hidden flex items-center gap-3 bg-cream/90 backdrop-blur-sm border-b border-gold/20 px-4 py-3">
          <button onClick={() => setSidebarOpen(true)}
            className="cursor-pointer flex items-center justify-center w-11 h-11 rounded-xl hover:bg-gold/20 text-amber-800 transition-colors active:scale-90">
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
          {isMaintenance ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-20 h-20 rounded-2xl bg-gold/20 flex items-center justify-center mb-6">
                <Icon name="handyman" size={48} className="text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-amber-900 mb-3">Halaman Dalam Perbaikan</h2>
              <p className="text-amber-800/60 max-w-md leading-relaxed">
                {maintenanceMessage || "Maaf sekali pengalamanmu terganggu, datang kembali lain waktu yaa"}
              </p>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
