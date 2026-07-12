"use client";

import { useState } from "react";
import { Todo } from "@/types";
import Icon from "./Icon";

interface TodoFormModalProps {
  todo?: Todo;
  necessityId: string;
  onSave: (todo: Omit<Todo, "id"> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export default function TodoFormModal({ todo, necessityId, onSave, onDelete, onClose }: TodoFormModalProps) {
  const [title, setTitle] = useState(todo?.title ?? "");
  const [pic, setPic] = useState(todo?.pic ?? "");
  const [dueDate, setDueDate] = useState(todo?.dueDate ?? "");
  const [description, setDescription] = useState(todo?.description ?? "");
  const [link, setLink] = useState(todo?.link ?? "");
  const [status, setStatus] = useState<Todo["status"]>(todo?.status ?? "pending");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: todo?.id, necessityId, title, pic, dueDate, status, description, link });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gold/30 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-amber-900">
            {todo ? "Edit To-Do" : "Tambah To-Do"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-amber-900/50 hover:text-amber-900">
            <Icon name="close" size={20} />
          </button>
        </div>

        {confirmDelete ? (
          <div className="p-6 text-center space-y-4">
            <Icon name="warning" size={40} className="text-pink" />
            <p className="text-amber-900 font-medium">Hapus to-do ini?</p>
            <p className="text-sm text-amber-800/50">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(false)} className="px-5 py-2.5 rounded-xl border border-gold/40 text-amber-900 font-medium hover:bg-cream">
                Batal
              </button>
              <button onClick={() => onDelete?.(todo!.id)} className="px-5 py-2.5 bg-pink text-white rounded-xl font-medium hover:bg-pink/90">
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-900/70 mb-1">Judul</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-900/70 mb-1">PIC</label>
                <input value={pic} onChange={(e) => setPic(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900/70 mb-1">Deadline</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900/70 mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as Todo["status"])}
                className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900">
                <option value="pending">Pending</option>
                <option value="in_progress">Diproses</option>
                <option value="done">Selesai</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900/70 mb-1">Deskripsi</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900/70 mb-1">Link Referensi</label>
              <input value={link} onChange={(e) => setLink(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
            </div>

            <div className="flex gap-3">
              {todo && onDelete && (
                <button type="button" onClick={() => setConfirmDelete(true)}
                  className="px-5 py-3 border border-pink/30 text-pink rounded-xl font-medium hover:bg-pink/5 transition-colors">
                  Hapus
                </button>
              )}
              <button type="submit" className="flex-1 py-3 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm">
                {todo ? "Simpan Perubahan" : "Tambah To-Do"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
