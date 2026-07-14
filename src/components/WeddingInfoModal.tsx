"use client";

import { useState } from "react";
import Icon from "./Icon";

interface WeddingInfo {
  brideName: string;
  groomName: string;
  weddingDate: string;
  location: string;
  guestCount: number;
  budget: number;
}

interface WeddingInfoModalProps {
  info: WeddingInfo;
  onSave: (info: WeddingInfo) => void;
  onClose: () => void;
}

export default function WeddingInfoModal({ info, onSave, onClose }: WeddingInfoModalProps) {
  const [brideName, setBrideName] = useState(info.brideName);
  const [groomName, setGroomName] = useState(info.groomName);
  const [weddingDate, setWeddingDate] = useState(info.weddingDate);
  const [location, setLocation] = useState(info.location);
  const [guestCount, setGuestCount] = useState(info.guestCount);
  const [budget, setBudget] = useState(info.budget);
  const [tab, setTab] = useState<"acara" | "budget">("acara");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ brideName, groomName, weddingDate, location, guestCount, budget });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gold/30 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-amber-900">Edit Informasi</h2>
          <button onClick={onClose} className="cursor-pointer w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-amber-900/50 hover:text-amber-900">
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="flex border-b border-gold/20">
          <button onClick={() => setTab("acara")}
            className={`cursor-pointer flex-1 py-3 text-sm font-medium text-center transition-colors ${
              tab === "acara" ? "text-orange border-b-2 border-orange" : "text-amber-800/50 hover:text-amber-900"
            }`}>
            <Icon name="event" size={16} className="inline mr-1" />
            Acara
          </button>
          <button onClick={() => setTab("budget")}
            className={`cursor-pointer flex-1 py-3 text-sm font-medium text-center transition-colors ${
              tab === "budget" ? "text-orange border-b-2 border-orange" : "text-amber-800/50 hover:text-amber-900"
            }`}>
            <Icon name="account_balance_wallet" size={16} className="inline mr-1" />
            Budget
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {tab === "acara" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900/70 mb-1">Nama Panggilan Pria</label>
                  <input value={groomName} onChange={(e) => setGroomName(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900/70 mb-1">Nama Panggilan Wanita</label>
                  <input value={brideName} onChange={(e) => setBrideName(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900/70 mb-1">Tanggal Acara</label>
                  <input type="date" value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900/70 mb-1">Lokasi Acara</label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900"
                    placeholder="Cth: Jakarta" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900/70 mb-1">Jumlah Tamu</label>
                <input type="number" min={1} value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} required
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900"
                  placeholder="Cth: 300" />
              </div>
            </>
          )}

          {tab === "budget" && (
            <div>
              <label className="block text-sm font-medium text-amber-900/70 mb-1">Total Budget (Rp)</label>
              <input type="number" min={0} value={budget} onChange={(e) => setBudget(Number(e.target.value))} required
                className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
              <p className="text-xs text-amber-800/40 mt-2">
                Mengubah budget akan memperbarui progress bar budget di dashboard.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="cursor-pointer flex-1 py-3 rounded-xl border border-gold/40 text-amber-900 font-medium hover:bg-cream transition-colors">
              Batal
            </button>
            <button type="submit"
              className="flex-1 py-3 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
