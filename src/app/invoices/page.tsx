"use client";

import { useState } from "react";
import { mockInvoices, mockQuestionnaire, getTotalSpent } from "@/data/mock";
import { Invoice } from "@/types";
import Icon from "@/components/Icon";
import InvoiceFormModal from "@/components/InvoiceFormModal";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [totalBudget, setTotalBudget] = useState(mockQuestionnaire.budget);
  const [showBudgetEditor, setShowBudgetEditor] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(mockQuestionnaire.budget));

  const totalSpent = invoices.reduce((sum, i) => sum + i.amount, 0);
  const remaining = totalBudget - totalSpent;

  const handleSave = (data: Omit<Invoice, "id"> & { id?: string }) => {
    if (data.id) {
      setInvoices((prev) => prev.map((i) => (i.id === data.id ? { ...i, ...data } : i)));
    } else {
      setInvoices([...invoices, { ...data, id: `i${Date.now()}` } as Invoice]);
    }
    setShowForm(false);
    setEditingInvoice(undefined);
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-amber-900">Invoice & Pembayaran</h1>
          <p className="text-amber-800/60">Pantau pengeluaran pernikahanmu</p>
        </div>
        <button onClick={() => { setEditingInvoice(undefined); setShowForm(true); }}
          className="flex items-center gap-2 px-5 min-h-[44px] bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm active:scale-90">
          <Icon name="add" size={18} /> Tambah Invoice
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-gold/30 p-4 sm:p-5 shadow-sm relative group">
          <p className="text-xs text-amber-800/60">Total Budget</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-900 mt-1">Rp {totalBudget.toLocaleString()}</p>
          <button onClick={() => { setBudgetInput(String(totalBudget)); setShowBudgetEditor(true); }}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 rounded-lg text-amber-800/30 hover:text-orange hover:bg-gold/20 transition-all active:scale-90">
            <Icon name="edit" size={16} />
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-gold/30 p-4 sm:p-5 shadow-sm">
          <p className="text-xs text-amber-800/60">Terpakai</p>
          <p className="text-xl sm:text-2xl font-bold text-orange mt-1">Rp {totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gold/30 p-4 sm:p-5 shadow-sm">
          <p className="text-xs text-amber-800/60">Sisa Budget</p>
          <p className={`text-xl sm:text-2xl font-bold mt-1 ${remaining >= 0 ? "text-green" : "text-pink"}`}>
            Rp {remaining.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Invoice list */}
      <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-amber-900 mb-4">Riwayat Pembayaran</h2>

        {invoices.length === 0 ? (
          <div className="text-center py-10 text-amber-800/40">
            <Icon name="receipt_long" size={40} className="mb-3 text-amber-800/30" />
            <p className="text-sm">Belum ada pembayaran</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gold/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cream flex items-center justify-center shrink-0">
                  <Icon name="receipt_long" size={20} className="text-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-amber-900 truncate">{inv.vendorName}</p>
                  <p className="text-xs text-amber-800/50 truncate">{inv.notes} • {new Date(inv.date).toLocaleDateString("id-ID")}</p>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-orange shrink-0">Rp {inv.amount.toLocaleString()}</p>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingInvoice(inv); setShowForm(true); }}
                    className="flex items-center justify-center w-11 h-11 rounded-xl text-amber-800/30 hover:text-orange hover:bg-gold/20 transition-colors active:scale-90">
                    <Icon name="edit" size={16} />
                  </button>
                  <button onClick={() => setDeleteId(inv.id)}
                    className="flex items-center justify-center w-11 h-11 rounded-xl text-amber-800/30 hover:text-pink hover:bg-pink/10 transition-colors active:scale-90">
                    <Icon name="delete" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <InvoiceFormModal invoice={editingInvoice} onSave={handleSave} onClose={() => { setShowForm(false); setEditingInvoice(undefined); }} />
      )}
      {deleteId && (
        <ConfirmDialog title="Hapus Invoice" message="Yakin ingin menghapus invoice ini?"
          onConfirm={() => { setInvoices(invoices.filter((i) => i.id !== deleteId)); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)} />
      )}

      {showBudgetEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowBudgetEditor(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 space-y-5">
            <h3 className="text-lg font-semibold text-amber-900">Edit Total Budget</h3>
            <div>
              <label className="block text-sm font-medium text-amber-900/70 mb-1">Budget Amount (Rp)</label>
              <input type="number" value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 text-amber-900 placeholder-amber-800/30" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowBudgetEditor(false)}
                className="flex-1 min-h-[44px] rounded-xl border border-gold/40 text-amber-900 font-medium hover:bg-cream transition-colors">Batal</button>
              <button onClick={() => { setTotalBudget(Number(budgetInput) || 0); setShowBudgetEditor(false); }}
                className="flex-1 min-h-[44px] rounded-xl bg-orange text-white font-medium hover:bg-orange/90 transition-colors">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
