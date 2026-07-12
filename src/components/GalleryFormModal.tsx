"use client";

import { useState } from "react";
import { GalleryItem } from "@/types";
import { mockNecessities } from "@/data/mock";
import Icon from "./Icon";

interface GalleryFormModalProps {
  item?: GalleryItem;
  onSave: (item: Omit<GalleryItem, "id"> & { id?: string }) => void;
  onClose: () => void;
}

export default function GalleryFormModal({ item, onSave, onClose }: GalleryFormModalProps) {
  const [link, setLink] = useState(item?.link ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [necessityId, setNecessityId] = useState(item?.necessityId ?? mockNecessities[0]?.id ?? "");
  const [type, setType] = useState(item?.type ?? "youtube");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: item?.id, link, description, necessityId, type });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gold/30 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-amber-900">
            {item ? "Edit Inspirasi" : "Tambah Inspirasi"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-amber-900/50 hover:text-amber-900">
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Tipe</label>
            <select value={type} onChange={(e) => setType(e.target.value as GalleryItem["type"])}
              className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900">
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="image">Gambar</option>
              <option value="other">Link Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Link</label>
            <input value={link} onChange={(e) => setLink(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900"
              placeholder={type === "youtube" ? "https://www.youtube.com/embed/..." : "https://..."} />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Deskripsi</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900"
              placeholder="Cth: Inspirasi dekorasi rustic" />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Kategori</label>
            <select value={necessityId} onChange={(e) => setNecessityId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900">
              {mockNecessities.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>

          <button type="submit"
            className="w-full py-3 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm">
            {item ? "Simpan Perubahan" : "Tambah Inspirasi"}
          </button>
        </form>
      </div>
    </div>
  );
}
