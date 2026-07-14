"use client";

import { useState } from "react";
import { mockWeddingElements } from "@/data/mock";
import { WeddingElement, Todo, WeddingElementColor } from "@/types";
import Icon from "@/components/Icon";
import WeddingElementFormModal from "@/components/WeddingElementFormModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Tooltip from "@/components/Tooltip";
import WeddingElementCard from "@/components/WeddingElementCard";
import TodoListRow from "@/components/TodoListRow";
import { statusOrder } from "@/constants/todo";

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

  const allTodos = necessities.flatMap((n) =>
    n.todos.map((t) => ({ ...t, weddingElementId: n.id, weddingElementName: n.name }))
  );

  const sortedTodos = [...allTodos].sort(
    (a, b) => (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0)
  );

  function setTodoStatus(todoId: string, newStatus: Todo["status"]) {
    setNecessities((prev) =>
      prev.map((n) => ({
        ...n,
        todos: n.todos.map((t) =>
          t.id === todoId ? { ...t, status: newStatus } : t
        ),
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
            <div id="todos-list">
              {sortedTodos.map((todo) => (
                <TodoListRow key={todo.id} todo={todo} onStatusChange={setTodoStatus} />
              ))}
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
