"use client";

import { useState } from "react";
import { mockNecessities } from "@/data/mock";
import { Vendor } from "@/types";
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
    n.vendors.map((v) => ({ ...v, necessityName: n.name }))
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
          className="flex items-center gap-2 px-5 py-2.5 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm">
          <Icon name="add" size={18} /> Tambah Vendor
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari vendor..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gold/40 bg-white text-sm text-amber-900 focus:outline-none focus:border-orange" />
        </div>
        <select value={filterNec} onChange={(e) => setFilterNec(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gold/40 bg-white text-sm text-amber-900 focus:outline-none focus:border-orange">
          <option value="all">Semua Kebutuhan</option>
          {necessities.map((n) => (<option key={n.id} value={n.id}>{n.name}</option>))}
        </select>
        <div className="flex bg-white rounded-xl border border-gold/40 overflow-hidden">
          <button onClick={() => setSortBy("priority")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${sortBy === "priority" ? "bg-orange text-white" : "text-amber-900/60 hover:text-orange"}`}>Prioritas</button>
          <button onClick={() => setSortBy("budget")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${sortBy === "budget" ? "bg-orange text-white" : "text-amber-900/60 hover:text-orange"}`}>Budget</button>
        </div>
      </div>

      {/* Vendor list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-amber-800/40">
          <Icon name="storefront" size={40} className="mb-3 text-amber-800/30" />
          <p className="text-sm">{search ? "Tidak ada vendor sesuai pencarian" : "Belum ada vendor"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((vendor) => (
            <button key={vendor.id} onClick={() => setSelectedVendor(vendor)}
              className="text-left bg-white rounded-2xl border border-gold/30 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-amber-900">{vendor.name}</h3>
                  <p className="text-xs text-amber-800/50">{(vendor as Vendor & { necessityName: string }).necessityName}</p>
                </div>
                {vendor.isRecommended && <span className="text-[10px] bg-orange/10 text-orange px-2 py-0.5 rounded-full">Rek.</span>}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-amber-800/60">Prioritas #{vendor.priority}</span>
                <span className="text-amber-800/60">Rp {vendor.budget.toLocaleString()}</span>
              </div>
              {vendor.pros.length > 0 && (
                <p className="text-xs text-green mt-2 truncate flex items-center gap-1">
                  <Icon name="check_circle" size={14} filled /> {vendor.pros[0]}
                </p>
              )}
            </button>
          ))}
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
