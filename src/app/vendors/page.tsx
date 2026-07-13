"use client";

import { useState } from "react";
import { mockNecessities } from "@/data/mock";
import { getNecessityIcon, getNecessityColor } from "@/data/necessityIcons";
import VendorModal from "@/components/VendorModal";
import Icon from "@/components/Icon";

export default function VendorsPage() {
  const [necessities, setNecessities] = useState(mockNecessities);
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
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-amber-900">Vendor Tracker</h1>
        <p className="text-amber-800/60">{selectedItems.length} vendor final terpilih</p>
      </div>

      {selectedItems.length === 0 ? (
        <div className="text-center py-20 text-amber-800/40">
          <Icon name="storefront" size={48} className="mb-3 text-amber-800/20" />
          <p className="text-sm mb-2">Belum ada vendor final</p>
          <p className="text-xs text-amber-800/30">Pilih vendor final di halaman <strong>Kebutuhan</strong> untuk mulai tracking</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {selectedItems.map(({ necessity, vendor }) => {
            const c = getNecessityColor(necessity.id, necessity.color);
            const tasks = necessity.vendorTasks ?? [];
            const activity = necessity.vendorActivity ?? [];
            const doneTasks = tasks.filter((t) => t.done).length;
            const pendingActivity = activity.filter((a) => !a.action.includes("selesai")).slice(0, 1);
            const doneActivity = activity.filter((a) => a.action.includes("selesai")).slice(0, 2);
            const displayActivity = [...pendingActivity, ...doneActivity];

            return (
              <div key={necessity.id}
                className="bg-white rounded-2xl border border-gold/30 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                {/* Header */}
                <div className={`${c.bg} ${c.border} border-b px-5 py-4`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center bg-white/60`}>
                      <Icon name={getNecessityIcon(necessity.id, necessity.icon)} size={24} className={c.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-base font-bold ${c.text}`}>{vendor!.name}</h3>
                        <span className="text-[9px] bg-white/80 text-green px-1.5 py-0.5 rounded-full">Final</span>
                      </div>
                      <p className="text-xs text-amber-800/50">{necessity.name} • Prioritas #{vendor!.priority}</p>
                    </div>
                    <button onClick={() => setSelectedVendor(vendor!)}
                      className="w-8 h-8 rounded-lg bg-white/60 hover:bg-white flex items-center justify-center text-amber-800/40 hover:text-orange transition-colors">
                      <Icon name="visibility" size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-xs">
                    <span className="flex items-center gap-1 text-amber-800/50">
                      <Icon name="account_balance_wallet" size={12} /> Rp {vendor!.budget.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-amber-800/50">
                      <Icon name="assignment" size={12} /> {doneTasks}/{tasks.length} task
                    </span>
                    <span className="flex items-center gap-1 text-amber-800/50">
                      <Icon name="history" size={12} /> {activity.length} aktivitas
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  {/* Tasks */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-amber-900/70">Task</p>
                      <span className="text-[10px] text-amber-800/40">{doneTasks}/{tasks.length}</span>
                    </div>

                    {/* Add task */}
                    <form onSubmit={(e) => { e.preventDefault(); addVendorTask(necessity.id); }}
                      className="flex items-center gap-2 mb-2">
                      <input value={newTaskInput[necessity.id] ?? ""}
                        onChange={(e) => setNewTaskInput((prev) => ({ ...prev, [necessity.id]: e.target.value }))}
                        placeholder="Tambah task…"
                        className="flex-1 px-3 py-2 rounded-lg border border-gold/30 bg-cream/50 text-xs text-amber-900 focus:outline-none focus:border-orange placeholder-amber-800/30" />
                      <button type="submit" disabled={!(newTaskInput[necessity.id] ?? "").trim()}
                        className="px-3 py-2 rounded-lg bg-orange text-white text-xs font-medium hover:bg-orange/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        + Add
                      </button>
                    </form>

                    {tasks.length > 0 && (
                      <div className="space-y-1">
                        {tasks.map((task) => (
                          <div key={task.id}
                            className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-cream/50 transition-colors group">
                            <button onClick={() => toggleVendorTask(necessity.id, task.id)}
                              className="flex items-center gap-2.5 flex-1 text-left">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                                task.done ? "bg-green border-green" : "border-amber-800/20"
                              }`}>
                                {task.done && <Icon name="check" size={10} className="text-white" />}
                              </div>
                              <span className={`text-sm ${task.done ? "text-amber-800/50 line-through" : "text-amber-900"}`}>
                                {task.title}
                              </span>
                            </button>
                            <button onClick={() => deleteVendorTask(necessity.id, task.id)}
                              className="opacity-0 group-hover:opacity-100 text-amber-800/30 hover:text-red transition-all shrink-0">
                              <Icon name="close" size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Activity */}
                  {displayActivity.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-amber-900/70 mb-2">Aktivitas Terbaru</p>
                      <div className="space-y-2">
                        {displayActivity.map((act) => {
                          const isDone = act.action.includes("selesai");
                          return (
                            <div key={act.id} className="flex items-start gap-2.5">
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isDone ? "bg-green" : "bg-gold"}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-amber-800/70">{act.action}</p>
                                <p className="text-[10px] text-amber-800/40">{getRelativeTime(act.date)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {(tasks.length === 0 && displayActivity.length === 0) && (
                    <p className="text-xs text-amber-800/40 text-center py-4">Belum ada aktivitas</p>
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
