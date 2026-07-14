"use client";

import { useState } from "react";
import { mockInvoices, mockNecessities, mockQuestionnaire } from "@/data/mock";
import { Invoice } from "@/types";
import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import InvoiceFormModal from "@/components/InvoiceFormModal";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [necessities, setNecessities] = useState(mockNecessities);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterNec, setFilterNec] = useState("all");
  const [filterAmountMin, setFilterAmountMin] = useState("");
  const [filterAmountMax, setFilterAmountMax] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const totalBudget = mockQuestionnaire.budget;
  const totalSpent = invoices.reduce((sum, i) => sum + i.amount, 0);
  const remaining = totalBudget - totalSpent;
  const selectedCount = necessities.filter((n) => n.selectedVendorId).length;

  const categoryNames = [...new Set(invoices.map((i) => i.necessityName))];

  const filteredInvoices = invoices.filter((inv) => {
    if (filterNec !== "all" && inv.necessityName !== filterNec) return false;
    if (filterAmountMin && inv.amount < Number(filterAmountMin)) return false;
    if (filterAmountMax && inv.amount > Number(filterAmountMax)) return false;
    if (filterDateFrom && inv.date < filterDateFrom) return false;
    if (filterDateTo && inv.date > filterDateTo) return false;
    return true;
  });

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
    <div id="invoices-container" className="max-w-5xl space-y-6">
      <div id="invoices-header" className="flex items-center justify-between">
        <div id="invoices-title-wrapper">
          <Tooltip content="Catat dan pantau semua pengeluaran pernikahan"><h1 id="invoices-title" className="text-2xl font-bold text-amber-900">Invoice & Pembayaran</h1></Tooltip>
          <p id="invoices-subtitle" className="text-amber-800/60">Pantau pengeluaran pernikahanmu</p>
        </div>
        <button id="invoices-add-btn" onClick={() => { setEditingInvoice(undefined); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm">
          <Icon name="add" size={18} /> Tambah Invoice
        </button>
      </div>

      {/* Explanation */}
      {selectedCount === 0 ? (
        <div id="invoices-explanation-empty" className="bg-gold/10 border border-gold/30 rounded-2xl p-5 text-sm text-amber-800/60">
          <p id="invoices-explanation-text">Belum ada vendor final yang dipilih. Invoice akan tercatat per kategori (kebutuhan) dan otomatis terhubung ke vendor final yang sudah dipilih di halaman <strong id="invoices-explanation-highlight">Kebutuhan</strong>.</p>
        </div>
      ) : (
        <div id="invoices-explanation-active" className="bg-orange/5 border border-orange/20 rounded-2xl p-5 text-sm text-amber-800/60 flex items-center gap-3">
          <Icon name="info" size={20} className="text-orange shrink-0" />
          <p id="invoices-explanation-info">Invoice tercatat per kategori kebutuhan dan terhubung ke <strong id="invoices-explanation-emphasis">vendor final</strong> yang sudah dipilih. Pilih kategori saat menambah invoice.</p>
        </div>
      )}

      {/* Summary */}
      <div id="invoices-summary" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div id="invoices-summary-budget" className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <p id="invoices-summary-budget-label" className="text-xs text-amber-800/60">Total Budget</p>
          <p id="invoices-summary-budget-value" className="text-2xl font-bold text-amber-900 mt-1">Rp {totalBudget.toLocaleString()}</p>
        </div>
        <div id="invoices-summary-spent" className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <p id="invoices-summary-spent-label" className="text-xs text-amber-800/60">Terpakai</p>
          <p id="invoices-summary-spent-value" className="text-2xl font-bold text-orange mt-1">Rp {totalSpent.toLocaleString()}</p>
        </div>
        <div id="invoices-summary-remaining" className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <p id="invoices-summary-remaining-label" className="text-xs text-amber-800/60">Sisa Budget</p>
          <p id="invoices-summary-remaining-value" className={`text-2xl font-bold mt-1 ${remaining >= 0 ? "text-green" : "text-red"}`}>
            Rp {remaining.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Invoice list */}
      <div id="invoices-list" className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
        <Tooltip content="Daftar invoice yang sudah dicatat"><h2 id="invoices-list-title" className="text-lg font-semibold text-amber-900 mb-4">Riwayat Pembayaran</h2></Tooltip>

        {/* Filters */}
        <div id="invoices-filters" className="flex flex-wrap items-end gap-3 mb-5 p-4 rounded-xl bg-cream/50 border border-gold/20">
          <div id="invoices-filter-category" className="min-w-[180px]">
            <label id="invoices-filter-category-label" className="block text-[11px] font-medium text-amber-800/60 mb-1">Kategori</label>
            <div id="invoices-filter-category-select-wrapper" className="relative">
              <select id="invoices-filter-category-select" value={filterNec} onChange={(e) => setFilterNec(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gold/30 bg-white text-sm text-amber-900 appearance-none focus:outline-none focus:border-orange">
                <option id="invoices-filter-category-option-all" value="all">Semua Kategori</option>
                {categoryNames.map((name) => (
                  <option id={`invoices-filter-category-option-${name}`} key={name} value={name}>{name}</option>
                ))}
              </select>
              <Icon name="expand_more" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-800/30 pointer-events-none" />
            </div>
          </div>
          <div id="invoices-filter-min-amount" className="min-w-[140px]">
            <label id="invoices-filter-min-amount-label" className="block text-[11px] font-medium text-amber-800/60 mb-1">Min Amount (Rp)</label>
            <input id="invoices-filter-min-amount-input" type="number" min={0} value={filterAmountMin} onChange={(e) => setFilterAmountMin(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gold/30 bg-white text-sm text-amber-900 focus:outline-none focus:border-orange"
              placeholder="0" />
          </div>
          <div id="invoices-filter-max-amount" className="min-w-[140px]">
            <label id="invoices-filter-max-amount-label" className="block text-[11px] font-medium text-amber-800/60 mb-1">Max Amount (Rp)</label>
            <input id="invoices-filter-max-amount-input" type="number" min={0} value={filterAmountMax} onChange={(e) => setFilterAmountMax(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gold/30 bg-white text-sm text-amber-900 focus:outline-none focus:border-orange"
              placeholder="999jt" />
          </div>
          <div id="invoices-filter-date-from" className="min-w-[140px]">
            <label id="invoices-filter-date-from-label" className="block text-[11px] font-medium text-amber-800/60 mb-1">Dari Tanggal</label>
            <input id="invoices-filter-date-from-input" type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gold/30 bg-white text-sm text-amber-900 focus:outline-none focus:border-orange" />
          </div>
          <div id="invoices-filter-date-to" className="min-w-[140px]">
            <label id="invoices-filter-date-to-label" className="block text-[11px] font-medium text-amber-800/60 mb-1">Sampai Tanggal</label>
            <input id="invoices-filter-date-to-input" type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gold/30 bg-white text-sm text-amber-900 focus:outline-none focus:border-orange" />
          </div>
          {(filterNec !== "all" || filterAmountMin || filterAmountMax || filterDateFrom || filterDateTo) && (
            <button id="invoices-filter-reset-btn" onClick={() => { setFilterNec("all"); setFilterAmountMin(""); setFilterAmountMax(""); setFilterDateFrom(""); setFilterDateTo(""); }}
              className="px-3 py-2.5 rounded-xl border border-gold/30 text-xs text-amber-800/50 hover:text-pink hover:border-pink/40 transition-colors flex items-center gap-1">
              <Icon name="close" size={14} /> Reset
            </button>
          )}
        </div>

        {filteredInvoices.length === 0 ? (
          <div id="invoices-empty-state" className="text-center py-10 text-amber-800/40">
            <Icon name="receipt_long" size={40} className="mb-3 text-amber-800/30" />
            <p id="invoices-empty-text" className="text-sm">{invoices.length === 0 ? "Belum ada pembayaran" : "Tidak ada invoice yang cocok dengan filter"}</p>
          </div>
        ) : (
          <div id="invoices-list-items" className="space-y-3">
            {filteredInvoices.map((inv) => (
              <div id={`invoices-item-${inv.id}`} key={inv.id} className="flex items-center gap-4 p-4 rounded-xl border border-gold/20 group">
                <div id={`invoices-item-icon-${inv.id}`} className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center shrink-0">
                  <Icon name="receipt_long" size={24} className="text-orange" />
                </div>
                <div id={`invoices-item-info-${inv.id}`} className="flex-1 min-w-0">
                  <div id={`invoices-item-name-row-${inv.id}`} className="flex items-center gap-2">
                    <p id={`invoices-item-vendor-${inv.id}`} className="text-sm font-medium text-amber-900">{inv.vendorName}</p>
                    <span id={`invoices-item-category-${inv.id}`} className="text-[10px] bg-orange/10 text-orange px-1.5 py-0.5 rounded-full shrink-0">{inv.necessityName}</span>
                  </div>
                  <p id={`invoices-item-notes-${inv.id}`} className="text-xs text-amber-800/50 mt-0.5">{inv.notes} • {new Date(inv.date).toLocaleDateString("id-ID")}</p>
                </div>
                <p id={`invoices-item-amount-${inv.id}`} className="text-sm font-semibold text-orange">Rp {inv.amount.toLocaleString()}</p>
                <div id={`invoices-item-actions-${inv.id}`} className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button id={`invoices-item-edit-btn-${inv.id}`} onClick={() => { setEditingInvoice(inv); setShowForm(true); }}
                    className="text-amber-800/30 hover:text-orange transition-colors"><Icon name="edit" size={16} /></button>
                  <button id={`invoices-item-delete-btn-${inv.id}`} onClick={() => setDeleteId(inv.id)}
                    className="text-amber-800/30 hover:text-red transition-colors"><Icon name="delete" size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {invoices.length > 0 && filteredInvoices.length !== invoices.length && (
          <p id="invoices-list-info" className="text-xs text-amber-800/40 mt-3 text-center">
            Menampilkan {filteredInvoices.length} dari {invoices.length} invoice
          </p>
        )}
      </div>

      {showForm && (
        <InvoiceFormModal
          invoice={editingInvoice}
          necessities={necessities}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingInvoice(undefined); }} />
      )}
      {deleteId && (
        <ConfirmDialog title="Hapus Invoice" message="Yakin ingin menghapus invoice ini?"
          onConfirm={() => { setInvoices(invoices.filter((i) => i.id !== deleteId)); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
}
