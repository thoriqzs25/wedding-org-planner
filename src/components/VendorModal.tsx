"use client";

import { useState } from "react";
import { Vendor } from "@/types";
import Icon from "./Icon";
import ConfirmDialog from "./ConfirmDialog";

interface VendorModalProps {
  vendor: Vendor;
  onClose: () => void;
  onEdit?: (vendor: Vendor) => void;
  onDelete?: (id: string) => void;
}

export default function VendorModal({ vendor, onClose, onEdit, onDelete }: VendorModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gold/30 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-amber-900">{vendor.name}</h2>
            {vendor.isRecommended && (
              <span className="text-xs bg-orange/10 text-orange px-2 py-0.5 rounded-full font-medium">
                Rekomendasi Developer
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!vendor.isRecommended && onEdit && (
              <button onClick={() => onEdit(vendor)}
                className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-amber-900/50 hover:text-orange">
                <Icon name="edit" size={18} />
              </button>
            )}
            {!vendor.isRecommended && onDelete && (
              <button onClick={() => setConfirmDelete(true)}
                className="w-8 h-8 rounded-full hover:bg-pink/10 flex items-center justify-center text-amber-900/50 hover:text-pink">
                <Icon name="delete" size={18} />
              </button>
            )}
            <button onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-amber-900/50 hover:text-amber-900">
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cream rounded-xl p-4">
              <p className="text-xs text-amber-800/60">Prioritas</p>
              <p className="text-lg font-bold text-orange">#{vendor.priority}</p>
            </div>
            <div className="bg-cream rounded-xl p-4">
              <p className="text-xs text-amber-800/60">Budget</p>
              <p className="text-lg font-bold text-amber-900">
                Rp {vendor.budget.toLocaleString()}
              </p>
            </div>
          </div>

          {vendor.socialLinks.length > 0 && (
            <div>
              <p className="text-sm font-medium text-amber-900 mb-2">Social Media</p>
              <div className="flex flex-wrap gap-2">
                {vendor.socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-orange/10 text-orange px-3 py-1.5 rounded-full hover:bg-orange/20 transition-colors"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-1.5">
                <Icon name="task_alt" size={16} className="text-green" filled />
                Pros
              </p>
              <ul className="space-y-1">
                {vendor.pros.map((p, i) => (
                  <li
                    key={i}
                    className="text-sm text-amber-800/70 flex items-start gap-2"
                  >
                    <span className="text-green mt-0.5">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-1.5">
                <Icon name="disabled_by_default" size={16} className="text-pink" filled />
                Cons
              </p>
              <ul className="space-y-1">
                {vendor.cons.map((c, i) => (
                  <li
                    key={i}
                    className="text-sm text-amber-800/70 flex items-start gap-2"
                  >
                    <span className="text-pink mt-0.5">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {vendor.notes && (
            <div>
              <p className="text-sm font-medium text-amber-900 mb-1">Catatan</p>
              <p className="text-sm text-amber-800/70 bg-cream rounded-xl p-3">
                {vendor.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Hapus Vendor"
          message={`Yakin ingin menghapus ${vendor.name}?`}
          onConfirm={() => { onDelete?.(vendor.id); setConfirmDelete(false); }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
