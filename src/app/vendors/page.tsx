"use client";

import { useState } from "react";
import { mockWeddingElements } from "@/data/mock";
import { getWeddingElementIcon, getWeddingElementColor } from "@/data/weddingElementIcons";
import VendorModal from "@/components/VendorModal";
import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";

export default function VendorsPage() {
  const [necessities, setNecessities] = useState(mockWeddingElements);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [newTaskInput, setNewTaskInput] = useState<Record<string, string>>({});

  const selectedItems = necessities
    .filter((n) => n.selectedVendorId)
    .map((n) => {
      const vendor = n.vendors.find((v) => v.id === n.selectedVendorId);
      return { necessity: n, vendor };
    })
    .filter((item) => item.vendor);

  const toggleVendorTask = (necId: string, taskId: string) => {
    setNecessities((prev) =>
      prev.map((n) => {
        if (n.id !== necId) return n;
        const tasks = (n.vendorTasks ?? []).map((t) =>
          t.id === taskId ? { ...t, done: !t.done } : t
        );
        const doneTask = (n.vendorTasks ?? []).find((t) => t.id === taskId);
        const activity = n.vendorActivity ?? [];
        const newActivity = doneTask
          ? { id: `va${Date.now()}`, action: `Task '${doneTask.title}' ${doneTask.done ? "dibatalkan" : "selesai"}`, date: new Date().toISOString() }
          : null;
        return { ...n, vendorTasks: tasks, vendorActivity: newActivity ? [newActivity, ...activity] : activity };
      })
    );
  };

  const addVendorTask = (necId: string) => {
    const title = (newTaskInput[necId] ?? "").trim();
    if (!title) return;
    setNecessities((prev) =>
      prev.map((n) => {
        if (n.id !== necId) return n;
        return {
          ...n,
          vendorTasks: [...(n.vendorTasks ?? []), { id: `vt${Date.now()}`, title, done: false }],
          vendorActivity: [
            { id: `va${Date.now()}`, action: `Task ditambahkan: '${title}'`, date: new Date().toISOString() },
            ...(n.vendorActivity ?? []),
          ],
        };
      })
    );
    setNewTaskInput((prev) => ({ ...prev, [necId]: "" }));
  };

  const deleteVendorTask = (necId: string, taskId: string) => {
    setNecessities((prev) =>
      prev.map((n) => {
        if (n.id !== necId) return n;
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

  const getRelativeTime = (dateStr: string) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}j`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}h`;
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  return (
    <div id="vendor-tracker-container" className="max-w-6xl space-y-6">
      <div id="vendor-tracker-header">
        <Tooltip content="Pantau vendor final dan tugas-tugasnya" position="bottom"><h1 id="vendor-tracker-title" className="text-2xl font-bold text-amber-900">Vendor Tracker</h1></Tooltip>
        <p id="vendor-tracker-subtitle" className="text-amber-800/60">{selectedItems.length} vendor final terpilih</p>
      </div>

      {selectedItems.length === 0 ? (
        <div id="vendor-tracker-empty-state" className="text-center py-20 text-amber-800/40">
          <Icon name="storefront" size={48} className="mb-3 text-amber-800/20" />
          <p id="vendor-tracker-empty-text" className="text-sm mb-2">Belum ada vendor final</p>
          <p id="vendor-tracker-empty-hint" className="text-xs text-amber-800/30">Pilih vendor final di halaman <strong id="vendor-tracker-empty-highlight">Elemen Pernikahan</strong> untuk mulai tracking</p>
        </div>
      ) : (
        <div id="vendor-tracker-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {selectedItems.map(({ necessity, vendor }) => {
            const c = getWeddingElementColor(necessity.id, necessity.color);
            const tasks = necessity.vendorTasks ?? [];
            const activity = necessity.vendorActivity ?? [];
            const doneTasks = tasks.filter((t) => t.done).length;
            const pendingActivity = activity.filter((a) => !a.action.includes("selesai")).slice(0, 1);
            const doneActivity = activity.filter((a) => a.action.includes("selesai")).slice(0, 2);
            const displayActivity = [...pendingActivity, ...doneActivity];

            return (
              <div id={`vendor-tracker-card-${necessity.id}`} key={necessity.id}
                className="bg-white rounded-2xl border border-gold/30 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                {/* Header */}
                <div id={`vendor-tracker-card-header-${necessity.id}`} className={`${c.bg} ${c.border} border-b px-5 py-4`}>
                  <div id={`vendor-tracker-card-header-row-${necessity.id}`} className="flex items-center gap-3">
                    <div id={`vendor-tracker-card-icon-${necessity.id}`} className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center bg-white/60`}>
                      <Icon name={getWeddingElementIcon(necessity.id, necessity.icon)} size={24} className={c.text} />
                    </div>
                    <div id={`vendor-tracker-card-info-${necessity.id}`} className="flex-1 min-w-0">
                      <div id={`vendor-tracker-card-name-row-${necessity.id}`} className="flex items-center gap-2">
                        <h3 id={`vendor-tracker-card-name-${necessity.id}`} className={`text-base font-bold ${c.text} truncate`}>{vendor!.name}</h3>
                        <span id={`vendor-tracker-card-badge-${necessity.id}`} className="text-[9px] bg-white/80 text-green px-1.5 py-0.5 rounded-full">Final</span>
                      </div>
                      <p id={`vendor-tracker-card-category-${necessity.id}`} className="text-xs text-amber-800/50">{necessity.name} • Prioritas #{vendor!.priority}</p>
                    </div>
                    <button id={`vendor-tracker-card-view-btn-${necessity.id}`} onClick={() => setSelectedVendor(vendor!)}
                      className="w-8 h-8 rounded-lg bg-white/60 hover:bg-white flex items-center justify-center text-amber-800/40 hover:text-orange transition-colors cursor-pointer">
                      <Icon name="visibility" size={16} />
                    </button>
                  </div>
                  <div id={`vendor-tracker-card-stats-${necessity.id}`} className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-3 text-xs">
                    <span id={`vendor-tracker-card-budget-${necessity.id}`} className="flex items-center gap-1 text-amber-800/50">
                      <Icon name="account_balance_wallet" size={12} /> Rp {vendor!.budget.toLocaleString()}
                    </span>
                    <span id={`vendor-tracker-card-tasks-count-${necessity.id}`} className="flex items-center gap-1 text-amber-800/50">
                      <Icon name="assignment" size={12} /> {doneTasks}/{tasks.length} task
                    </span>
                    <span id={`vendor-tracker-card-activity-count-${necessity.id}`} className="flex items-center gap-1 text-amber-800/50">
                      <Icon name="history" size={12} /> {activity.length} aktivitas
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div id={`vendor-tracker-card-body-${necessity.id}`} className="p-5 space-y-4">
                  {/* Tasks */}
                  <div id={`vendor-tracker-card-tasks-${necessity.id}`}>
                    <div id={`vendor-tracker-card-tasks-header-${necessity.id}`} className="flex items-center justify-between mb-2">
                      <p id={`vendor-tracker-card-tasks-label-${necessity.id}`} className="text-xs font-medium text-amber-900/70">Task</p>
                      <span id={`vendor-tracker-card-tasks-progress-${necessity.id}`} className="text-[10px] text-amber-800/40">{doneTasks}/{tasks.length}</span>
                    </div>

                    {/* Add task */}
                    <form id={`vendor-tracker-card-task-form-${necessity.id}`} onSubmit={(e) => { e.preventDefault(); addVendorTask(necessity.id); }}
                      className="flex items-center gap-2 mb-2">
                      <input id={`vendor-tracker-card-task-input-${necessity.id}`} value={newTaskInput[necessity.id] ?? ""}
                        onChange={(e) => setNewTaskInput((prev) => ({ ...prev, [necessity.id]: e.target.value }))}
                        placeholder="Tambah task…"
                        className="flex-1 px-3 py-2 rounded-lg border border-gold/30 bg-cream/50 text-xs text-amber-900 focus:outline-none focus:border-orange placeholder-amber-800/30" />
                      <button id={`vendor-tracker-card-task-add-btn-${necessity.id}`} type="submit" disabled={!(newTaskInput[necessity.id] ?? "").trim()}
                        className="px-3 py-2 rounded-lg bg-orange text-white text-xs font-medium hover:bg-orange/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        + Add
                      </button>
                    </form>

                    {tasks.length > 0 && (
                      <div id={`vendor-tracker-card-task-list-${necessity.id}`} className="space-y-1">
                        {tasks.map((task) => (
                          <div id={`vendor-tracker-card-task-item-${necessity.id}-${task.id}`} key={task.id}
                            className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-cream/50 transition-colors group">
                            <button id={`vendor-tracker-card-task-toggle-${necessity.id}-${task.id}`} onClick={() => toggleVendorTask(necessity.id, task.id)}
                              className="flex items-center gap-2.5 flex-1 text-left cursor-pointer">
                              <div id={`vendor-tracker-card-task-checkbox-${necessity.id}-${task.id}`} className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                                task.done ? "bg-green border-green" : "border-amber-800/20"
                              }`}>
                                {task.done && <Icon name="check" size={10} className="text-white" />}
                              </div>
                              <span id={`vendor-tracker-card-task-title-${necessity.id}-${task.id}`} className={`text-sm ${task.done ? "text-amber-800/50 line-through" : "text-amber-900"}`}>
                                {task.title}
                              </span>
                            </button>
                            <button id={`vendor-tracker-card-task-delete-btn-${necessity.id}-${task.id}`} onClick={() => deleteVendorTask(necessity.id, task.id)}
                              className="sm:opacity-0 sm:group-hover:opacity-100 text-amber-800/30 hover:text-red transition-all shrink-0 cursor-pointer">
                              <Icon name="close" size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Activity */}
                  {displayActivity.length > 0 && (
                    <div id={`vendor-tracker-card-activity-${necessity.id}`}>
                      <p id={`vendor-tracker-card-activity-label-${necessity.id}`} className="text-xs font-medium text-amber-900/70 mb-2">Aktivitas Terbaru</p>
                      <div id={`vendor-tracker-card-activity-list-${necessity.id}`} className="space-y-2">
                        {displayActivity.map((act) => {
                          const isDone = act.action.includes("selesai");
                          return (
                            <div id={`vendor-tracker-card-activity-item-${act.id}`} key={act.id} className="flex items-start gap-2.5">
                              <div id={`vendor-tracker-card-activity-dot-${act.id}`} className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isDone ? "bg-green" : "bg-gold"}`} />
                              <div id={`vendor-tracker-card-activity-text-${act.id}`} className="flex-1 min-w-0">
                                <p id={`vendor-tracker-card-activity-action-${act.id}`} className="text-xs text-amber-800/70">{act.action}</p>
                                <p id={`vendor-tracker-card-activity-time-${act.id}`} className="text-[10px] text-amber-800/40">{getRelativeTime(act.date)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {(tasks.length === 0 && displayActivity.length === 0) && (
                    <p id={`vendor-tracker-card-empty-activity-${necessity.id}`} className="text-xs text-amber-800/40 text-center py-4">Belum ada aktivitas</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedVendor && (
        <VendorModal vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />
      )}
    </div>
  );
}
