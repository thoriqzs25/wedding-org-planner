"use client";

import { useState } from "react";

const defaultNecessities = [
  { id: "venue", label: "Venue", default: true },
  { id: "wo", label: "Wedding Organizer", default: true },
  { id: "dekorasi", label: "Dekorasi Interior", default: true },
  { id: "katering", label: "Katering", default: true },
  { id: "musik", label: "Musik", default: true },
  { id: "dokumentasi", label: "Dokumentasi", default: true },
  { id: "prewedding", label: "Prewedding", default: false },
  { id: "content-creator", label: "Wedding Content Creator", default: false },
  { id: "photobooth", label: "Photo Booth", default: false },
  { id: "undangan-fisik", label: "Undangan Fisik", default: false },
  { id: "undangan-online", label: "Undangan Online", default: false },
  { id: "mobil-pengantin", label: "Mobil Pengantin", default: false },
  { id: "souvenir", label: "Souvenir", default: false },
  { id: "makeup", label: "Makeup & Hairdo", default: false },
  { id: "mc", label: "Master of Ceremony", default: false },
  { id: "hiburan", label: "Hiburan (Band/DJ)", default: false },
  { id: "livestreaming", label: "Live Streaming", default: false },
];

const budgetTiers = [
  { value: "murah", label: "Murah", range: "< Rp100jt" },
  { value: "menengah-bawah", label: "Menengah Bawah", range: "Rp100jt - Rp500jt" },
  { value: "menengah-atas", label: "Menengah Atas", range: "Rp500jt - Rp1M" },
  { value: "mewah", label: "Mewah", range: "> Rp1M" },
];

export default function QuestionnairePage() {
  const [step, setStep] = useState(1);
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [location, setLocation] = useState("");
  const [guestCount, setGuestCount] = useState(300);
  const [totalBudget, setTotalBudget] = useState(350000000);
  const [budgetTier, setBudgetTier] = useState("menengah-bawah");
  const [selectedNecs, setSelectedNecs] = useState<string[]>(() =>
    defaultNecessities.filter((n) => n.default).map((n) => n.id)
  );
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange">
            Wedding<span className="text-pink">Kit</span>
          </h1>
          <p className="text-amber-800/60 mt-1">Mulai rencanakan pernikahanmu</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gold/30 p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step >= s
                      ? "bg-orange text-white"
                      : "bg-cream text-amber-800/40"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-0.5 transition-colors ${
                      step > s ? "bg-orange" : "bg-cream"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-amber-900">
                  Data Pasangan
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-900/70 mb-1">
                      Nama Panggilan Calon Pria
                    </label>
                    <input
                      type="text"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                      placeholder="Cth: Rizky"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-900/70 mb-1">
                      Nama Panggilan Calon Wanita
                    </label>
                    <input
                      type="text"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                      placeholder="Cth: Aisyah"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-900/70 mb-1">
                      Tanggal Acara
                    </label>
                    <input
                      type="date"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-900/70 mb-1">
                      Lokasi Acara
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                      placeholder="Cth: Jakarta"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-900/70 mb-1">
                      Jumlah Tamu
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                      placeholder="Cth: 300"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-amber-900">
                  Budget & Kebutuhan
                </h2>

                <div>
                  <label className="block text-sm font-medium text-amber-900/70 mb-1">
                    Total Budget (Rp)
                  </label>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                    placeholder="Cth: 350000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900/70 mb-3">
                    Range Budget
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {budgetTiers.map((tier) => (
                      <label
                        key={tier.value}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gold/30 hover:border-orange/50 cursor-pointer transition-colors has-checked:bg-orange/10 has-checked:border-orange"
                      >
                        <input
                          type="radio"
                          name="budgetTier"
                          value={tier.value}
                          checked={budgetTier === tier.value}
                          onChange={(e) => setBudgetTier(e.target.value)}
                          className="accent-orange"
                        />
                        <div>
                          <p className="text-sm font-medium text-amber-900">
                            {tier.label}
                          </p>
                          <p className="text-xs text-amber-800/50">{tier.range}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900/70 mb-3">
                    Kebutuhan yang Diambil
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {defaultNecessities.map((nec) => (
                      <label
                        key={nec.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gold/30 hover:border-orange/50 cursor-pointer transition-colors has-checked:bg-orange/10 has-checked:border-orange"
                      >
                        <input
                          type="checkbox"
                          checked={selectedNecs.includes(nec.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedNecs([...selectedNecs, nec.id]);
                            } else {
                              setSelectedNecs(selectedNecs.filter((id) => id !== nec.id));
                            }
                          }}
                          className="accent-orange"
                        />
                        <span className="text-sm text-amber-900">{nec.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-amber-900">
                  Buat Akun
                </h2>

                <div>
                  <label className="block text-sm font-medium text-amber-900/70 mb-1">
                    ID Pengguna
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                    placeholder="Buat ID untuk akunmu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900/70 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                    placeholder="Buat password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900/70 mb-1">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30"
                    placeholder="Ulangi password"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between gap-3 mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 min-h-[44px] rounded-xl border border-gold/40 text-amber-900 font-medium hover:bg-cream transition-colors active:scale-95"
                >
                  Kembali
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 min-h-[44px] bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm active:scale-95"
                >
                  Lanjut
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 min-h-[44px] bg-green text-white rounded-xl font-medium hover:bg-green/90 transition-colors shadow-sm active:scale-95"
                >
                  Buat Akun & Mulai
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
