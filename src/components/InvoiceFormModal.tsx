"use client";

import { useState } from "react";
import { Invoice } from "@/types";
import Icon from "./Icon";

interface InvoiceFormModalProps {
  invoice?: Invoice;
  onSave: (inv: Omit<Invoice, "id"> & { id?: string }) => void;
  onClose: () => void;
}

export default function InvoiceFormModal({ invoice, onSave, onClose }: InvoiceFormModalProps) {
  const [vendorName, setVendorName] = useState(invoice?.vendorName ?? "");
  const [amount, setAmount] = useState(invoice?.amount ?? 0);
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [date, setDate] = useState(invoice?.date ?? new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: invoice?.id, vendorId: invoice?.vendorId ?? "", vendorName, photoUrl: invoice?.photoUrl ?? "", amount, notes, date });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gold/30 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-amber-900">
            {invoice ? "Edit Invoice" : "Tambah Invoice"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-amber-900/50 hover:text-amber-900">
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Nama Vendor</label>
            <input value={vendorName} onChange={(e) => setVendorName(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Jumlah (Rp)</label>
            <input type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} required
              className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Tanggal</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Catatan</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900"
              placeholder="Cth: DP 50%" />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Foto Invoice</label>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-gold/40 bg-cream/50">
              <Icon name="upload_file" size={24} className="text-amber-800/40" />
              <span className="text-sm text-amber-800/40">Klik untuk upload (mock)</span>
            </div>
          </div>

          <button type="submit"
            className="w-full py-3 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm">
            {invoice ? "Simpan Perubahan" : "Tambah Invoice"}
          </button>
        </form>
      </div>
    </div>
  );
}
