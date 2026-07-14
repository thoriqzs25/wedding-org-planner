"use client";

import { useState } from "react";
import { Invoice, WeddingElement } from "@/types";
import Icon from "./Icon";

interface InvoiceFormModalProps {
  invoice?: Invoice;
  necessities: WeddingElement[];
  onSave: (inv: Omit<Invoice, "id"> & { id?: string }) => void;
  onClose: () => void;
}

export default function InvoiceFormModal({ invoice, necessities, onSave, onClose }: InvoiceFormModalProps) {
  const selectedCategories = necessities.filter((n) => n.selectedVendorId);
  const [selectedNecId, setSelectedNecId] = useState(invoice?.weddingElementId ?? selectedCategories[0]?.id ?? "");
  const [amount, setAmount] = useState(invoice?.amount ?? 0);
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [date, setDate] = useState(invoice?.date ?? new Date().toISOString().split("T")[0]);

  const selectedNec = necessities.find((n) => n.id === selectedNecId);
  const selectedVendor = selectedNec
    ? selectedNec.vendors.find((v) => v.id === selectedNec.selectedVendorId)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: invoice?.id,
      weddingElementId: selectedNecId,
      weddingElementName: selectedNec?.name ?? "",
      vendorName: selectedVendor?.name || "",
      photoUrl: invoice?.photoUrl ?? "",
      amount,
      notes,
      date,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gold/30 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-amber-900">{invoice ? "Edit Invoice" : "Tambah Invoice"}</h2>
          <button onClick={onClose} className="cursor-pointer w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-amber-900/50 hover:text-amber-900">
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Pilih Kategori (hanya yang punya selected vendor) */}
          {selectedCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-amber-900/70 mb-1">Kategori (Vendor Final)</label>
              <div className="relative">
                <select value={selectedNecId} onChange={(e) => setSelectedNecId(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900 text-sm appearance-none">
                  {selectedCategories.map((n) => {
                    const vendor = n.vendors.find((v) => v.id === n.selectedVendorId);
                    return (
                      <option key={n.id} value={n.id}>
                        {n.name} — {vendor?.name ?? "Vendor terpilih"}
                      </option>
                    );
                  })}
                </select>
                <Icon name="expand_more" size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-800/40 pointer-events-none" />
              </div>
              <p className="text-[11px] text-amber-800/40 mt-1.5">
                Invoice akan tercatat atas kategori <strong>{selectedNec?.name}</strong>
                {selectedVendor ? ` — vendor final: ${selectedVendor.name}` : ""}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
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
