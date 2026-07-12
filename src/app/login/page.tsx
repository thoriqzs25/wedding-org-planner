"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange">
            Wedding<span className="text-pink">Kit</span>
          </h1>
          <p className="text-amber-800/60 mt-1">Wedding Organizer</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gold/30 p-8">
          <h2 className="text-xl font-semibold text-amber-900 mb-6 text-center">
            Masuk
          </h2>

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
              className="w-full py-3 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm"
            >
              Masuk
            </button>
          </form>

          <p className="text-center text-sm text-amber-800/60 mt-6">
            Belum punya akun?{" "}
            <Link
              href="/questionnaire"
              className="text-orange font-medium hover:underline"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
