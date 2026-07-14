"use client";

import Icon from "./Icon";
import { Vendor } from "@/types";

interface CascadeWarningProps {
  vendor: Vendor;
  mode: "select" | "deselect";
  remainingFinalizes: number;
  maxFinalizes: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CascadeWarning({ vendor, mode, remainingFinalizes, maxFinalizes, onConfirm, onCancel }: CascadeWarningProps) {
  const isSelect = mode === "select";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-orange/20 to-pink/20 flex items-center justify-center mb-4">
          <Icon name={isSelect ? "swap_horiz" : "remove_circle"} size={28} className="text-orange" />
        </div>

        <h3 className="text-lg font-bold text-amber-900 text-center mb-2">
          {isSelect ? "Pilih Vendor Final?" : "Hapus Vendor Final?"}
        </h3>

        <div className="bg-cream rounded-xl p-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center">
              <Icon name="storefront" size={18} className="text-orange" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">{vendor.name}</p>
              <p className="text-[11px] text-amber-800/50">Prioritas #{vendor.priority}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          {isSelect ? (
            <>
              <div className="flex items-start gap-2.5 text-sm text-amber-800/70">
                <Icon name="info" size={16} className="text-orange mt-0.5 shrink-0" />
                <span>Vendor akan muncul di <strong>Vendor Tracker</strong></span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-amber-800/70">
                <Icon name="receipt_long" size={16} className="text-orange mt-0.5 shrink-0" />
                <span>Invoice dapat dikaitkan dengan kategori ini</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-amber-800/70">
                <Icon name="assignment" size={16} className="text-orange mt-0.5 shrink-0" />
                <span>Task vendor akan terlihat di halaman Vendor Tracker</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-red">
                <Icon name="warning" size={16} className="text-red mt-0.5 shrink-0" />
                <span>Mengganti vendor final nantinya akan mempertahankan invoice dan task yang sudah ada</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm font-medium text-red bg-red/5 rounded-xl p-3 border border-red/20">
                <Icon name="gavel" size={16} className="text-red mt-0.5 shrink-0" />
                <span>Sisa finalisasi: <strong>{remainingFinalizes}x</strong> dari maksimal {maxFinalizes}x. Setelah habis, tidak bisa mengganti vendor final lagi tanpa menghubungi admin.</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2.5 text-sm text-amber-800/70">
                <Icon name="info" size={16} className="text-red mt-0.5 shrink-0" />
                <span>Vendor akan dihapus dari <strong>Vendor Tracker</strong></span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-amber-800/70">
                <Icon name="receipt_long" size={16} className="text-red mt-0.5 shrink-0" />
                <span>Invoice tetap ada dan masih terhubung ke kategori ini</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-amber-800/70">
                <Icon name="assignment" size={16} className="text-red mt-0.5 shrink-0" />
                <span>Task vendor akan tetap tersimpan</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm font-medium text-red bg-red/5 rounded-xl p-3 border border-red/20">
                <Icon name="gavel" size={16} className="text-red mt-0.5 shrink-0" />
                <span>Sisa finalisasi: <strong>{remainingFinalizes}x</strong> dari maksimal {maxFinalizes}x. Menghapus vendor final tetap menghabiskan kuota finalisasi.</span>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel}
            className="cursor-pointer flex-1 py-3 rounded-xl border border-gold/40 text-amber-900 font-medium hover:bg-cream transition-colors">
            Batal
          </button>
          <button onClick={onConfirm}
            className={`cursor-pointer flex-1 py-3 rounded-xl text-white font-medium transition-colors shadow-sm ${
              isSelect ? "bg-orange hover:bg-orange/90" : "bg-red hover:bg-red/90"
            }`}>
            {isSelect ? "Ya, Pilih" : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
