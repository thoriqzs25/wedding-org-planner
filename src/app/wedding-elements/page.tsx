"use client";

import { useState } from "react";
import Link from "next/link";
import { mockWeddingElements } from "@/data/mock";
import { WeddingElement, Todo, WeddingElementColor } from "@/types";
import Icon from "@/components/Icon";
import WeddingElementFormModal from "@/components/WeddingElementFormModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Tooltip from "@/components/Tooltip";
import WeddingElementCard from "@/components/WeddingElementCard";

type Tab = "wedding-elements" | "todos";

export default function WeddingElementListPage() {
  const [necessities, setNecessities] = useState(mockWeddingElements);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("wedding-elements");

  const handleAdd = (name: string, icon: string, color: WeddingElementColor) => {
    const newNec: WeddingElement = {
      id: `n${Date.now()}`,
      name,
      icon,
      color,
      isDefault: false,
      todos: [],
      vendors: [],
    };
    setNecessities([...necessities, newNec]);
    setShowForm(false);
  };

  const today = new Date();

  const allTodos = necessities.flatMap((n) =>
    n.todos.map((t) => ({ ...t, weddingElementId: n.id, weddingElementName: n.name }))
  );

  const statusOrder: Record<string, number> = { pending: 0, in_progress: 1, done: 2 };
  const sortedTodos = [...allTodos].sort(
    (a, b) => (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0)
  );

  function cycleStatus(todoId: string) {
    setNecessities((prev) =>
      prev.map((n) => ({
        ...n,
        todos: n.todos.map((t) => {
          if (t.id !== todoId) return t;
          const next: Record<string, Todo["status"]> = {
            pending: "in_progress",
            in_progress: "done",
            done: "pending",
          };
          return { ...t, status: next[t.status] };
        }),
      }))
    );
  }

  const tabs: { key: Tab; label: string; mobile: string; icon: string }[] = [
    { key: "wedding-elements", label: "Elemen Pernikahan", mobile: "Elemen", icon: "checklist" },
    { key: "todos", label: `Semua To-Do (${allTodos.length})`, mobile: `To-Do (${allTodos.length})`, icon: "format_list_bulleted" },
  ];

  return (
    <div id="necessity-page" className="max-w-5xl space-y-6">
      <div id="necessity-header" className="flex items-center justify-between">
        <div id="necessity-header-text">
          <Tooltip content="Daftar semua elemen pernikahan" position="bottom"><h1 id="necessity-page-title" className="text-2xl font-bold text-amber-900">Elemen Pernikahan</h1></Tooltip>
          <p id="necessity-page-subtitle" className="text-amber-800/60">Kelola setiap elemen pernikahanmu</p>
        </div>
        {tab === "wedding-elements" && (
        <button id="necessity-add-button" onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 min-h-[44px] bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm active:scale-90 cursor-pointer">
          <Icon name="add" size={18} /> Tambah Elemen Pernikahan
        </button>
        )}
      </div>

      {/* Tabs */}
      <div id="necessity-tabs" className="flex gap-1 bg-white rounded-xl border border-gold/30 p-1 shadow-sm">
        {tabs.map((t) => (
          <button key={t.key} id={`tab-${t.key}`} onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              tab === t.key
                ? "bg-orange text-white shadow-sm"
                : "text-amber-800/60 hover:text-orange hover:bg-orange/5"
            }`}>
            <Icon name={t.icon} size={18} />
            <span id={`tab-${t.key}-mobile-label`} className="sm:hidden">{t.mobile}</span>
            <span id={`tab-${t.key}-label`} className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === "wedding-elements" ? (
        <div id="necessity-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {necessities.map((nec) => (
            <WeddingElementCard key={nec.id} nec={nec} onDelete={setDeleteId} />
          ))}
        </div>
      ) : (
        /* All Todos tab */
        <div id="todos-container" className="bg-white rounded-2xl border border-gold/30 shadow-sm overflow-hidden">
          {sortedTodos.length === 0 ? (
            <div id="todos-empty" className="text-center py-12 text-amber-800/40">
              <Icon name="format_list_bulleted" size={40} className="mb-3 text-amber-800/20" />
              <p id="todos-empty-title" className="text-sm">Belum ada to-do list</p>
              <p id="todos-empty-subtitle" className="text-xs mt-1">Tambahkan to-do dari halaman elemen pernikahan</p>
            </div>
          ) : (
            <div id="todos-list" className="divide-y divide-gold/10">
              {sortedTodos.map((todo) => {
                const isOverdue = todo.status !== "done" && new Date(todo.dueDate) < today;
                const isDone = todo.status === "done";
                const daysLeft = Math.ceil(
                  (new Date(todo.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <Link key={todo.id} id={`todo-${todo.id}`} href={`/wedding-elements/${todo.weddingElementId}`}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-cream/50 transition-colors group ${
                      isOverdue ? "bg-red/[0.02]" : ""
                    }`}>
                    <button id={`todo-${todo.id}-status-button`} onClick={(e) => { e.preventDefault(); cycleStatus(todo.id); }}
                      className={`flex items-center justify-center w-11 h-11 shrink-0 rounded-full border-2 transition-all active:scale-90 cursor-pointer ${
                        isDone
                          ? "bg-green border-green"
                          : isOverdue
                          ? "border-red/50 hover:bg-red/10"
                          : "border-gold/50 hover:bg-gold/10"
                      }`}>
                      {isDone ? <Icon name="check" size={14} className="text-white" /> : <span id={`todo-${todo.id}-status-placeholder`} className="w-0" />}
                    </button>

                    <div id={`todo-${todo.id}-content`} className="flex-1 min-w-0">
                      <p id={`todo-${todo.id}-title`} className={`text-sm font-medium ${isDone ? "text-amber-800/40 line-through" : "text-amber-900"}`}>
                        {todo.title}
                      </p>
                      <div id={`todo-${todo.id}-meta`} className="flex items-center gap-2 mt-0.5">
                        <span id={`todo-${todo.id}-status-badge`} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          isDone ? "bg-green/10 text-green" : todo.status === "in_progress" ? "bg-gold/20 text-amber-800" : "bg-cream text-amber-800/50"
                        }`}>
                          {isDone ? "Selesai" : todo.status === "in_progress" ? "Diproses" : "Pending"}
                        </span>
                        <span id={`todo-${todo.id}-necessity`} className="text-[11px] text-amber-800/50">{todo.weddingElementName}</span>
                        {todo.pic && (
                          <span id={`todo-${todo.id}-pic`} className="text-[11px] text-amber-800/40">• PIC: {todo.pic}</span>
                        )}
                      </div>
                    </div>

                    <div id={`todo-${todo.id}-date-section`} className="text-right shrink-0">
                      <div id={`todo-${todo.id}-days`} className={`flex items-center gap-1 text-xs font-medium ${
                        isOverdue ? "text-red" : isDone ? "text-green" : "text-amber-800/50"
                      }`}>
                        <Icon name="schedule" size={12} />
                        {isDone ? "Selesai" : isOverdue ? `${Math.abs(daysLeft)} hari terlewat` : daysLeft === 0 ? "Hari ini" : `${daysLeft} hari lagi`}
                      </div>
                      <p id={`todo-${todo.id}-date`} className="text-[10px] text-amber-800/30 mt-0.5">
                        {new Date(todo.dueDate).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showForm && <WeddingElementFormModal existingNames={necessities.map((n) => n.name)} onSave={handleAdd} onClose={() => setShowForm(false)} />}
      {deleteId && (
        <ConfirmDialog
          title="Hapus Elemen Pernikahan"
          message="Yakin ingin menghapus elemen pernikahan ini? Semua data terkait akan ikut terhapus."
          onConfirm={() => { setNecessities(necessities.filter((n) => n.id !== deleteId)); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
