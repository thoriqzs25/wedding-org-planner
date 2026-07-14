"use client";

import { useState } from "react";
import { Vendor } from "@/types";
import { mockNecessities } from "@/data/mock";
import { getNecessityIcon, getNecessityColor } from "@/data/necessityIcons";
import Icon from "./Icon";

interface VendorFormModalProps {
  vendor?: Vendor;
  necessityId: string;
  onSave: (vendor: Omit<Vendor, "id"> & { id?: string }) => void;
  onClose: () => void;
}

export default function VendorFormModal({ vendor, necessityId: initialNecId, onSave, onClose }: VendorFormModalProps) {
  const [selectedNecId, setSelectedNecId] = useState(initialNecId);
  const [name, setName] = useState(vendor?.name ?? "");
  const [priority, setPriority] = useState(vendor?.priority ?? 1);
  const [budget, setBudget] = useState(vendor?.budget ?? 0);
  const [pros, setPros] = useState<string[]>(vendor?.pros ?? []);
  const [cons, setCons] = useState<string[]>(vendor?.cons ?? []);
  const [notes, setNotes] = useState(vendor?.notes ?? "");
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>(
    vendor?.socialLinks ?? [{ platform: "Instagram", url: "" }]
  );

  const nec = mockNecessities.find((n) => n.id === selectedNecId);
  const c = getNecessityColor(selectedNecId, nec?.color);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: vendor?.id,
      necessityId: selectedNecId,
      name,
      socialLinks: socialLinks.filter((s) => s.url),
      priority,
      budget,
      pros,
      cons,
      notes,
      isRecommended: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gold/30 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-amber-900">
            {vendor ? "Edit Vendor" : "Tambah Vendor"}
          </h2>
          <button onClick={onClose} className="cursor-pointer w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-amber-900/50 hover:text-amber-900">
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Kebutuhan dropdown */}
          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Kebutuhan</label>
            <div className="relative">
              <select value={selectedNecId} onChange={(e) => setSelectedNecId(e.target.value)} required
                className={`w-full px-4 py-3 rounded-xl border bg-cream/50 focus:outline-none focus:border-orange text-sm appearance-none ${c.text} ${c.bg}`}>
                {mockNecessities.map((n) => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
              <Icon name="expand_more" size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-800/40 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-900/70 mb-1">Prioritas</label>
              <input type="number" min={1} value={priority} onChange={(e) => setPriority(Number(e.target.value))} required
                className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-900/70 mb-1">Budget (Rp)</label>
              <input type="number" min={0} value={budget} onChange={(e) => setBudget(Number(e.target.value))} required
                className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-2">Social Media</label>
            {socialLinks.map((link, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <select value={link.platform} onChange={(e) => {
                  const next = [...socialLinks];
                  next[i].platform = e.target.value;
                  setSocialLinks(next);
                }}
                  className="px-3 py-2.5 rounded-xl border border-gold/40 bg-cream/50 text-sm focus:outline-none focus:border-orange text-amber-900">
                  <option>Instagram</option>
                  <option>TikTok</option>
                  <option>Website</option>
                  <option>WhatsApp</option>
                  <option>Facebook</option>
                </select>
                <input value={link.url} onChange={(e) => {
                  const next = [...socialLinks];
                  next[i].url = e.target.value;
                  setSocialLinks(next);
                }} placeholder="URL"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gold/40 bg-cream/50 text-sm focus:outline-none focus:border-orange text-amber-900" />
                <button type="button" onClick={() => setSocialLinks(socialLinks.filter((_, j) => j !== i))}
                  className="cursor-pointer text-pink hover:text-pink/70">
                  <Icon name="remove_circle" size={20} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setSocialLinks([...socialLinks, { platform: "Instagram", url: "" }])}
              className="cursor-pointer text-xs text-orange hover:underline flex items-center gap-1">
              <Icon name="add" size={14} /> Tambah social media
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-2">Pros</label>
            {pros.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={p} onChange={(e) => {
                  const next = [...pros];
                  next[i] = e.target.value;
                  setPros(next);
                }}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gold/40 bg-cream/50 text-sm focus:outline-none focus:border-orange text-amber-900" />
                <button type="button" onClick={() => setPros(pros.filter((_, j) => j !== i))}
                  className="cursor-pointer text-pink hover:text-pink/70">
                  <Icon name="remove_circle" size={20} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setPros([...pros, ""])}
              className="cursor-pointer text-xs text-green hover:underline flex items-center gap-1">
              <Icon name="add" size={14} /> Tambah pro
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-2">Cons</label>
            {cons.map((c, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={c} onChange={(e) => {
                  const next = [...cons];
                  next[i] = e.target.value;
                  setCons(next);
                }}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gold/40 bg-cream/50 text-sm focus:outline-none focus:border-orange text-amber-900" />
                <button type="button" onClick={() => setCons(cons.filter((_, j) => j !== i))}
                  className="cursor-pointer text-pink hover:text-pink/70">
                  <Icon name="remove_circle" size={20} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setCons([...cons, ""])}
              className="cursor-pointer text-xs text-pink hover:underline flex items-center gap-1">
              <Icon name="add" size={14} /> Tambah con
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900/70 mb-1">Catatan</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gold/40 bg-cream/50 focus:outline-none focus:border-orange text-amber-900" />
          </div>

          <button type="submit"
            className="w-full py-3 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm">
            {vendor ? "Simpan Perubahan" : "Tambah Vendor"}
          </button>
        </form>
      </div>
    </div>
  );
}
