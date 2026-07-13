"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mockNecessities, mockInvoices } from "@/data/mock";
import { Todo, Vendor, Necessity } from "@/types";
import { getNecessityIcon, getNecessityColor } from "@/data/necessityIcons";
import VendorModal from "@/components/VendorModal";
import VendorFormModal from "@/components/VendorFormModal";
import TodoFormModal from "@/components/TodoFormModal";
import CascadeWarning from "@/components/CascadeWarning";
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
  const [cascadeVendor, setCascadeVendor] = useState<Vendor | null>(null);
  const [cascadeMode, setCascadeMode] = useState<"select" | "deselect">("select");
  const maxFinalizes = 3;
  const [finalizesUsed, setFinalizesUsed] = useState(
    necessities.filter((n) => n.selectedVendorId).length
  );
  const remainingFinalizes = maxFinalizes - finalizesUsed;

  if (!necessity) {
    return (
      <div id="not-found-container" className="text-center py-20">
        <p id="not-found-text" className="text-amber-800/60">Kebutuhan tidak ditemukan</p>
        <Link id="not-found-back-link" href="/necessity" className="text-orange hover:underline text-sm">Kembali</Link>
      </div>
    );
  }

  const selected = necessity.selectedVendorId
    ? necessity.vendors.find((v) => v.id === necessity.selectedVendorId)
    : null;

  const necessityInvoices = mockInvoices.filter((inv) => inv.necessityId === id);
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

  const handleSelectVendor = (vendor: Vendor) => {
    setCascadeVendor(vendor);
    setCascadeMode("select");
  };

  const confirmSelectVendor = () => {
    if (!cascadeVendor) return;
    if (finalizesUsed >= maxFinalizes) return;
    setFinalizesUsed((p) => p + 1);
    setNecessities((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const activity = n.vendorActivity ?? [];
        return {
          ...n,
          selectedVendorId: cascadeVendor.id,
          vendorActivity: [
            { id: `va${Date.now()}`, action: `Dipilih sebagai vendor final: ${cascadeVendor.name}`, date: new Date().toISOString() },
            ...activity,
          ],
        };
      })
    );
    setCascadeVendor(null);
  };

  const handleDeselectVendor = () => {
    setCascadeVendor(selected!);
    setCascadeMode("deselect");
  };

  const confirmDeselectVendor = () => {
    setFinalizesUsed((p) => p - 1);
    setNecessities((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        return { ...n, selectedVendorId: undefined };
      })
    );
    setCascadeVendor(null);
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

  const toggleVendorTask = (taskId: string) => {
    setNecessities((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const tasks = (n.vendorTasks ?? []).map((t) =>
          t.id === taskId ? { ...t, done: !t.done } : t
        );
        const doneTask = (n.vendorTasks ?? []).find((t) => t.id === taskId);
        const activity = n.vendorActivity ?? [];
        const newActivity = doneTask
          ? { id: `va${Date.now()}`, action: `Task '${doneTask.title}' ${doneTask.done ? "dibatalkan" : "selesai"}`, date: new Date().toISOString() }
          : null;
        return {
          ...n,
          vendorTasks: tasks,
          vendorActivity: newActivity ? [newActivity, ...activity] : activity,
        };
      })
    );
  };

  const [newTask, setNewTask] = useState("");

  const addVendorTask = () => {
    if (!newTask.trim()) return;
    setNecessities((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        return {
          ...n,
          vendorTasks: [...(n.vendorTasks ?? []), { id: `vt${Date.now()}`, title: newTask.trim(), done: false }],
          vendorActivity: [
            { id: `va${Date.now()}`, action: `Task ditambahkan: '${newTask.trim()}'`, date: new Date().toISOString() },
            ...(n.vendorActivity ?? []),
          ],
        };
      })
    );
    setNewTask("");
  };

  const deleteVendorTask = (taskId: string) => {
    setNecessities((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const task = (n.vendorTasks ?? []).find((t) => t.id === taskId);
        const activity = n.vendorActivity ?? [];
        const newActivity = task
          ? { id: `va${Date.now()}`, action: `Task dihapus: '${task.title}'`, date: new Date().toISOString() }
          : null;
        return {
          ...n,
          vendorTasks: (n.vendorTasks ?? []).filter((t) => t.id !== taskId),
          vendorActivity: newActivity ? [newActivity, ...activity] : activity,
        };
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
    <div id="necessity-detail-page" className="max-w-5xl space-y-6">
      {/* Header */}
      <div id="detail-header" className="flex items-center justify-between">
        <div id="detail-header-left" className="flex items-center gap-3">
          <Link id="detail-back-link" href="/necessity" className="text-amber-800/40 hover:text-orange transition-colors flex items-center gap-1">
            <Icon name="arrow_back" size={16} /> Kembali
          </Link>
          <h1 id="detail-title" className="text-2xl font-bold text-amber-900">{necessity.name}</h1>
        </div>
        <button id="detail-add-vendor-button" onClick={() => { setEditingVendor(undefined); setShowVendorForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm">
          <Icon name="add" size={18} /> Tambah Vendor
        </button>
      </div>

      {/* Selected Vendor — prominent card */}
      {selected && (
        <div id="selected-vendor-card" className="bg-gradient-to-r from-green/5 to-green/[0.02] border-2 border-green/30 rounded-2xl p-5 shadow-sm">
          <div id="selected-vendor-header" className="flex items-center justify-between mb-4">
            <div id="selected-vendor-badge-row" className="flex items-center gap-2">
              <div id="selected-vendor-badge-icon" className="w-7 h-7 rounded-full bg-green/20 flex items-center justify-center">
                <Icon name="check_circle" size={16} className="text-green" filled />
              </div>
              <span id="selected-vendor-badge-label" className="text-xs font-semibold text-green uppercase tracking-wider">Vendor Final</span>
            </div>
            <button id="selected-vendor-deselect-button" onClick={handleDeselectVendor}
              className="text-[11px] text-amber-800/40 hover:text-pink transition-colors flex items-center gap-1">
              <Icon name="close" size={12} /> Hapus
            </button>
          </div>

          <div id="selected-vendor-info" className="flex items-start gap-4">
            <div id="selected-vendor-icon" className="w-14 h-14 rounded-2xl bg-green/10 flex items-center justify-center shrink-0">
              <Icon name={getNecessityIcon(id, necessity.icon)} size={28} className="text-green" />
            </div>
            <div id="selected-vendor-text" className="flex-1 min-w-0">
              <h3 id="selected-vendor-name" className="text-lg font-bold text-amber-900">{selected.name}</h3>
              <div id="selected-vendor-meta" className="flex flex-wrap gap-3 mt-1 text-sm text-amber-800/60">
                <span id="selected-vendor-priority">Prioritas #{selected.priority}</span>
                <span id="selected-vendor-budget">Rp {selected.budget.toLocaleString()}</span>
                {selected.pros.length > 0 && <span id="selected-vendor-pros" className="text-green">✓ {selected.pros[0]}</span>}
              </div>
              {selected.notes && (
                <p id="selected-vendor-notes" className="text-xs text-amber-800/50 mt-2 italic">"{selected.notes}"</p>
              )}
            </div>
            <button id="selected-vendor-detail-button" onClick={() => setSelectedVendor(selected)}
              className="text-xs text-orange hover:underline flex items-center gap-1 shrink-0">
              Detail <Icon name="open_in_new" size={12} />
            </button>
          </div>

          {/* Vendor Tasks */}
          <div id="vendor-tasks-section" className="mt-4 pt-4 border-t border-green/20">
            <div id="vendor-tasks-header" className="flex items-center justify-between mb-2">
              <p id="vendor-tasks-title" className="text-xs font-medium text-amber-900/70">Task Vendor</p>
              <span id="vendor-tasks-count" className="text-[10px] text-amber-800/40">
                {(necessity.vendorTasks ?? []).filter((t) => t.done).length}/{(necessity.vendorTasks ?? []).length}
              </span>
            </div>

            {/* Add task input */}
            <form id="vendor-tasks-form" onSubmit={(e) => { e.preventDefault(); addVendorTask(); }}
              className="flex items-center gap-2 mb-2">
              <input id="vendor-tasks-input" value={newTask} onChange={(e) => setNewTask(e.target.value)}
                placeholder="Tambah task…"
                className="flex-1 px-3 py-2 rounded-lg border border-green/30 bg-green/[0.02] text-xs text-amber-900 focus:outline-none focus:border-green placeholder-amber-800/30" />
              <button id="vendor-tasks-add-button" type="submit" disabled={!newTask.trim()}
                className="px-3 py-2 rounded-lg bg-green text-white text-xs font-medium hover:bg-green/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                + Add
              </button>
            </form>

            {(necessity.vendorTasks ?? []).length > 0 && (
              <div id="vendor-tasks-list" className="space-y-1">
                {(necessity.vendorTasks ?? []).map((task) => (
                  <div key={task.id} id={`task-${task.id}`}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-green/5 transition-colors group">
                    <button id={`task-${task.id}-toggle`} onClick={() => toggleVendorTask(task.id)}
                      className="flex items-center gap-2.5 flex-1 text-left">
                      <div id={`task-${task.id}-checkbox`} className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                        task.done ? "bg-green border-green" : "border-amber-800/20 group-hover:border-green/50"
                      }`}>
                        {task.done && <Icon name="check" size={10} className="text-white" />}
                      </div>
                      <span id={`task-${task.id}-title`} className={`text-sm ${task.done ? "text-amber-800/50 line-through" : "text-amber-900"}`}>
                        {task.title}
                      </span>
                    </button>
                    <button id={`task-${task.id}-delete`} onClick={() => deleteVendorTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-amber-800/30 hover:text-pink transition-all shrink-0">
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {(necessity.vendorTasks ?? []).length === 0 && (
              <p id="vendor-tasks-empty" className="text-[11px] text-amber-800/30 italic text-center py-2">Belum ada task. Tambah di atas.</p>
            )}
          </div>
        </div>
      )}

      {/* To-do list */}
      <div id="todo-section" className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
        <div id="todo-header" className="flex items-center justify-between mb-4">
          <h2 id="todo-title" className="text-lg font-semibold text-amber-900">To-Do List</h2>
          <div id="todo-header-right" className="flex items-center gap-3">
            <span id="todo-count" className="text-xs text-amber-800/50">{necessity.todos.filter((t) => t.status === "done").length}/{necessity.todos.length} selesai</span>
            <button id="todo-add-button" onClick={() => { setEditingTodo(undefined); setShowTodoForm(true); }}
              className="flex items-center gap-1 text-xs text-orange hover:underline"><Icon name="add" size={14} /> Tambah</button>
          </div>
        </div>

        {necessity.todos.length === 0 ? (
          <div id="todo-empty" className="text-center py-8 text-amber-800/40">
            <Icon name="checklist" size={36} className="mb-2 text-amber-800/30" />
            <p id="todo-empty-text" className="text-sm mb-3">Belum ada to-do list</p>
            <button id="todo-empty-add-button" onClick={() => { setEditingTodo(undefined); setShowTodoForm(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm text-xs">
              <Icon name="add" size={14} /> Tambah To-Do
            </button>
          </div>
        ) : (
          <div id="todo-list" className="space-y-2">
            {necessity.todos.map((todo) => {
              const config = statusConfig[todo.status];
              return (
                <div key={todo.id} id={`todo-item-${todo.id}`}
                  className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    todo.status === "done" ? "border-green/20 bg-green/[0.02]"
                    : todo.status === "in_progress" ? "border-gold/30 bg-gold/[0.02]"
                    : "border-gold/20 hover:bg-cream/50"
                  }`}>
                  <button id={`todo-item-${todo.id}-status-button`} onClick={() => cycleTodoStatus(todo.id)} className="mt-0.5 shrink-0 transition-all active:scale-90">
                    <Icon name={config.icon} size={24} className={`${config.color} transition-colors duration-300`} filled={todo.status === "done"} />
                  </button>
                  <div id={`todo-item-${todo.id}-content`} className="flex-1 min-w-0">
                    <div id={`todo-item-${todo.id}-title-row`} className="flex items-center gap-2">
                      <p id={`todo-item-${todo.id}-title`} className={`text-sm font-medium transition-all duration-300 ${todo.status === "done" ? "text-amber-800/50 line-through" : "text-amber-900"}`}>{todo.title}</p>
                      {todo.status === "in_progress" && <span id={`todo-item-${todo.id}-pulse`} className="animate-pulse w-1.5 h-1.5 rounded-full bg-gold shrink-0" />}
                    </div>
                    <div id={`todo-item-${todo.id}-meta`} className="flex flex-wrap gap-3 mt-1 text-xs text-amber-800/50">
                      <span id={`todo-item-${todo.id}-pic`} className="flex items-center gap-1"><Icon name="person" size={12} />{todo.pic}</span>
                      <span id={`todo-item-${todo.id}-date`} className="flex items-center gap-1"><Icon name="calendar_today" size={12} />{new Date(todo.dueDate).toLocaleDateString("id-ID")}</span>
                      {todo.description && <span id={`todo-item-${todo.id}-description`} className="text-amber-800/40"><Icon name="description" size={12} />{todo.description.length > 30 ? todo.description.slice(0, 30) + "…" : todo.description}</span>}
                    </div>
                    {todo.link && (
                      <a id={`todo-item-${todo.id}-link`} href={todo.link} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-orange hover:underline mt-1 inline-flex items-center gap-1"><Icon name="link" size={14} /> Link referensi</a>
                    )}
                  </div>
                  <div id={`todo-item-${todo.id}-actions`} className="flex flex-col items-end gap-2 shrink-0">
                    <span id={`todo-item-${todo.id}-status-badge`} className={`text-[11px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${config.bg}`}>{config.label}</span>
                    <button id={`todo-item-${todo.id}-edit-button`} onClick={() => { setEditingTodo(todo); setShowTodoForm(true); }}
                      className="text-[10px] text-amber-800/30 hover:text-orange transition-colors"><Icon name="edit" size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div id="vendors-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Draft */}
        <div id="vendor-draft-section" className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <div id="vendor-draft-header" className="flex items-center justify-between mb-4">
            <h2 id="vendor-draft-title" className="text-lg font-semibold text-amber-900">Vendor Draft</h2>
            {necessity.selectedVendorId ? (
              <span id="vendor-draft-final-badge" className="text-[10px] bg-green/10 text-green px-2 py-0.5 rounded-full font-medium">Final sudah dipilih</span>
            ) : (
              <span id="vendor-draft-remaining" className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                remainingFinalizes > 0 ? "bg-orange/10 text-orange" : "bg-pink/10 text-pink"
              }`}>
                Sisa finalisasi: {remainingFinalizes}x
              </span>
            )}
          </div>
          {userVendors.length === 0 ? (
            <div id="vendor-draft-empty" className="text-center py-8 text-amber-800/40">
              <Icon name="storefront" size={36} className="mb-2 text-amber-800/30" />
              <p id="vendor-draft-empty-text" className="text-sm">Belum ada vendor draft</p>
            </div>
          ) : (
            <div id="vendor-draft-list" className="space-y-3">
              {userVendors.map((vendor) => {
                const isSelected = vendor.id === necessity.selectedVendorId;
                return (
                  <div key={vendor.id} id={`vendor-draft-${vendor.id}`}
                    className={`rounded-xl p-4 border transition-all ${
                      isSelected
                        ? "bg-green/[0.03] border-green/30 ring-1 ring-green/20"
                        : "bg-white border-gold/20 hover:bg-cream/50"
                    }`}>
                    <div id={`vendor-draft-${vendor.id}-row`} className="flex items-center gap-3">
                      <div id={`vendor-draft-${vendor.id}-icon`} className={`w-9 h-9 rounded-lg bg-cream flex items-center justify-center shrink-0`}>
                        <Icon name={getNecessityIcon(id, necessity.icon)} size={18} className={isSelected ? "text-green" : "text-amber-800/50"} />
                      </div>
                      <div id={`vendor-draft-${vendor.id}-content`} className="flex-1 min-w-0">
                        <div id={`vendor-draft-${vendor.id}-name-row`} className="flex items-center gap-2">
                          <p id={`vendor-draft-${vendor.id}-name`} className={`text-sm font-semibold ${isSelected ? "text-green" : "text-amber-900"}`}>{vendor.name}</p>
                          {isSelected && <span id={`vendor-draft-${vendor.id}-final-badge`} className="text-[9px] bg-green/10 text-green px-1.5 py-0.5 rounded-full shrink-0">Final</span>}
                        </div>
                        <p id={`vendor-draft-${vendor.id}-details`} className="text-xs text-amber-800/50">Prioritas #{vendor.priority} • Rp {vendor.budget.toLocaleString()}</p>
                      </div>
                      <div id={`vendor-draft-${vendor.id}-actions`} className="flex gap-1.5 shrink-0">
                        <button id={`vendor-draft-${vendor.id}-view-button`} onClick={() => { setSelectedVendor(vendor); }}
                          className="w-8 h-8 rounded-lg hover:bg-cream flex items-center justify-center text-amber-800/30 hover:text-orange transition-colors">
                          <Icon name="visibility" size={16} />
                        </button>
                        {!isSelected && (
                          <button id={`vendor-draft-${vendor.id}-finalize-button`} onClick={() => handleSelectVendor(vendor)}
                            disabled={remainingFinalizes <= 0}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                              remainingFinalizes > 0
                                ? "bg-orange/10 hover:bg-orange/20 text-orange"
                                : "bg-amber-800/10 text-amber-800/30 cursor-not-allowed"
                            }`}
                            title={remainingFinalizes <= 0 ? "Kuota finalisasi habis" : "Jadikan vendor final"}>
                            <Icon name="check" size={14} />
                            {remainingFinalizes > 0 ? "Finalize" : `Habis (${maxFinalizes}x)`}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recommended vendors */}
        <div id="vendor-rec-section" className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <h2 id="vendor-rec-title" className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
            <Icon name="auto_awesome" size={20} /> Rekomendasi Vendor
          </h2>
          {recommendedVendors.length === 0 ? (
            <div id="vendor-rec-empty" className="text-center py-8 text-amber-800/40">
              <Icon name="auto_awesome" size={36} className="mb-2 text-amber-800/30" />
              <p id="vendor-rec-empty-text" className="text-sm">Belum ada rekomendasi</p>
            </div>
          ) : (
            <div id="vendor-rec-list" className="space-y-3">
              {recommendedVendors.map((vendor) => {
                const c = getNecessityColor(id, necessity.color);
                return (
                  <button key={vendor.id} id={`vendor-rec-${vendor.id}`} onClick={() => setSelectedVendor(vendor)}
                    className="w-full text-left p-4 rounded-xl border border-orange/20 bg-orange/[0.02] hover:bg-orange/5 transition-all">
                    <div id={`vendor-rec-${vendor.id}-row`} className="flex items-center gap-3">
                      <div id={`vendor-rec-${vendor.id}-icon`} className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center shrink-0 bg-white/60`}>
                        <Icon name={getNecessityIcon(id, necessity.icon)} size={18} className={c.text} />
                      </div>
                      <div id={`vendor-rec-${vendor.id}-content`} className="flex-1 min-w-0">
                        <div id={`vendor-rec-${vendor.id}-name-row`} className="flex items-center gap-2">
                          <p id={`vendor-rec-${vendor.id}-name`} className={`text-sm font-semibold ${c.text}`}>{vendor.name}</p>
                          <span id={`vendor-rec-${vendor.id}-badge`} className="text-[10px] bg-white/80 text-orange px-1.5 py-0.5 rounded-full">Rek.</span>
                        </div>
                        <p id={`vendor-rec-${vendor.id}-details`} className="text-xs text-amber-800/50">Prioritas #{vendor.priority} • Rp{vendor.budget.toLocaleString()}</p>
                      </div>
                      <Icon name="chevron_right" size={16} className="text-amber-800/30" />
                    </div>
                  </button>
                );
              })}
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
      {cascadeVendor && (
        <CascadeWarning vendor={cascadeVendor} mode={cascadeMode}
          remainingFinalizes={maxFinalizes - finalizesUsed}
          maxFinalizes={maxFinalizes}
          onConfirm={cascadeMode === "select" ? confirmSelectVendor : confirmDeselectVendor}
          onCancel={() => setCascadeVendor(null)} />
      )}
    </div>
  );
}
