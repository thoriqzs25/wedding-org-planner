"use client";

import { useState } from "react";
import Link from "next/link";
import { mockNecessities } from "@/data/mock";
import { Necessity, Todo, NecessityColor } from "@/types";
import { getNecessityIcon, getNecessityColor } from "@/data/necessityIcons";
import Icon from "@/components/Icon";
import NecessityFormModal from "@/components/NecessityFormModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Tooltip from "@/components/Tooltip";

type Tab = "kebutuhan" | "todos";

export default function NecessityListPage() {
  const [necessities, setNecessities] = useState(mockNecessities);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("kebutuhan");

  const handleAdd = (name: string, icon: string, color: NecessityColor) => {
    const newNec: Necessity = {
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
    n.todos.map((t) => ({ ...t, necessityId: n.id, necessityName: n.name }))
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
    { key: "kebutuhan", label: "Kebutuhan", mobile: "Kebutuhan", icon: "checklist" },
    { key: "todos", label: `Semua To-Do (${allTodos.length})`, mobile: `To-Do (${allTodos.length})`, icon: "format_list_bulleted" },
  ];

  return (
    <div id="necessity-page" className="max-w-5xl space-y-6">
      <div id="necessity-header" className="flex items-center justify-between">
        <div id="necessity-header-text">
          <Tooltip content="Daftar semua kebutuhan pernikahan"><h1 id="necessity-page-title" className="text-2xl font-bold text-amber-900">Kebutuhan</h1></Tooltip>
          <p id="necessity-page-subtitle" className="text-amber-800/60">Kelola setiap kebutuhan pernikahanmu</p>
        </div>
        {tab === "kebutuhan" && (
        <button id="necessity-add-button" onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 min-h-[44px] bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm active:scale-90">
          <Icon name="add" size={18} /> Tambah Kebutuhan
        </button>
        )}
      </div>

      {/* Tabs */}
      <div id="necessity-tabs" className="flex gap-1 bg-white rounded-xl border border-gold/30 p-1 shadow-sm">
        {tabs.map((t) => (
          <button key={t.key} id={`tab-${t.key}`} onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
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

      {tab === "kebutuhan" ? (
        <>
          <div id="necessity-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {necessities.map((nec) => {
              const todoDone = nec.todos.filter((t) => t.status === "done").length;
              const todoTotal = nec.todos.length;
              const pct = todoTotal > 0 ? Math.round((todoDone / todoTotal) * 100) : 0;
              const hasOverdue = nec.todos.some(
                (t) => t.status !== "done" && new Date(t.dueDate) < today
              );
              const allDone = todoTotal > 0 && todoDone === todoTotal;
              const c = getNecessityColor(nec.id, nec.color);

              const upcomingTodo = nec.todos
                .filter((t) => t.status !== "done" && new Date(t.dueDate) >= today)
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

              const daysToDeadline = upcomingTodo
                ? Math.ceil((new Date(upcomingTodo.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                : null;

              const userVendors = nec.vendors.filter((v) => !v.isRecommended).length;
              const recVendors = nec.vendors.filter((v) => v.isRecommended).length;

              let statusLabel: string, statusColor: string, statusBg: string;
              if (allDone) {
                statusLabel = "Selesai";
                statusColor = "text-green";
                statusBg = "bg-green/10";
              } else if (hasOverdue) {
                statusLabel = "Terlewat";
                statusColor = "text-red";
                statusBg = "bg-red/10";
              } else if (todoTotal > 0) {
                statusLabel = "Diproses";
                statusColor = "text-gold";
                statusBg = "bg-gold/20";
              } else {
                statusLabel = "Baru";
                statusColor = "text-amber-800/50";
                statusBg = "bg-cream";
              }

              return (
                <div key={nec.id} id={`card-${nec.id}`} className="relative group">
                  <Link id={`card-${nec.id}-link`} href={`/necessity/${nec.id}`}
                    className={`block rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 ${
                      hasOverdue
                        ? "bg-white ring-2 ring-red/40"
                        : allDone
                        ? "bg-white border border-green/30"
                        : "bg-white border border-gold/30"
                    }`}>
                    <div id={`card-${nec.id}-header`} className="flex items-start gap-3 mb-4">
                      <div id={`card-${nec.id}-icon`} className={`relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        allDone ? "bg-green/10" : hasOverdue ? "bg-red/10" : c.bg
                      }`}>
                        <Icon name={getNecessityIcon(nec.id, nec.icon)} size={24}
                          className={allDone ? "text-green" : hasOverdue ? "text-red" : c.text} />
                        {allDone && (
                          <div id={`card-${nec.id}-check-badge`} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green flex items-center justify-center">
                            <Icon name="check" size={10} className="text-white" />
                          </div>
                        )}
                        {hasOverdue && (
                          <div id={`card-${nec.id}-warning-wrapper`} className="absolute -top-1 -right-1">
                            <Tooltip content="Ada to-do yang terlewat deadline">
                              <div id={`card-${nec.id}-warning-icon`} className="w-4 h-4 rounded-full bg-red shadow-sm flex items-center justify-center cursor-help">
                                <Icon name="warning" size={9} className="text-white" filled />
                              </div>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                      <div id={`card-${nec.id}-content`} className="flex-1 min-w-0">
                        <div id={`card-${nec.id}-title-row`} className="flex items-center gap-2">
                          <h3 id={`card-${nec.id}-name`} className={`text-sm font-bold ${
                            hasOverdue ? "text-red" : allDone ? "text-green" : "text-amber-900"
                          }`}>{nec.name}</h3>
                          {nec.isDefault && (
                            <span id={`card-${nec.id}-default-badge`} className="text-[9px] bg-amber-800/10 text-amber-800/50 px-1.5 py-0.5 rounded-full shrink-0">default</span>
                          )}
                          {nec.selectedVendorId && (
                            <span id={`card-${nec.id}-final-badge`} className="text-[9px] bg-green/10 text-green px-1.5 py-0.5 rounded-full shrink-0 font-medium">final</span>
                          )}
                        </div>
                        <div id={`card-${nec.id}-status-row`} className="flex items-center gap-2 mt-1">
                          <span id={`card-${nec.id}-status-badge`} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusBg} ${statusColor}`}>
                            {statusLabel}
                          </span>
                          {daysToDeadline !== null && !allDone && (
                            <span id={`card-${nec.id}-deadline`} className="text-[10px] text-amber-800/40 flex items-center gap-0.5">
                              <Icon name="schedule" size={10} />
                              {daysToDeadline === 0 ? "Hari ini" : `${daysToDeadline} hari lagi`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {todoTotal > 0 ? (
                      <div id={`card-${nec.id}-progress-section`} className="mb-4">
                        <div id={`card-${nec.id}-progress-row`} className="flex items-center gap-3 mb-1.5">
                          <div id={`card-${nec.id}-progress-track`} className="flex-1 h-2 bg-cream rounded-full overflow-hidden">
                            <div id={`card-${nec.id}-progress-fill`} className={`h-full rounded-full transition-all duration-500 ${
                              allDone ? "bg-green" : hasOverdue ? "bg-red" : "bg-orange"
                            }`} style={{ width: `${pct}%` }} />
                          </div>
                          <span id={`card-${nec.id}-progress-text`} className={`text-xs font-semibold ${
                            allDone ? "text-green" : hasOverdue ? "text-red" : "text-orange"
                          }`}>{pct}%</span>
                        </div>
                      </div>
                    ) : (
                      <div id={`card-${nec.id}-empty-todos`} className="mb-4 py-1">
                        <p id={`card-${nec.id}-empty-todos-text`} className="text-[10px] text-amber-800/30 italic">Belum ada to-do list</p>
                      </div>
                    )}

                    <div id={`card-${nec.id}-footer`} className="flex items-center gap-3 text-[11px] text-amber-800/50 flex-wrap">
                      <span id={`card-${nec.id}-todo-count`} className="flex items-center gap-1">
                        <Icon name="checklist" size={12} />
                        {todoDone}/{todoTotal} to-do
                      </span>
                      <span id={`card-${nec.id}-vendor-count`} className="flex items-center gap-1">
                        <Icon name="storefront" size={12} />
                        {userVendors} vendor
                      </span>
                      {recVendors > 0 && (
                        <span id={`card-${nec.id}-rec-count`} className="flex items-center gap-1 text-orange/60">
                          <Icon name="auto_awesome" size={12} />
                          {recVendors} rekomendasi
                        </span>
                      )}
                      {nec.selectedVendorId && (() => {
                        const sv = nec.vendors.find((v) => v.id === nec.selectedVendorId);
                        return sv ? (
                          <span id={`card-${nec.id}-selected-vendor`} className="flex items-center gap-1.5 ml-auto bg-green/10 text-green px-2 py-0.5 rounded-full text-[10px] font-medium border border-green/20">
                            <Icon name="check_circle" size={10} filled />
                            Vendor: {sv.name.length > 18 ? sv.name.slice(0, 18) + "…" : sv.name}
                          </span>
                        ) : null;
                      })()}
                      {upcomingTodo && !allDone && !nec.selectedVendorId && (
                        <span id={`card-${nec.id}-upcoming-todo`} className="flex items-center gap-1 ml-auto text-[10px]">
                          <Icon name="flag" size={10} />
                          {upcomingTodo.title.length > 12 ? upcomingTodo.title.slice(0, 12) + "…" : upcomingTodo.title}
                        </span>
                      )}
                    </div>
                  </Link>

              <button id={`card-${nec.id}-delete-button`} onClick={() => setDeleteId(nec.id)}
                className="absolute top-3 right-3 flex items-center justify-center w-11 h-11 rounded-xl text-amber-800/30 hover:text-red hover:bg-red/10 transition-colors active:scale-90">
                <Icon name="close" size={16} />
              </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* All Todos tab */
        <div id="todos-container" className="bg-white rounded-2xl border border-gold/30 shadow-sm overflow-hidden">
          {sortedTodos.length === 0 ? (
            <div id="todos-empty" className="text-center py-12 text-amber-800/40">
              <Icon name="format_list_bulleted" size={40} className="mb-3 text-amber-800/20" />
              <p id="todos-empty-title" className="text-sm">Belum ada to-do list</p>
              <p id="todos-empty-subtitle" className="text-xs mt-1">Tambahkan to-do dari halaman kebutuhan</p>
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
                  <Link key={todo.id} id={`todo-${todo.id}`} href={`/necessity/${todo.necessityId}`}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-cream/50 transition-colors group ${
                      isOverdue ? "bg-red/[0.02]" : ""
                    }`}>
                    <button id={`todo-${todo.id}-status-button`} onClick={(e) => { e.preventDefault(); cycleStatus(todo.id); }}
                      className={`flex items-center justify-center w-11 h-11 shrink-0 rounded-full border-2 transition-all active:scale-90 ${
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
                        <span id={`todo-${todo.id}-necessity`} className="text-[11px] text-amber-800/50">{todo.necessityName}</span>
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

      {showForm && <NecessityFormModal existingNames={necessities.map((n) => n.name)} onSave={handleAdd} onClose={() => setShowForm(false)} />}
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
