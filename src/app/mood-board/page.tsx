"use client";

import { useState } from "react";
import Link from "next/link";
import { mockGalleryItems, mockNecessities } from "@/data/mock";
import { GalleryItem } from "@/types";
import { getNecessityIcon, getNecessityColor } from "@/data/necessityIcons";
import Icon from "@/components/Icon";
import GalleryFormModal from "@/components/GalleryFormModal";

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(/(?:embed\/|v=|\/)([a-zA-Z0-9_-]{11})/);
  if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
  return null;
}

function getTypeIcon(type: string): string {
  switch (type) {
    case "youtube": return "smart_display";
    case "tiktok": return "music_note";
    case "image": return "image";
    default: return "link";
  }
}

export default function MoodBoardPage() {
  const [items, setItems] = useState(mockGalleryItems);
  const [editingItem, setEditingItem] = useState<GalleryItem | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);

  const groups = mockNecessities
    .map((nec) => ({
      necessity: nec,
      items: items.filter((item) => item.necessityId === nec.id),
    }))
    .filter((g) => g.items.length > 0);

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
            Mood Board <Icon name="collections" size={24} className="text-gold" />
          </h1>
          <p className="text-amber-800/60">Kumpulan inspirasi pernikahanmu</p>
        </div>
        <button onClick={() => { setEditingItem(undefined); setShowForm(true); }}
          className="flex items-center gap-2 px-5 min-h-[44px] bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm active:scale-90">
          <Icon name="add" size={18} /> Tambah Inspirasi
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-16 text-amber-800/40">
          <Icon name="collections" size={40} className="mb-3 text-amber-800/30" />
          <p className="text-sm">Belum ada inspirasi</p>
          <p className="text-xs mt-1">Tambahkan inspirasi dari halaman kebutuhan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map(({ necessity, items: groupItems }) => {
            const c = getNecessityColor(necessity.id, necessity.color);
            const previews = groupItems.slice(0, 3);
            const remaining = groupItems.length - 3;

            return (
              <Link key={necessity.id} href={`/mood-board/${necessity.id}`}
                className={`grid grid-rows-[1fr_auto] rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group ${c.border}`}>

                {/* Preview grid */}
                {previews.length === 1 ? (
                  <div className="relative aspect-video bg-cream overflow-hidden">
                    <PreviewCell item={previews[0]} isLastWithOverlay={false} />
                  </div>
                ) : previews.length === 2 ? (
                  <div className="grid grid-cols-2 gap-0.5 bg-gold/10">
                    {previews.map((item) => (
                      <div key={item.id} className="relative aspect-[4/3] bg-cream overflow-hidden">
                        <PreviewCell item={item} isLastWithOverlay={false} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-0.5 bg-gold/10">
                    <div className="relative aspect-square bg-cream overflow-hidden row-span-2">
                      <PreviewCell item={previews[0]} isLastWithOverlay={false} />
                    </div>
                    <div className="relative aspect-square bg-cream overflow-hidden">
                      <PreviewCell item={previews[1]} isLastWithOverlay={false} />
                    </div>
                    <div className="relative aspect-square bg-cream overflow-hidden">
                      <PreviewCell item={previews[2]} isLastWithOverlay={remaining > 0} remaining={remaining} />
                    </div>
                  </div>
                )}

                {/* Collection info */}
                <div className={`p-4 ${c.bg} border-t ${c.border}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shrink-0`}>
                      <Icon name={getNecessityIcon(necessity.id, necessity.icon)} size={20} className={c.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-bold ${c.text}`}>{necessity.name}</h3>
                      <p className="text-xs text-amber-800/50">{groupItems.length} inspirasi</p>
                    </div>
                    <Icon name="chevron_right" size={16} className="text-amber-800/30 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {showForm && (
        <GalleryFormModal item={editingItem} onSave={handleSave} onClose={() => { setShowForm(false); setEditingItem(undefined); }} />
      )}
    </div>
  );
}

function PreviewCell({ item, isLastWithOverlay, remaining }: { item: GalleryItem; isLastWithOverlay: boolean; remaining?: number }) {
  const thumb = item.type === "youtube" ? getYouTubeThumbnail(item.link) : null;

  return (
    <>
      {thumb ? (
        <img src={thumb} alt={item.description} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-amber-800/30">
          <Icon name={getTypeIcon(item.type)} size={28} />
        </div>
      )}

      {item.type === "youtube" && thumb && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <Icon name="play_arrow" size={24} className="text-white" />
          </div>
        </div>
      )}

      {isLastWithOverlay && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <p className="text-white font-bold text-lg">+{remaining}</p>
        </div>
      )}
    </>
  );
}
