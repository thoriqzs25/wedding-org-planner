"use client";

import { useState } from "react";
import { mockInvoices, getTotalBudget, getTotalSpent } from "@/data/mock";
import { Invoice } from "@/types";
import Icon from "@/components/Icon";
import InvoiceFormModal from "@/components/InvoiceFormModal";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalBudget = getTotalBudget();
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
          className="flex items-center gap-2 px-5 py-2.5 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm">
          <Icon name="add" size={18} /> Tambah Invoice
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <p className="text-xs text-amber-800/60">Total Budget</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">Rp {totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <p className="text-xs text-amber-800/60">Terpakai</p>
          <p className="text-2xl font-bold text-orange mt-1">Rp {totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <p className="text-xs text-amber-800/60">Sisa Budget</p>
          <p className={`text-2xl font-bold mt-1 ${remaining >= 0 ? "text-green" : "text-pink"}`}>
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
              <div key={inv.id} className="flex items-center gap-4 p-4 rounded-xl border border-gold/20 group">
                <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center shrink-0">
                  <Icon name="receipt_long" size={24} className="text-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-amber-900">{inv.vendorName}</p>
                  <p className="text-xs text-amber-800/50">{inv.notes} • {new Date(inv.date).toLocaleDateString("id-ID")}</p>
                </div>
                <p className="text-sm font-semibold text-orange">Rp {inv.amount.toLocaleString()}</p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingInvoice(inv); setShowForm(true); }}
                    className="text-amber-800/30 hover:text-orange transition-colors"><Icon name="edit" size={16} /></button>
                  <button onClick={() => setDeleteId(inv.id)}
                    className="text-amber-800/30 hover:text-pink transition-colors"><Icon name="delete" size={16} /></button>
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
    </div>
  );
}
