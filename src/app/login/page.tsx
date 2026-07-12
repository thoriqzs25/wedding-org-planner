"use client";

import { useState } from "react";
import Link from "next/link";
import { mockAccounts } from "@/data/mock";

export default function LoginPage() {
  const [clickCount, setClickCount] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const handleVersionClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 10) {
      setShowAdmin(true);
      setClickCount(0);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const account = mockAccounts.find(
      (a) => a.username === adminUsername && a.password === adminPassword
    );
    if (account) {
      window.location.href = "/admin";
    } else {
      setAdminError("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange">
            Wedding<span className="text-pink">Kit</span>
          </h1>
          <p className="text-amber-800/60 mt-1">Wedding Organizer</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gold/30 p-5 sm:p-8">
          <h2 className="text-xl font-semibold text-amber-900 mb-6 text-center">
            {showAdmin ? "Admin Login" : "Masuk"}
          </h2>

          {showAdmin ? (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-900/70 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                  placeholder="Admin username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900/70 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                  placeholder="Admin password"
                />
              </div>
              {adminError && (
                <p className="text-pink text-sm text-center">{adminError}</p>
              )}
              <button
                type="submit"
                className="w-full min-h-[44px] bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm active:scale-[0.98]"
              >
                Sign in as Admin
              </button>
              <button
                type="button"
                onClick={() => { setShowAdmin(false); setAdminError(""); }}
                className="w-full min-h-[44px] text-sm text-amber-800/60 hover:text-amber-900 transition-colors"
              >
                Back to user login
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-amber-900/70 mb-1">
                  ID Pengguna
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                  placeholder="Masukkan ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900/70 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                  placeholder="Masukkan password"
                />
              </div>
              <button
                type="submit"
                className="w-full min-h-[44px] bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm active:scale-[0.98]"
              >
                Masuk
              </button>
            </form>
          )}

          {!showAdmin && (
            <p className="text-center text-sm text-amber-800/60 mt-6">
              Belum punya akun?{" "}
              <Link
                href="/questionnaire"
                className="text-orange font-medium hover:underline"
              >
                Daftar
              </Link>
            </p>
          )}
        </div>

        <div className="text-center mt-6">
          {showAdmin && (
            <p className="text-xs text-green font-medium mb-2">Admin access unlocked</p>
          )}
          <p
            onClick={handleVersionClick}
            className="inline-block text-xs text-amber-800/60 text-center cursor-pointer select-none hover:text-amber-900 transition-colors"
          >
            v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
