"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mockGalleryItems, mockNecessities } from "@/data/mock";
import { GalleryItem } from "@/types";
import { getNecessityIcon, getNecessityColor } from "@/data/necessityIcons";
import Icon from "@/components/Icon";

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

export default function MoodBoardDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const necessity = mockNecessities.find((n) => n.id === id);
  const items = mockGalleryItems.filter((item) => item.necessityId === id);

  if (!necessity) {
    return (
      <div className="text-center py-20">
        <p className="text-amber-800/60">Kategori tidak ditemukan</p>
        <Link href="/mood-board" className="text-orange hover:underline text-sm">Kembali</Link>
      </div>
    );
  }

  const c = getNecessityColor(necessity.id, necessity.color);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/mood-board" className="text-amber-800/40 hover:text-orange transition-colors flex items-center gap-1">
            <Icon name="arrow_back" size={16} /> Kembali
          </Link>
          <h1 className="text-3xl font-bold text-amber-900">{necessity.name}</h1>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-amber-800/40">
          <Icon name="collections" size={40} className="mb-3 text-amber-800/30" />
          <p className="text-sm">Belum ada inspirasi untuk kategori ini</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => {
            const thumb = item.type === "youtube" ? getYouTubeThumbnail(item.link) : null;
            return (
              <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer"
                className="relative aspect-video rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all group ring-1 ring-black/5">
                {thumb ? (
                  <img src={thumb} alt={item.description} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-amber-800/40 bg-cream">
                    <Icon name={getTypeIcon(item.type)} size={24} />
                  </div>
                )}
                {item.type === "youtube" && thumb && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm group-hover:bg-black/70 transition-all">
                      <Icon name="play_arrow" size={20} className="text-white" />
                    </div>
                  </div>
                )}
                {item.description && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6">
                    <p className="text-sm text-white/90 font-semibold leading-tight line-clamp-2">{item.description}</p>
                  </div>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
