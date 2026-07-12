"use client";

import { useState } from "react";
import { mockNecessities } from "@/data/mock";
import { Vendor } from "@/types";
import { getNecessityIcon, getNecessityColor } from "@/data/necessityIcons";
import VendorModal from "@/components/VendorModal";
import VendorFormModal from "@/components/VendorFormModal";
import Icon from "@/components/Icon";

export default function VendorsPage() {
  const [necessities, setNecessities] = useState(mockNecessities);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [editingVendor, setEditingVendor] = useState<Vendor | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [filterNec, setFilterNec] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"priority" | "budget">("priority");
  const [search, setSearch] = useState("");

  const allVendors = necessities.flatMap((n) =>
    n.vendors.map((v) => ({ ...v, necessityName: n.name, necessityId: n.id }))
  );

  const filtered = allVendors
    .filter((v) => (filterNec === "all" || v.necessityId === filterNec))
    .filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortBy === "priority" ? a.priority - b.priority : a.budget - b.budget
    );

  const handleSave = (data: Omit<Vendor, "id"> & { id?: string }) => {
    setNecessities((prev) =>
      prev.map((n) => {
        if (n.id !== data.necessityId) return n;
        if (data.id) {
          return { ...n, vendors: n.vendors.map((v) => v.id === data.id ? { ...v, ...data } : v) };
        }
        return { ...n, vendors: [...n.vendors, { ...data, id: `v${Date.now()}` } as Vendor] };
      })
    );
    setShowForm(false);
    setEditingVendor(undefined);
    setSelectedVendor(null);
  };

  const handleDelete = (vendorId: string) => {
    setNecessities((prev) =>
      prev.map((n) => ({ ...n, vendors: n.vendors.filter((v) => v.id !== vendorId) }))
    );
    setSelectedVendor(null);
  };

  const handleEdit = (v: Vendor) => {
    setSelectedVendor(null);
    setEditingVendor(v);
    setShowForm(true);
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-amber-900">Semua Vendor</h1>
          <p className="text-amber-800/60">{allVendors.length} vendor terdaftar</p>
        </div>
        <button onClick={() => { setEditingVendor(undefined); setShowForm(true); }}
          className="flex items-center gap-2 px-5 min-h-[44px] bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm active:scale-90">
          <Icon name="add" size={18} /> Tambah Vendor
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari vendor..."
            className="w-full pl-9 pr-4 min-h-[44px] rounded-xl border border-gold/40 bg-white text-sm text-amber-900 focus:outline-none focus:border-orange" />
        </div>
        <select value={filterNec} onChange={(e) => setFilterNec(e.target.value)}
          className="px-4 min-h-[44px] rounded-xl border border-gold/40 bg-white text-sm text-amber-900 focus:outline-none focus:border-orange">
          <option value="all">Semua Kebutuhan</option>
          {necessities.map((n) => (<option key={n.id} value={n.id}>{n.name}</option>))}
        </select>
        <div className="flex bg-white rounded-xl border border-gold/40 overflow-hidden">
          <button onClick={() => setSortBy("priority")}
            className={`px-4 min-h-[44px] text-sm font-medium transition-colors ${sortBy === "priority" ? "bg-orange text-white" : "text-amber-900/60 hover:text-orange"}`}>Prioritas</button>
          <button onClick={() => setSortBy("budget")}
            className={`px-4 min-h-[44px] text-sm font-medium transition-colors ${sortBy === "budget" ? "bg-orange text-white" : "text-amber-900/60 hover:text-orange"}`}>Budget</button>
        </div>
      </div>

      {/* Vendor cards — unified sticker style */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-amber-800/40">
          <Icon name="storefront" size={40} className="mb-3 text-amber-800/30" />
          <p className="text-sm">{search ? "Tidak ada vendor sesuai pencarian" : "Belum ada vendor"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((vendor) => {
            const c = getNecessityColor(vendor.necessityId);
            const nec = necessities.find((n) => n.id === vendor.necessityId);
            return (
              <button key={vendor.id} onClick={() => setSelectedVendor(vendor)}
                className={`text-left ${c.bg} ${c.border} border rounded-xl p-5 hover:shadow-md transition-all group`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                    <Icon name={getNecessityIcon(vendor.necessityId, nec?.icon)} size={20} className={c.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-semibold ${c.text} truncate`}>{vendor.name}</h3>
                      {vendor.isRecommended && (
                        <span className="text-[9px] bg-white/80 text-orange px-1.5 py-0.5 rounded-full shrink-0">Rek.</span>
                      )}
                    </div>
                    <p className="text-[11px] text-amber-800/50 truncate">{(vendor as Vendor & { necessityName: string }).necessityName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-amber-800/50 flex items-center gap-1">
                    <Icon name="format_list_numbered" size={12} />#{vendor.priority}
                  </span>
                  <span className="text-amber-800/50 flex items-center gap-1">
                    <Icon name="account_balance_wallet" size={12} />Rp {vendor.budget.toLocaleString()}
                  </span>
                </div>
                {vendor.pros.length > 0 && (
                  <p className="text-[11px] text-green mt-2 truncate flex items-center gap-1">
                    <Icon name="check_circle" size={12} filled /> {vendor.pros[0]}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}

      {selectedVendor && (
        <VendorModal vendor={selectedVendor} onClose={() => setSelectedVendor(null)}
          onEdit={selectedVendor.isRecommended ? undefined : handleEdit}
          onDelete={selectedVendor.isRecommended ? undefined : handleDelete} />
      )}
      {showForm && (
        <VendorFormModal vendor={editingVendor} necessityId={editingVendor?.necessityId ?? necessities[0]?.id ?? ""}
          onSave={handleSave} onClose={() => { setShowForm(false); setEditingVendor(undefined); }} />
      )}
    </div>
  );
}
