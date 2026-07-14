"use client";

import { useState } from "react";
import Icon from "./Icon";
import { availableIcons } from "@/data/availableIcons";
import { weddingElementColorPalette } from "@/data/weddingElementIcons";
import type { WeddingElementColor } from "@/types";

const recommended = [
  { name: "Venue", icon: "location_on" },
  { name: "Wedding Organizer", icon: "event_available" },
  { name: "Dekorasi", icon: "palette" },
  { name: "Katering", icon: "restaurant" },
  { name: "Musik", icon: "music_note" },
  { name: "Dokumentasi", icon: "photo_camera" },
  { name: "Undangan Fisik", icon: "mail" },
  { name: "Undangan Online", icon: "globe" },
  { name: "MC", icon: "mic" },
  { name: "Makeup & Hairdo", icon: "spa" },
  { name: "Mobil Pengantin", icon: "directions_car" },
  { name: "Prewedding", icon: "favorite" },
];

interface WeddingElementFormModalProps {
  existingNames: string[];
  onSave: (name: string, icon: string, color: WeddingElementColor) => void;
  onClose: () => void;
}

export default function WeddingElementFormModal({ existingNames, onSave, onClose }: WeddingElementFormModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("celebration");
  const [selectedColor, setSelectedColor] = useState<WeddingElementColor>("orange");

  const missing = recommended.filter((r) => {
    const lower = r.name.toLowerCase();
    return !existingNames.some((n) => n.toLowerCase() === lower);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), selectedIcon, selectedColor);
    }
  };

  const pickRecommended = (rec: typeof recommended[0]) => {
    setName(rec.name);
    setSelectedIcon(rec.icon);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gold/30 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-amber-900">Tambah Elemen Pernikahan</h2>
          <button onClick={onClose} className="cursor-pointer w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-amber-900/50 hover:text-amber-900">
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Recommended essentials */}
          {missing.length > 0 && (
            <div>
              <p className="text-xs font-medium text-amber-800/60 mb-2 flex items-center gap-1">
                <Icon name="auto_awesome" size={14} />
                Rekomendasi elemen pernikahan penting
              </p>
              <div className="flex flex-wrap gap-2">
                {missing.map((rec) => {
                  const isSelected = name === rec.name;
                  return (
                    <button key={rec.name} type="button" onClick={() => pickRecommended(rec)}
                      className={`cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-orange text-white shadow-sm"
                          : "bg-cream text-amber-800/70 hover:bg-orange/10 hover:text-orange border border-gold/20"
                      }`}>
                      <Icon name={rec.icon} size={14} />
                      {rec.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom name */}
          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">
              {name ? "Atau edit nama elemen" : "Nama elemen custom"}
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900"
              placeholder="Cth: Photo Booth" />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-3">Pilih Warna</label>
            <div className="flex gap-3">
              {weddingElementColorPalette.map((palette) => (
                <button key={palette.name} type="button"
                  onClick={() => setSelectedColor(palette.name)}
                  className={`cursor-pointer flex-1 h-12 rounded-xl flex items-center justify-center transition-all ${
                    selectedColor === palette.name
                      ? `${palette.bg} ${palette.border} border-2 scale-105 shadow-sm`
                      : `${palette.bg} border border-transparent hover:scale-105`
                  }`}
                  style={{ backgroundColor: palette.hex + "20" }}>
                  <span className={`w-5 h-5 rounded-full ${palette.bg} ${palette.border} border-2`}
                    style={{ backgroundColor: palette.hex, borderColor: palette.hex }} />
                </button>
              ))}
            </div>
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-3">Pilih Ikon</label>
            <div className="grid grid-cols-6 gap-2 max-h-[180px] overflow-y-auto p-2 -mx-2">
              {availableIcons.map((iconName) => (
                <button key={iconName} type="button"
                  onClick={() => setSelectedIcon(iconName)}
                  className={`cursor-pointer w-full aspect-square rounded-xl flex items-center justify-center transition-all ${
                    selectedIcon === iconName
                      ? "bg-orange text-white shadow-sm scale-110"
                      : "bg-cream text-amber-800/60 hover:bg-orange/10 hover:text-orange"
                  }`}>
                  <Icon name={iconName} size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className={`flex items-center gap-3 p-3 rounded-xl ${
            weddingElementColorPalette.find((c) => c.name === selectedColor)?.bg || "bg-cream/70"
          }`}>
            <div className={`w-10 h-10 rounded-xl ${
              weddingElementColorPalette.find((c) => c.name === selectedColor)?.bg || "bg-orange/10"
            } flex items-center justify-center`}>
              <Icon name={selectedIcon} size={20}
                className={weddingElementColorPalette.find((c) => c.name === selectedColor)?.text || "text-orange"} />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-900">{name || "Nama Elemen"}</p>
              <p className="text-xs text-amber-800/50">{selectedIcon}</p>
            </div>
          </div>

          <button type="submit"
            className="w-full py-3 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm">
            Tambah Elemen
          </button>
        </form>
      </div>
    </div>
  );
}
