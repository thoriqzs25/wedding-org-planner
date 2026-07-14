"use client";

import { useState } from "react";
import { CalendarEvent } from "@/types";
import { mockNecessities } from "@/data/mock";
import Icon from "./Icon";

interface CalendarFormModalProps {
  event?: CalendarEvent;
  onSave: (evt: Omit<CalendarEvent, "id"> & { id?: string }) => void;
  onClose: () => void;
}

export default function CalendarFormModal({ event, onSave, onClose }: CalendarFormModalProps) {
  const [title, setTitle] = useState(event?.title ?? "");
  const [date, setDate] = useState(event?.date ?? new Date().toISOString().split("T")[0]);
  const [necessityId, setNecessityId] = useState(event?.necessityId ?? mockNecessities[0]?.id ?? "");
  const [description, setDescription] = useState(event?.description ?? "");

  const necessityName = mockNecessities.find((n) => n.id === necessityId)?.name ?? "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: event?.id, title, date, necessityId, necessityName, description });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gold/30 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-amber-900">
            {event ? "Edit Jadwal" : "Tambah Jadwal"}
          </h2>
          <button onClick={onClose} className="cursor-pointer w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-amber-900/50 hover:text-amber-900">
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Judul</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900"
              placeholder="Cth: Meeting WO" />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Tanggal</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Kebutuhan Terkait</label>
            <select value={necessityId} onChange={(e) => setNecessityId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900">
              {mockNecessities.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Deskripsi</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900"
              placeholder="Cth: Diskusi detail acara" />
          </div>

          <button type="submit"
            className="w-full py-3 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm">
            {event ? "Simpan Perubahan" : "Tambah Jadwal"}
          </button>
        </form>
      </div>
    </div>
  );
}
