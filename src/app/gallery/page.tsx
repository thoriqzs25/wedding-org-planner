"use client";

import { useState } from "react";
import { mockGalleryItems, mockNecessities } from "@/data/mock";
import { GalleryItem } from "@/types";
import Icon from "@/components/Icon";
import GalleryFormModal from "@/components/GalleryFormModal";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function GalleryPage() {
  const [items, setItems] = useState(mockGalleryItems);
  const [filterNec, setFilterNec] = useState<string>("all");
  const [editingItem, setEditingItem] = useState<GalleryItem | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = items
    .filter((item) => filterNec === "all" || item.necessityId === filterNec)
    .filter((item) => item.description.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (data: Omit<GalleryItem, "id"> & { id?: string }) => {
    if (data.id) {
      setItems((prev) => prev.map((i) => (i.id === data.id ? { ...i, ...data } : i)));
    } else {
      setItems([...items, { ...data, id: `g${Date.now()}` } as GalleryItem]);
    }
    setShowForm(false);
    setEditingItem(undefined);
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
            Galeri Inspirasi <Icon name="auto_awesome" size={24} className="text-gold" />
          </h1>
          <p className="text-amber-800/60">Kumpulan referensi untuk pernikahanmu</p>
        </div>
        <button onClick={() => { setEditingItem(undefined); setShowForm(true); }}
          className="flex items-center gap-2 px-5 min-h-[44px] bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm active:scale-90">
          <Icon name="add" size={18} /> Tambah Inspirasi
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari inspirasi..."
            className="w-full pl-9 pr-4 min-h-[44px] rounded-xl border border-gold/40 bg-white text-sm text-amber-900 focus:outline-none focus:border-orange" />
        </div>
        <select value={filterNec} onChange={(e) => setFilterNec(e.target.value)}
          className="px-4 min-h-[44px] rounded-xl border border-gold/40 bg-white text-sm text-amber-900 focus:outline-none focus:border-orange">
          <option value="all">Semua Kategori</option>
          {mockNecessities.map((n) => (<option key={n.id} value={n.id}>{n.name}</option>))}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-amber-800/40">
          <Icon name={search ? "search" : "inbox"} size={40} className="mb-3 text-amber-800/30" />
          <p className="text-sm">{search ? "Tidak ada inspirasi sesuai pencarian" : "Belum ada inspirasi"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id}
              className="bg-white rounded-2xl border border-gold/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              {item.type === "youtube" ? (
                <div className="aspect-video">
                  <iframe src={item.link} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
              ) : (
                <div className="aspect-video bg-cream flex items-center justify-center text-amber-800/30 text-sm">
                  <div className="flex items-center gap-2">
                    <Icon name={item.type === "image" ? "image" : "link"} size={18} />
                    {item.type === "image" ? "Gambar" : "Link"}
                  </div>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-amber-900 font-medium flex-1">{item.description}</p>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <button onClick={() => { setEditingItem(item); setShowForm(true); }}
                      className="flex items-center justify-center w-11 h-11 rounded-xl text-amber-800/30 hover:text-orange hover:bg-gold/20 transition-colors active:scale-90">
                      <Icon name="edit" size={16} />
                    </button>
                    <button onClick={() => setDeleteId(item.id)}
                      className="flex items-center justify-center w-11 h-11 rounded-xl text-amber-800/30 hover:text-pink hover:bg-pink/10 transition-colors active:scale-90">
                      <Icon name="delete" size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-amber-800/40 capitalize">
                    {mockNecessities.find((n) => n.id === item.necessityId)?.name}
                  </span>
                  {item.type !== "youtube" && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-orange hover:underline flex items-center gap-1">Buka <Icon name="open_in_new" size={14} /></a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <GalleryFormModal item={editingItem} onSave={handleSave} onClose={() => { setShowForm(false); setEditingItem(undefined); }} />
      )}
      {deleteId && (
        <ConfirmDialog title="Hapus Inspirasi" message="Yakin ingin menghapus inspirasi ini?"
          onConfirm={() => { setItems(items.filter((i) => i.id !== deleteId)); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
}
