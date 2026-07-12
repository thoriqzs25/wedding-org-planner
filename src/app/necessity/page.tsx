"use client";

import { useState } from "react";
import Link from "next/link";
import { mockNecessities } from "@/data/mock";
import { Necessity } from "@/types";
import Icon from "@/components/Icon";
import NecessityFormModal from "@/components/NecessityFormModal";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function NecessityListPage() {
  const [necessities, setNecessities] = useState(mockNecessities);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = (name: string) => {
    const newNec: Necessity = {
      id: `n${Date.now()}`,
      name,
      isDefault: false,
      todos: [],
      vendors: [],
    };
    setNecessities([...necessities, newNec]);
    setShowForm(false);
  };

  const today = new Date();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-amber-900">Kebutuhan</h1>
          <p className="text-amber-800/60">Kelola setiap kebutuhan pernikahanmu</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm">
          <Icon name="add" size={18} /> Tambah Kebutuhan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {necessities.map((nec) => {
          const todoDone = nec.todos.filter((t) => t.status === "done").length;
          const todoTotal = nec.todos.length;
          const hasOverdue = nec.todos.some(
            (t) => t.status !== "done" && new Date(t.dueDate) < today
          );

          return (
            <div key={nec.id} className="relative group">
              <Link href={`/necessity/${nec.id}`}
                className={`block bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all ${
                  hasOverdue ? "border-pink/40" : "border-gold/30"
                }`}>
                {/* Overdue indicator */}
                {hasOverdue && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-pink shadow-sm flex items-center justify-center">
                    <Icon name="warning" size={14} className="text-white" filled />
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-semibold transition-colors ${
                    hasOverdue ? "text-pink" : "text-amber-900 group-hover:text-orange"
                  }`}>
                    {nec.name}
                  </h3>
                  <span className="text-xs text-amber-800/40">{nec.vendors.length} vendor</span>
                </div>

                {todoTotal > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-cream rounded-full overflow-hidden">
                      <div className="h-full bg-green rounded-full" style={{ width: `${Math.round((todoDone / todoTotal) * 100)}%` }} />
                    </div>
                    <span className="text-xs text-amber-800/50">{todoDone}/{todoTotal}</span>
                  </div>
                ) : (
                  <p className="text-xs text-amber-800/40">Belum ada to-do list</p>
                )}
              </Link>

              <button onClick={() => setDeleteId(nec.id)}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber-800/30 hover:text-pink hover:bg-pink/10">
                <Icon name="close" size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {showForm && <NecessityFormModal onSave={handleAdd} onClose={() => setShowForm(false)} />}
      {deleteId && (
        <ConfirmDialog
          title="Hapus Kebutuhan"
          message="Yakin ingin menghapus kebutuhan ini? Semua data terkait akan ikut terhapus."
          onConfirm={() => { setNecessities(necessities.filter((n) => n.id !== deleteId)); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
