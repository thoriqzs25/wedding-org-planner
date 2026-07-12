"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mockNecessities, mockInvoices } from "@/data/mock";
import { Todo, Vendor } from "@/types";
import VendorModal from "@/components/VendorModal";
import VendorFormModal from "@/components/VendorFormModal";
import TodoFormModal from "@/components/TodoFormModal";
import Icon from "@/components/Icon";

const statusConfig: Record<Todo["status"], { label: string; icon: string; color: string; bg: string }> = {
  pending: { label: "Pending", icon: "radio_button_unchecked", color: "text-amber-800/30", bg: "bg-cream text-amber-800/50" },
  in_progress: { label: "Diproses", icon: "progress_activity", color: "text-gold", bg: "bg-gold/20 text-amber-800" },
  done: { label: "Selesai", icon: "check_circle", color: "text-green", bg: "bg-green/10 text-green" },
};

const nextStatus: Record<Todo["status"], Todo["status"]> = {
  pending: "in_progress",
  in_progress: "done",
  done: "pending",
};

export default function NecessityDetailPage() {
  const params = useParams();
  const [necessities, setNecessities] = useState(mockNecessities);
  const id = params.id as string;
  const necessity = necessities.find((n) => n.id === id);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [editingVendor, setEditingVendor] = useState<Vendor | undefined>(undefined);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);
  const [showTodoForm, setShowTodoForm] = useState(false);

  if (!necessity) {
    return (
      <div className="text-center py-20">
        <p className="text-amber-800/60">Kebutuhan tidak ditemukan</p>
        <Link href="/necessity" className="text-orange hover:underline text-sm">Kembali</Link>
      </div>
    );
  }

  // Budget per necessity
  const necessityInvoices = mockInvoices.filter(
    (inv) => necessity.vendors.some((v) => v.id === inv.vendorId)
  );
  const necessityBudget = necessity.vendors.reduce((s, v) => s + v.budget, 0);
  const necessitySpent = necessityInvoices.reduce((s, inv) => s + inv.amount, 0);

  const handleSaveVendor = (data: Omit<Vendor, "id"> & { id?: string }) => {
    setNecessities((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        if (data.id) {
          return { ...n, vendors: n.vendors.map((v) => v.id === data.id ? { ...v, ...data } : v) };
        }
        return { ...n, vendors: [...n.vendors, { ...data, id: `v${Date.now()}` } as Vendor] };
      })
    );
    setShowVendorForm(false);
    setEditingVendor(undefined);
    setSelectedVendor(null);
  };

  const handleDeleteVendor = (vendorId: string) => {
    setNecessities((prev) =>
      prev.map((n) => n.id !== id ? n : { ...n, vendors: n.vendors.filter((v) => v.id !== vendorId) })
    );
    setSelectedVendor(null);
  };

  const handleSaveTodo = (data: Omit<Todo, "id"> & { id?: string }) => {
    setNecessities((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        if (data.id) {
          return { ...n, todos: n.todos.map((t) => t.id === data.id ? { ...t, ...data } : t) };
        }
        return { ...n, todos: [...n.todos, { ...data, id: `t${Date.now()}` } as Todo] };
      })
    );
    setShowTodoForm(false);
    setEditingTodo(undefined);
  };

  const handleDeleteTodo = (todoId: string) => {
    setNecessities((prev) =>
      prev.map((n) => n.id !== id ? n : { ...n, todos: n.todos.filter((t) => t.id !== todoId) })
    );
    setShowTodoForm(false);
    setEditingTodo(undefined);
  };

  const cycleTodoStatus = (todoId: string) => {
    setNecessities((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        return { ...n, todos: n.todos.map((t) => t.id !== todoId ? t : { ...t, status: nextStatus[t.status] }) };
      })
    );
  };

  const handleEdit = (v: Vendor) => {
    setSelectedVendor(null);
    setEditingVendor(v);
    setShowVendorForm(true);
  };

  const userVendors = necessity.vendors.filter((v) => !v.isRecommended).sort((a, b) => a.priority - b.priority);
  const recommendedVendors = necessity.vendors.filter((v) => v.isRecommended);

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/necessity" className="text-amber-800/40 hover:text-orange transition-colors flex items-center gap-1">
            <Icon name="arrow_back" size={16} /> Kembali
          </Link>
          <h1 className="text-2xl font-bold text-amber-900">{necessity.name}</h1>
        </div>
        <button onClick={() => { setEditingVendor(undefined); setShowVendorForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm">
          <Icon name="add" size={18} /> Tambah Vendor
        </button>
      </div>

      {/* Budget per necessity */}
      {necessityBudget > 0 && (
        <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <p className="text-xs text-amber-800/60 mb-2">Budget {necessity.name}</p>
          <div className="h-2.5 bg-cream rounded-full overflow-hidden border border-gold/30">
            <div className="h-full bg-orange rounded-full transition-all" style={{
              width: `${Math.min((necessitySpent / necessityBudget) * 100, 100)}%`
            }} />
          </div>
          <div className="flex justify-between text-xs mt-1.5 text-amber-800/50">
            <span>Terpakai: Rp {necessitySpent.toLocaleString()}</span>
            <span>Total: Rp {necessityBudget.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* To-do list */}
      <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-amber-900">To-Do List</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-amber-800/50">
              {necessity.todos.filter((t) => t.status === "done").length}/{necessity.todos.length} selesai
            </span>
            <button onClick={() => { setEditingTodo(undefined); setShowTodoForm(true); }}
              className="flex items-center gap-1 text-xs text-orange hover:underline">
              <Icon name="add" size={14} /> Tambah
            </button>
          </div>
        </div>

        {necessity.todos.length === 0 ? (
          <div className="text-center py-8 text-amber-800/40">
            <Icon name="checklist" size={36} className="mb-2 text-amber-800/30" />
            <p className="text-sm mb-3">Belum ada to-do list</p>
            <button onClick={() => { setEditingTodo(undefined); setShowTodoForm(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm text-xs">
              <Icon name="add" size={14} /> Tambah To-Do
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {necessity.todos.map((todo) => {
              const config = statusConfig[todo.status];
              return (
                <div key={todo.id}
                  className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    todo.status === "done" ? "border-green/20 bg-green/[0.02]"
                    : todo.status === "in_progress" ? "border-gold/30 bg-gold/[0.02]"
                    : "border-gold/20 hover:bg-cream/50"
                  }`}>
                  <button onClick={() => cycleTodoStatus(todo.id)}
                    className="mt-0.5 shrink-0 transition-all active:scale-90">
                    <Icon name={config.icon} size={24} className={`${config.color} transition-colors duration-300`} filled={todo.status === "done"} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium transition-all duration-300 ${todo.status === "done" ? "text-amber-800/50 line-through" : "text-amber-900"}`}>
                        {todo.title}
                      </p>
                      {todo.status === "in_progress" && <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-gold shrink-0" />}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-amber-800/50">
                      <span className="flex items-center gap-1"><Icon name="person" size={12} />{todo.pic}</span>
                      <span className="flex items-center gap-1"><Icon name="calendar_today" size={12} />{new Date(todo.dueDate).toLocaleDateString("id-ID")}</span>
                      {todo.description && (
                        <span className="flex items-center gap-1 text-amber-800/40"><Icon name="description" size={12} />{todo.description.length > 30 ? todo.description.slice(0, 30) + "..." : todo.description}</span>
                      )}
                    </div>
                    {todo.link && (
                      <a href={todo.link} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-orange hover:underline mt-1 inline-flex items-center gap-1">
                        <Icon name="link" size={14} /> Link referensi
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${config.bg}`}>{config.label}</span>
                    <button onClick={() => { setEditingTodo(todo); setShowTodoForm(true); }}
                      className="text-[10px] text-amber-800/30 hover:text-orange transition-colors">
                      <Icon name="edit" size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-amber-900 mb-4">Vendor Saya</h2>
          {userVendors.length === 0 ? (
            <div className="text-center py-8 text-amber-800/40">
              <Icon name="storefront" size={36} className="mb-2 text-amber-800/30" />
              <p className="text-sm">Belum ada vendor</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userVendors.map((vendor) => (
                <button key={vendor.id} onClick={() => setSelectedVendor(vendor)}
                  className="w-full text-left p-4 rounded-xl border border-gold/20 hover:bg-cream/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-900">{vendor.name}</p>
                      <p className="text-xs text-amber-800/50">Prioritas #{vendor.priority} • Rp{vendor.budget.toLocaleString()}</p>
                    </div>
                    <span className="text-xs text-amber-800/40 flex items-center gap-1">Detail <Icon name="chevron_right" size={14} /></span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
            <Icon name="auto_awesome" size={20} /> Rekomendasi Vendor
          </h2>
          {recommendedVendors.length === 0 ? (
            <div className="text-center py-8 text-amber-800/40">
              <Icon name="auto_awesome" size={36} className="mb-2 text-amber-800/30" />
              <p className="text-sm">Belum ada rekomendasi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendedVendors.map((vendor) => (
                <button key={vendor.id} onClick={() => setSelectedVendor(vendor)}
                  className="w-full text-left p-4 rounded-xl border border-orange/20 bg-orange/[0.02] hover:bg-orange/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-amber-900">{vendor.name}</p>
                        <span className="text-[10px] bg-orange/10 text-orange px-1.5 py-0.5 rounded-full">Rek.</span>
                      </div>
                      <p className="text-xs text-amber-800/50">Prioritas #{vendor.priority} • Rp{vendor.budget.toLocaleString()}</p>
                    </div>
                    <span className="text-xs text-amber-800/40 flex items-center gap-1">Detail <Icon name="chevron_right" size={14} /></span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedVendor && (
        <VendorModal vendor={selectedVendor} onClose={() => setSelectedVendor(null)}
          onEdit={selectedVendor.isRecommended ? undefined : handleEdit}
          onDelete={selectedVendor.isRecommended ? undefined : handleDeleteVendor} />
      )}
      {showVendorForm && (
        <VendorFormModal vendor={editingVendor} necessityId={id}
          onSave={handleSaveVendor} onClose={() => { setShowVendorForm(false); setEditingVendor(undefined); }} />
      )}
      {showTodoForm && (
        <TodoFormModal todo={editingTodo} necessityId={id}
          onSave={handleSaveTodo} onDelete={editingTodo ? handleDeleteTodo : undefined}
          onClose={() => { setShowTodoForm(false); setEditingTodo(undefined); }} />
      )}
    </div>
  );
}
