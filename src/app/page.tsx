"use client";

import { useState } from "react";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import Icon from "@/components/Icon";
import {
  mockQuestionnaire,
  mockNecessities,
  mockRecentActivities,
  getTotalSpent,
} from "@/data/mock";
import { getNecessityIcon, getNecessityColor } from "@/data/necessityIcons";
import { Todo, RecentActivity, Vendor } from "@/types";
import Tooltip from "@/components/Tooltip";
import WeddingInfoModal from "@/components/WeddingInfoModal";
import { getTopRecommendations } from "@/utils/recommendations";
import { fireConfetti } from "@/lib/confetti";

export default function DashboardPage() {
  const [necessities, setNecessities] = useState(mockNecessities);
  const [weddingInfo, setWeddingInfo] = useState(mockQuestionnaire);
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [infoTab, setInfoTab] = useState<"acara" | "budget">("acara");
  const [showBeforeMarry, setShowBeforeMarry] = useState(true);
  const [showVendorRecs, setShowVendorRecs] = useState(true);
  const [showOverdue, setShowOverdue] = useState(true);
  const [quickAddVendor, setQuickAddVendor] = useState<{
    vendor: Vendor;
    necessityId: string;
    necessityName: string;
  } | null>(null);
  const activities = mockRecentActivities;

  const allTodos = necessities.flatMap((n) =>
    n.todos.map((t) => ({ ...t, necessityName: n.name }))
  );
  const totalTodos = allTodos.length;
  const doneTodos = allTodos.filter((t) => t.status === "done").length;
  const totalBudget = weddingInfo.budget;
  const totalSpent = getTotalSpent();
  const today = new Date();

  const overdueTodos = allTodos.filter(
    (t) => t.status !== "done" && new Date(t.dueDate) < today
  );

  const needsVendor = necessities.filter((n) => n.vendors.length === 0);

  const checklistedNec = necessities.filter(
    (n) => n.todos.length > 0 && n.todos.every((t) => t.status === "done")
  ).length;

  const weddingDate = new Date(weddingInfo.weddingDate);
  const daysToWedding = Math.ceil(
    (new Date(weddingInfo.weddingDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalDays = Math.ceil(
    (weddingDate.getTime() - new Date("2025-07-01").getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysElapsed = totalDays - daysToWedding;
  const timeProgress = Math.min(100, Math.round((daysElapsed / totalDays) * 100));

  const overallPct = totalTodos > 0 ? Math.round((doneTodos / totalTodos) * 100) : 0;

  const warnThreshold = {
    budget: totalSpent > totalBudget * 0.8,
    time: daysToWedding <= 30,
  };

  const cycleStatus = (todoId: string) => {
    setNecessities((prev) => {
      const next = prev.map((n) => ({
        ...n,
        todos: n.todos.map((t) => {
          if (t.id !== todoId) return t;
          const nextStatus: Record<string, Todo["status"]> = {
            pending: "in_progress",
            in_progress: "done",
            done: "pending",
          };
          return { ...t, status: nextStatus[t.status] };
        }),
      }));
      return next;
    });
  };

  const handleQuickAddVendor = () => {
    if (!quickAddVendor) return;
    const { vendor, necessityId } = quickAddVendor;
    const newVendor: Vendor = {
      ...vendor,
      id: `v-quick-${Date.now()}`,
      necessityId,
    };
    setNecessities((prev) =>
      prev.map((n) =>
        n.id === necessityId
          ? { ...n, vendors: [...n.vendors, newVendor] }
          : n
      )
    );
    setQuickAddVendor(null);
  };

  const getDaysOverdue = (dueDate: string) => {
    const diff = today.getTime() - new Date(dueDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getRelativeTime = (dateStr: string) => {
    const diff = today.getTime() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari lalu`;
    return new Date(dateStr).toLocaleDateString("id-ID");
  };

  const getActionMeta = (type: RecentActivity["actionType"]) => {
    const map: Record<RecentActivity["actionType"], { icon: string; color: string; bg: string; label: string; badge: string }> = {
      todo_created:        { icon: "add_task",     color: "text-blue",    bg: "bg-blue/10",   label: "To-do Baru",     badge: "bg-blue/10 text-blue" },
      todo_completed:      { icon: "check_circle",  color: "text-green",  bg: "bg-green/10",  label: "Selesai",        badge: "bg-green/10 text-green" },
      vendor_added:        { icon: "business",     color: "text-orange", bg: "bg-orange/10", label: "Vendor Baru",    badge: "bg-orange/10 text-orange" },
      vendor_selected:     { icon: "how_to_reg",   color: "text-green",  bg: "bg-green/10",  label: "Vendor Final",   badge: "bg-green/10 text-green" },
      vendor_deselected:   { icon: "remove_circle", color: "text-pink",  bg: "bg-pink/10",   label: "Vendor Diganti", badge: "bg-pink/10 text-pink" },
      vendor_task_completed: { icon: "checklist",  color: "text-emerald", bg: "bg-emerald/10", label: "Task Vendor",   badge: "bg-emerald/10 text-emerald" },
      invoice_added:       { icon: "receipt",      color: "text-gold",   bg: "bg-gold/20",   label: "Invoice",        badge: "bg-gold/30 text-amber-800" },
      gallery_item_added:  { icon: "collections",  color: "text-purple", bg: "bg-purple/10", label: "Mood Board",     badge: "bg-purple/10 text-purple" },
      calendar_event_added: { icon: "event",       color: "text-amber", bg: "bg-amber/10",  label: "Jadwal",         badge: "bg-amber/10 text-amber" },
    };
    return map[type] ?? map.todo_created;
  };

  return (
    <div id="dashboard-page" className="max-w-6xl space-y-6">
      {/* Header */}
      <div id="dashboard-header" className="flex items-start justify-between">
        <div>
          <h1 id="header-greeting" className="text-2xl font-bold text-amber-900">
            Hai, {weddingInfo.brideName} & {weddingInfo.groomName}!{" "}
            <Icon name="waving_hand" size={24} className="inline" />
          </h1>
          <div id="header-meta" className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1">
            <p id="header-date-location" className="text-amber-800/60">
              {weddingInfo.weddingDate} • {weddingInfo.location}
            </p>
            <span id="header-dot-sep" className="text-amber-800/20 hidden sm:inline">•</span>
            <p id="header-guest-count" className="text-amber-800/60 flex items-center gap-1">
              <Icon name="people" size={14} className="text-gold" />
              {weddingInfo.guestCount.toLocaleString()} tamu
            </p>
            <button id="header-edit-date-btn" onClick={() => { setInfoTab("acara"); setShowInfoForm(true); }}
              className="text-amber-800/30 hover:text-orange transition-colors cursor-pointer" title="Edit tanggal & lokasi">
              <Icon name="edit" size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Full-width countdown banner */}
      <div id="countdown-banner" className={`relative overflow-hidden rounded-2xl shadow-sm ${
        warnThreshold.time
          ? "bg-gradient-to-br from-pink/15 via-pink/5 to-amber-50 border-2 border-pink/30"
          : "bg-gradient-to-br from-orange/10 via-gold/10 to-amber-50 border border-gold/30"
      }`}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #EB7B26 1px, transparent 1px),
                              radial-gradient(circle at 80% 20%, #FC95B4 1px, transparent 1px),
                              radial-gradient(circle at 60% 80%, #FFCE62 1px, transparent 1px)`,
            backgroundSize: '40px 40px, 30px 30px, 50px 50px',
          }}
        />
        <div id="countdown-inner" className="relative px-5 sm:px-8 py-5 sm:py-6 flex items-center gap-4 sm:gap-8">
          <div id="countdown-ring-wrap" className="relative shrink-0">
            <div id="countdown-ring" className="relative w-20 h-20 sm:w-24 sm:h-24">
              <svg id="countdown-svg" className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <circle id="countdown-ring-bg" cx="18" cy="18" r="15.5" fill="none" stroke="#FFFAE5" strokeWidth="2.5" />
                <circle id="countdown-ring-fill" cx="18" cy="18" r="15.5" fill="none"
                  stroke={warnThreshold.time ? "#FC95B4" : "#EB7B26"}
                  strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={`${timeProgress} ${100 - timeProgress}`}
                  className="transition-all duration-700" />
              </svg>
              <span id="countdown-days-num" className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${
                warnThreshold.time ? "text-pink" : "text-orange"
              }`}>
                {daysToWedding}
              </span>
            </div>
          </div>

          <div id="countdown-text" className="flex-1 min-w-0">
            <p id="countdown-label" className={`text-sm font-semibold tracking-wide uppercase mb-1 ${
              warnThreshold.time ? "text-pink" : "text-amber-800/50"
            }`}>Countdown</p>
            <p id="countdown-days-large" className={`text-2xl sm:text-5xl font-bold leading-none tracking-tight ${
              warnThreshold.time ? "text-pink" : "text-amber-900"
            }`}>
              {daysToWedding}
              <span id="countdown-days-to-go" className={`text-sm sm:text-xl font-normal ml-2 ${
                warnThreshold.time ? "text-pink/60" : "text-amber-800/50"
              }`}>days to go</span>
            </p>
            <div id="countdown-meta" className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2">
              <p id="countdown-wedding-date" className="text-sm text-amber-800/60">
                {weddingDate.toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
              <span id="countdown-meta-dot" className="text-amber-800/20">•</span>
              <Tooltip content="Persentase waktu yang sudah terlewati sejak persiapan pernikahan dimulai">
                <p id="countdown-journey-pct" className="text-sm text-amber-800/50 border-b border-dotted border-amber-800/20 cursor-help">{timeProgress}% journey</p>
              </Tooltip>
            </div>
            <div id="countdown-progress" className="mt-3 max-w-md">
              <div id="countdown-progress-bg" className="h-3 rounded-full bg-amber-200/50 overflow-hidden shadow-inner">
                <div id="countdown-progress-fill" className={`h-full rounded-full transition-all duration-700 ${
                  warnThreshold.time ? "bg-pink" : "bg-orange"
                }`} style={{ width: `${timeProgress}%` }} />
              </div>
            </div>
          </div>

          <div id="countdown-confetti-trigger" className="hidden sm:flex flex-col items-center gap-1 shrink-0 cursor-pointer"
            onClick={() => {
              fireConfetti(0.85, 0.25)
              fireConfetti(0.15, 0.15)
              fireConfetti(0.5, 0.1)
              fireConfetti(0.15, 0.6)
              fireConfetti(0.85, 0.6)
            }}>
            <Icon name={warnThreshold.time ? "emergency" : "celebration"} size={32}
              className={warnThreshold.time ? "text-pink" : "text-gold"} filled />
            {!warnThreshold.time && (
              <span id="countdown-cta-text" className="text-[10px] text-amber-800/40 font-medium uppercase tracking-wide">
                {daysToWedding <= 90 ? "Soon!" : "Excited?"}
              </span>
            )}
          </div>
        </div>

        {warnThreshold.time && (
          <div id="countdown-warning-banner" className="relative px-5 sm:px-8 py-2 bg-pink/5 border-t border-pink/20 flex items-center gap-2">
            <Icon name="warning" size={14} className="text-pink" filled />
            <p id="countdown-warning-text" className="text-xs text-pink font-medium">Less than 30 days to go — time to finalize everything!</p>
          </div>
        )}
      </div>

      {/* Progress card */}
      <div id="progress-card" className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
        <div id="progress-header" className="flex items-center gap-3 mb-4">
          <Tooltip content="Persentase to-do yang sudah selesai dari total keseluruhan">
            <div id="progress-ring-wrap" className="relative w-14 h-14">
              <svg id="progress-ring-svg" className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <circle id="progress-ring-bg" cx="18" cy="18" r="15.5" fill="none" stroke="#E8D5B5" strokeWidth="2.5" />
                <circle id="progress-ring-fill" cx="18" cy="18" r="15.5" fill="none" stroke="#EB7B26" strokeWidth="2.5"
                  strokeDasharray={`${overallPct} ${100 - overallPct}`}
                  strokeLinecap="round" className="transition-all duration-700" />
              </svg>
              <span id="progress-pct" className="absolute inset-0 flex items-center justify-center text-xs font-bold text-orange">
                {overallPct}%
              </span>
            </div>
          </Tooltip>
          <div id="progress-title-wrap">
            <Tooltip content="Ringkasan progres to-do dan budget pernikahan"><h2 id="progress-title" className="text-lg font-semibold text-amber-900">Progress Pernikahan</h2></Tooltip>
            <p id="progress-subtitle" className="text-xs text-amber-800/50">
              {doneTodos} dari {totalTodos} to-do selesai
            </p>
          </div>
        </div>

        <div id="progress-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div id="progress-budget-card" className="bg-cream/60 rounded-xl p-4">
            <div id="progress-budget-header" className="flex items-center gap-2 mb-2">
              <Icon name="account_balance_wallet" size={16} className={warnThreshold.budget ? "text-pink" : "text-orange"} />
              <span id="progress-budget-label" className="text-xs font-medium text-amber-900/70">Budget</span>
              {warnThreshold.budget && <Tooltip content="Budget sudah terpakai lebih dari 80%"><Icon name="warning" size={12} className="text-pink" filled /></Tooltip>}
              <button id="progress-budget-edit-btn" onClick={() => { setInfoTab("budget"); setShowInfoForm(true); }}
                className="ml-auto text-amber-800/30 hover:text-orange transition-colors cursor-pointer" title="Edit budget">
                <Icon name="edit" size={12} />
              </button>
            </div>
            <ProgressBar value={totalSpent} max={totalBudget} label="" color="bg-orange" showWarning={false} />
            <div id="progress-budget-values" className="flex justify-between text-[11px] text-amber-800/50 mt-1.5">
              <span id="progress-budget-spent">Rp {totalSpent.toLocaleString()}</span>
              <span id="progress-budget-total">Rp {totalBudget.toLocaleString()}</span>
            </div>
          </div>

          <div id="progress-checklist-card" className="bg-cream/60 rounded-xl p-4">
            <div id="progress-checklist-header" className="flex items-center gap-2 mb-2">
              <Icon name="checklist" size={16} className="text-green" />
              <span id="progress-checklist-label" className="text-xs font-medium text-amber-900/70">Ceklis Kebutuhan</span>
            </div>
            <ProgressBar value={checklistedNec} max={necessities.length} label="" color="bg-green" showWarning={false} />
            <div id="progress-checklist-values" className="flex justify-between text-[11px] text-amber-800/50 mt-1.5">
              <span id="progress-checklist-done">{checklistedNec} kebutuhan</span>
              <span id="progress-checklist-total">{necessities.length} total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Masih perlu dicari — scrollable grid */}
        <div id="needs-vendor" className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm flex flex-col max-h-[420px]">
          <div id="needs-vendor-header" className="flex items-center justify-between mb-4 shrink-0">
            <Tooltip content="Kebutuhan yang belum memiliki vendor"><h2 id="needs-vendor-title" className="text-lg font-semibold text-amber-900 flex items-center gap-2">
              <Icon name="storefront" size={20} />
              Masih perlu dicari
            </h2></Tooltip>
            {needsVendor.length > 0 && (
              <span id="needs-vendor-badge" className="text-xs bg-pink/10 text-pink px-2.5 py-1 rounded-full font-medium">
                {needsVendor.length} perlu vendor
              </span>
            )}
          </div>
          <div id="needs-vendor-list" className="flex-1 overflow-y-auto min-h-0">
            {needsVendor.length === 0 ? (
              <div id="needs-vendor-empty" className="text-center py-8 text-amber-800/40">
                <Icon name="celebration" size={36} className="mb-2" />
                <p id="needs-vendor-empty-text" className="text-sm">Semua kebutuhan sudah punya vendor!</p>
              </div>
            ) : (
              <div id="needs-vendor-grid" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {needsVendor.map((n) => {
                  const c = getNecessityColor(n.id, n.color);
                  return (
                    <Link key={n.id} id={`needs-vendor-item-${n.id}`} href={`/necessity/${n.id}`}
                      className={`${c.bg} ${c.border} border rounded-xl p-4 hover:shadow-md transition-all group`}>
                      <div id={`needs-vendor-icon-${n.id}`} className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                        <Icon name={getNecessityIcon(n.id, n.icon)} size={20} className={c.text} />
                      </div>
                      <p id={`needs-vendor-name-${n.id}`} className={`text-sm font-semibold ${c.text} mb-1 truncate`}>{n.name}</p>
                      <span id={`needs-vendor-cta-${n.id}`} className={`text-[10px] ${c.text}/60 flex items-center gap-0.5 group-hover:underline`}>
                        Cari vendor <Icon name="arrow_forward" size={10} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent activity — scrollable log */}
        <div id="recent-activity" className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm flex flex-col max-h-[420px]">
          <div id="recent-activity-header" className="flex items-center justify-between mb-4 shrink-0">
            <Tooltip content="Riwayat perubahan dan aktivitas terbaru"><h2 id="recent-activity-title" className="text-lg font-semibold text-amber-900 flex items-center gap-2">
              <Icon name="edit_note" size={20} />
              Aktivitas Terakhir
            </h2></Tooltip>
            {activities.length > 0 && (
              <span id="recent-activity-count" className="text-xs text-amber-800/40">{activities.length} aktivitas</span>
            )}
          </div>
          <div id="recent-activity-list" className="flex-1 overflow-y-auto min-h-0 pr-1">
            {activities.length === 0 ? (
              <div id="recent-activity-empty" className="text-center py-8 text-amber-800/40">
                <Icon name="edit_note" size={32} className="mb-2 text-amber-800/20" />
                <p id="recent-activity-empty-text" className="text-sm">Belum ada aktivitas</p>
                <Link id="recent-activity-empty-link" href="/necessity" className="text-xs text-orange font-medium hover:underline mt-1 inline-block">
                  Mulai atur kebutuhan pernikahan
                </Link>
              </div>
            ) : (
              activities.map((act, idx) => {
                const isLast = idx === activities.length - 1;
                const actionMeta = getActionMeta(act.actionType);
                const ago = getRelativeTime(act.createdAt);

                return (
                  <Link key={act.id} id={`activity-${act.id}`} href={`/necessity/${act.necessityId}`}
                    className={`flex gap-4 group`}>
                    <div id={`activity-icon-col-${act.id}`} className="flex flex-col items-center shrink-0">
                      <div id={`activity-icon-${act.id}`} className={`w-8 h-8 rounded-lg ${actionMeta.bg} flex items-center justify-center shadow-sm`}>
                        <Icon name={actionMeta.icon} size={14} className={actionMeta.color} filled />
                      </div>
                      {!isLast && <div id={`activity-line-${act.id}`} className="w-0.5 flex-1 bg-gold/30 min-h-[16px]" />}
                    </div>
                    <div id={`activity-content-${act.id}`} className={`flex-1 min-w-0 pt-0.5 ${isLast ? "" : "pb-4"}`}>
                      <p id={`activity-action-${act.id}`} className="text-sm text-amber-900 leading-snug">
                        <span id={`activity-action-text-${act.id}`} className="group-hover:text-orange transition-colors">{act.action}</span>
                      </p>
                      <div id={`activity-meta-${act.id}`} className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1">
                        <span id={`activity-badge-${act.id}`} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${actionMeta.badge}`}>
                          {actionMeta.label}
                        </span>
                        <span id={`activity-necessity-${act.id}`} className="text-[11px] text-amber-800/40">{act.necessityName}</span>
                        <span id={`activity-time-${act.id}`} className="text-[11px] text-amber-800/30">{ago}</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Overdue warning — collapsible */}
      {overdueTodos.length > 0 && showOverdue && (
        <div id="todo-terlewat-expanded" className="rounded-2xl bg-white border-l-4 border-red shadow-sm">
          <div id="todo-terlewat-header" className="px-5 py-3">
            <div id="todo-terlewat-header-row" className="flex items-center justify-between">
              <div id="todo-terlewat-title-wrap" className="flex items-center gap-2">
                <Icon name="warning" size={16} className="text-red" filled />
                <span id="todo-terlewat-title" className="text-sm font-bold text-red-700">Todo Terlewat</span>
                <span id="todo-terlewat-count" className="bg-red/10 text-red text-[10px] px-2 py-0.5 rounded-full font-bold">{overdueTodos.length}</span>
              </div>
              <button id="todo-terlewat-close-btn" onClick={() => setShowOverdue(false)}
                className="flex items-center gap-1 text-xs text-amber-800/40 hover:text-amber-800 transition-colors cursor-pointer">
                Tutup
                <Icon name="close" size={14} />
              </button>
            </div>
          </div>
          <div id="todo-terlewat-list" className="px-5 pb-3 space-y-1.5">
            {overdueTodos.map((todo) => {
              const daysOverdue = getDaysOverdue(todo.dueDate);
              return (
                <div key={todo.id} id={`todo-terlewat-item-${todo.id}`}
                  className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg hover:bg-red/[0.02] transition-colors -mx-2.5">
                  <button id={`todo-terlewat-check-${todo.id}`} onClick={() => cycleStatus(todo.id)}
                    className="flex items-center justify-center w-6 h-6 rounded-md border border-red/30 shrink-0 hover:bg-red hover:border-red hover:text-white transition-all active:scale-90 cursor-pointer">
                    <Icon name="check" size={11} className="text-red/40 hover:text-white transition-colors" />
                  </button>
                  <div id={`todo-terlewat-content-${todo.id}`} className="flex-1 min-w-0">
                    <p id={`todo-terlewat-title-${todo.id}`} className="text-sm text-amber-900 truncate">{todo.title}</p>
                    <span id={`todo-terlewat-date-${todo.id}`} className="text-[10px] text-amber-800/40 truncate flex items-center gap-1">
                      <Icon name="calendar_today" size={10} />
                      {new Date(todo.dueDate).toLocaleDateString("id-ID")}
                      <span id={`todo-terlewat-necessity-${todo.id}`} className="hidden sm:inline">· {(todo as Todo & { necessityName: string }).necessityName}</span>
                    </span>
                  </div>
                  <span id={`todo-terlewat-overdue-${todo.id}`} className="shrink-0 text-[11px] font-bold text-red">{daysOverdue === 0 ? "Hari ini" : `Terlambat ${daysOverdue}h`}</span>
                </div>
              );
            })}
          </div>
          <div id="todo-terlewat-footer" className="px-5 py-2 border-t border-amber-800/5">
            <Link id="todo-terlewat-view-all" href="/necessity" className="text-[11px] text-red font-medium hover:underline inline-flex items-center gap-1">
              <span>Lihat semua kebutuhan</span>
              <Icon name="chevron_right" size={12} />
            </Link>
          </div>
        </div>
      )}
      {overdueTodos.length > 0 && !showOverdue && (
        <button id="todo-terlewat-collapsed" onClick={() => setShowOverdue(true)}
          className="relative overflow-hidden w-full rounded-2xl bg-red/5 border-2 border-dashed border-red/40 p-4 hover:border-red/60 hover:bg-red/10 hover:shadow-md transition-all group cursor-pointer">
          <div id="todo-terlewat-collapsed-inner" className="flex items-center gap-3">
            <div id="todo-terlewat-collapsed-icon" className="w-10 h-10 rounded-xl bg-gradient-to-br from-red to-red/80 flex items-center justify-center shadow-sm">
              <Icon name="warning" size={20} className="text-white" filled />
            </div>
            <div id="todo-terlewat-collapsed-text" className="flex-1 text-left">
              <p id="todo-terlewat-collapsed-title" className="text-sm font-semibold text-red-700">Todo Terlewat</p>
              <p id="todo-terlewat-collapsed-subtitle" className="text-xs text-amber-800/50">{overdueTodos.length} item perlu segera ditindaklanjuti — klik untuk buka</p>
            </div>
            <Icon name="add_circle" size={20} className="text-red/50 group-hover:text-red transition-colors" />
          </div>
        </button>
      )}

      {/* Vendor Recommendations - collapsible */}
      {necessities.some((n) => n.vendors.length > 0) && showVendorRecs && (
        <div id="vendor-recs-expanded" className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <div id="vendor-recs-header" className="flex items-center justify-between mb-4">
            <div id="vendor-recs-title-wrap" className="flex items-center gap-2">
              <Icon name="auto_awesome" size={20} className="text-orange" filled />
              <Tooltip content="Vendor yang paling cocok dengan budget dan jumlah tamu"><h2 id="vendor-recs-title" className="text-lg font-semibold text-amber-900">Rekomendasi Vendor Terbaik</h2></Tooltip>
              <span id="vendor-recs-guest-badge" className="text-xs bg-orange/10 text-orange px-2 py-0.5 rounded-full font-medium">
                {weddingInfo.guestCount} tamu
              </span>
            </div>
            <button id="vendor-recs-close-btn" onClick={() => setShowVendorRecs(false)}
              className="flex items-center gap-1 text-xs text-amber-800/40 hover:text-orange transition-colors cursor-pointer">
              Tutup
              <Icon name="close" size={14} />
            </button>
          </div>
          <p id="vendor-recs-subtitle" className="text-xs text-amber-800/50 mb-4">
            Berdasarkan jumlah tamu ({weddingInfo.guestCount} orang) dan total budget (Rp {weddingInfo.budget.toLocaleString()})
          </p>
          <div id="vendor-recs-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getTopRecommendations(
              necessities.flatMap((n) =>
                n.vendors.map((v) => ({ vendor: v, necessityName: n.name }))
              ),
              weddingInfo.guestCount,
              weddingInfo.budget,
              6
            ).map(({ vendor, estimatedTotal, fitScore, necessityName }) => {
              const nec = necessities.find(
                (n) => n.name === necessityName
              );
              const necId = nec?.id ?? "";
              return (
                <button key={vendor.id} id={`vendor-recs-card-${vendor.id}`} onClick={() =>
                  setQuickAddVendor({ vendor, necessityId: necId, necessityName })
                }
                  className="bg-cream rounded-xl p-4 border border-gold/20 hover:shadow-md hover:border-orange/40 hover:bg-cream/80 transition-all text-left cursor-pointer group">
                  <div id={`vendor-recs-card-header-${vendor.id}`} className="flex items-center justify-between mb-2">
                    <span id={`vendor-recs-necessity-${vendor.id}`} className="text-xs font-medium text-amber-800/50 uppercase tracking-wide">{necessityName}</span>
                    {fitScore >= 80 && (
                      <span id={`vendor-recs-badge-${vendor.id}`} className="text-[10px] bg-green/10 text-green px-2 py-0.5 rounded-full font-bold">Best Match</span>
                    )}
                  </div>
                  <p id={`vendor-recs-name-${vendor.id}`} className="text-sm font-semibold text-amber-900 truncate">{vendor.name}</p>
                  <div id={`vendor-recs-budget-${vendor.id}`} className="flex items-center gap-3 mt-2 text-xs text-amber-800/60">
                    <span id={`vendor-recs-budget-val-${vendor.id}`}>Budget: Rp {(vendor.budget / 1000000).toFixed(0)}jt</span>
                    {vendor.perPerson && (
                      <span id={`vendor-recs-perperson-${vendor.id}`}>Rp {vendor.perPerson.toLocaleString()}/org</span>
                    )}
                  </div>
                  <div id={`vendor-recs-fit-${vendor.id}`} className="mt-2 flex items-center gap-2">
                    <div id={`vendor-recs-fit-bar-${vendor.id}`} className="flex-1 h-1.5 rounded-full bg-cream overflow-hidden">
                      <div id={`vendor-recs-fit-fill-${vendor.id}`} className={`h-full rounded-full ${
                        fitScore >= 80 ? "bg-green" : fitScore >= 50 ? "bg-gold" : "bg-pink/50"
                      }`} style={{ width: `${fitScore}%` }} />
                    </div>
                    <span id={`vendor-recs-fit-pct-${vendor.id}`} className="text-[10px] font-medium text-amber-800/50">{fitScore}%</span>
                  </div>
                  <p id={`vendor-recs-estimate-${vendor.id}`} className="text-[10px] text-amber-800/40 mt-1.5">
                    Estimasi: Rp {estimatedTotal.toLocaleString()}
                  </p>
                  <div id={`vendor-recs-add-${vendor.id}`} className="mt-3 pt-2 border-t border-gold/10 text-[10px] text-orange font-medium flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Icon name="add_circle" size={12} />
                    Tambah ke {necessityName}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {necessities.some((n) => n.vendors.length > 0) && !showVendorRecs && (
        <button id="vendor-recs-collapsed" onClick={() => setShowVendorRecs(true)}
          className="relative overflow-hidden w-full rounded-2xl bg-amber-50 border-2 border-dashed border-orange/40 p-4 hover:border-orange/60 hover:bg-amber-50/80 hover:shadow-md transition-all group cursor-pointer">
          <div id="vendor-recs-collapsed-inner" className="flex items-center gap-3">
            <div id="vendor-recs-collapsed-icon" className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange to-gold flex items-center justify-center shadow-sm">
              <Icon name="auto_awesome" size={20} className="text-white" filled />
            </div>
            <div id="vendor-recs-collapsed-text" className="flex-1 text-left">
              <p id="vendor-recs-collapsed-title" className="text-sm font-semibold text-amber-900">Rekomendasi Vendor Terbaik</p>
              <p id="vendor-recs-collapsed-subtitle" className="text-xs text-amber-800/50">Berdasarkan budget dan jumlah tamu — klik untuk buka</p>
            </div>
            <Icon name="add_circle" size={20} className="text-orange/50 group-hover:text-orange transition-colors" />
          </div>
        </button>
      )}

      {/* Before You Marry Widget */}
      {showBeforeMarry && (
        <div id="before-you-marry-expanded" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink/10 via-gold/10 to-orange/5 border-2 border-pink/20 shadow-sm">
          <div id="before-you-marry-bg-pattern" className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 10% 90%, #FC95B4 1px, transparent 1px),
                                radial-gradient(circle at 90% 10%, #FFCE62 1px, transparent 1px),
                                radial-gradient(circle at 50% 50%, #EB7B26 1px, transparent 1px)`,
              backgroundSize: '30px 30px, 40px 40px, 20px 20px',
            }}
          />
          <div id="before-you-marry-inner" className="relative px-5 sm:px-6 py-4 sm:py-5">
            <div id="before-you-marry-hero" className="flex items-start gap-4">
              <div id="before-you-marry-icon" className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink to-orange flex items-center justify-center shadow-md shrink-0 animate-bounce">
                <Icon name="diamond" size={24} className="text-white" filled />
              </div>
              <div id="before-you-marry-text" className="flex-1 min-w-0">
                <div id="before-you-marry-title-wrap" className="flex items-center gap-2">
                  <Tooltip content="Informasi penting yang wajib diketahui sebelum menikah"><h2 id="before-you-marry-title" className="text-lg font-bold text-amber-900">Before You Marry</h2></Tooltip>
                  <span id="before-you-marry-badge" className="text-xs bg-gradient-to-r from-pink/20 to-orange/20 text-pink px-2.5 py-0.5 rounded-full font-medium">Wajib Tahu!</span>
                </div>
                <p id="before-you-marry-subtitle" className="text-sm text-amber-800/60 mt-1">
                  Hal-hal penting yang wajib diketahui sebelum menikah di Indonesia
                </p>
              </div>
            </div>

            <div id="before-you-marry-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                {
                  icon: "description",
                  title: "Persyaratan Administrasi",
                  desc: "KTP, KK, Akta Kelahiran, Surat Nikah dari KUA, dan surat pengantar dari kelurahan/desa",
                },
                {
                  icon: "account_balance",
                  title: "Pendaftaran KUA",
                  desc: "Daftar minimal 10 hari kerja sebelum akad. Bawa dokumen asli + fotokopi ke KUA kecamatan setempat",
                },
                {
                  icon: "payments",
                  title: "Biaya Nikah",
                  desc: "Pencatatan nikah di KUA gratis (Rp 0). Untuk akad di luar KUA ada biaya hingga Rp 600rb tergantung kebijakan",
                },
                {
                  icon: "menu_book",
                  title: "Kursus Pranikah",
                  desc: "Sertifikat kursus pranikah (BP4) kini wajib sebagai syarat pendaftaran pernikahan di KUA",
                },
                {
                  icon: "church",
                  title: "Rukun Nikah",
                  desc: "Calon suami, calon istri, wali nikah, dua saksi laki-laki, dan ijab kabul (sighat)",
                },
                {
                  icon: "note_add",
                  title: "Dokumen Tambahan",
                  desc: "Pas foto 2x3 & 3x4 (masing-masing 6 lembar), NPWP (jika ada), akta cerai/akta kematian bila perlu",
                },
              ].map((item, i) => (
                <div key={i} id={`before-you-marry-item-${i}`}
                  className="flex gap-3 p-3 rounded-xl bg-white/60 border border-gold/20 hover:bg-white/90 transition-colors">
                  <Icon name={item.icon} size={22} className="text-amber-800/60 shrink-0 mt-0.5" />
                  <div id={`before-you-marry-item-text-${i}`}>
                    <p id={`before-you-marry-item-title-${i}`} className="text-sm font-semibold text-amber-900">{item.title}</p>
                    <p id={`before-you-marry-item-desc-${i}`} className="text-xs text-amber-800/60 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div id="before-you-marry-footer" className="mt-4 pt-3 border-t border-gold/20 flex items-center justify-between">
              <p id="before-you-marry-source" className="text-[10px] text-amber-800/40">Sumber: Kementerian Agama RI</p>
              <button id="before-you-marry-close-btn" onClick={() => setShowBeforeMarry(false)}
                className="flex items-center gap-1 text-xs text-orange font-medium hover:underline cursor-pointer">
                Tutup
                <Icon name="close" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
      {!showBeforeMarry && (
        <button id="before-you-marry-collapsed" onClick={() => setShowBeforeMarry(true)}
          className="relative overflow-hidden w-full rounded-2xl bg-pink/15 border-2 border-dashed border-pink/40 p-4 hover:border-pink/60 hover:bg-pink/20 hover:shadow-md transition-all group cursor-pointer">
          <div id="before-you-marry-collapsed-inner" className="flex items-center gap-3">
            <div id="before-you-marry-collapsed-icon" className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink to-orange flex items-center justify-center shadow-sm">
                <Icon name="diamond" size={20} className="text-white" filled />
            </div>
            <div id="before-you-marry-collapsed-text" className="flex-1 text-left">
              <p id="before-you-marry-collapsed-title" className="text-sm font-semibold text-amber-900">Before You Marry</p>
              <p id="before-you-marry-collapsed-subtitle" className="text-xs text-amber-800/50">Hal wajib tahu sebelum menikah — klik untuk buka</p>
            </div>
            <Icon name="add_circle" size={20} className="text-pink/50 group-hover:text-pink transition-colors" />
          </div>
        </button>
      )}

      {/* Quick-add vendor modal */}
      {quickAddVendor && (
        <div id="quick-add-vendor-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div id="quick-add-vendor-card" className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
            <div id="quick-add-vendor-header" className="flex items-center gap-3 mb-4">
              <div id="quick-add-vendor-icon" className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center">
                <Icon name="business" size={20} className="text-green" filled />
              </div>
              <div id="quick-add-vendor-title-wrap">
                <Tooltip content="Tambahkan vendor rekomendasi ke daftar draft"><h3 id="quick-add-vendor-title" className="text-base font-bold text-amber-900">Tambah Vendor</h3></Tooltip>
                <p id="quick-add-vendor-subtitle" className="text-xs text-amber-800/50">Rekomendasi sistem</p>
              </div>
            </div>
            <p id="quick-add-vendor-body" className="text-sm text-amber-900 mb-1">
              Tambah <span id="quick-add-vendor-name" className="font-semibold">{quickAddVendor.vendor.name}</span>
            </p>
            <p id="quick-add-vendor-desc" className="text-xs text-amber-800/50 mb-5">
              ke <span id="quick-add-vendor-necessity" className="font-medium">{quickAddVendor.necessityName}</span> sebagai draft vendor?
            </p>
            <div id="quick-add-vendor-actions" className="flex items-center gap-3">
              <button id="quick-add-vendor-cancel-btn" onClick={() => setQuickAddVendor(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gold/30 text-sm text-amber-800/60 font-medium hover:bg-cream transition-colors cursor-pointer">
                Batal
              </button>
              <button id="quick-add-vendor-confirm-btn" onClick={handleQuickAddVendor}
                className="flex-1 px-4 py-2.5 rounded-xl bg-orange text-white text-sm font-medium hover:bg-orange/90 transition-colors cursor-pointer">
                Tambahkan
              </button>
            </div>
          </div>
        </div>
      )}

      {showInfoForm && (
        <WeddingInfoModal
          info={{
            brideName: weddingInfo.brideName,
            groomName: weddingInfo.groomName,
            weddingDate: weddingInfo.weddingDate,
            location: weddingInfo.location,
            guestCount: weddingInfo.guestCount,
            budget: weddingInfo.budget,
          }}
          onSave={(data) => {
            setWeddingInfo({
              ...weddingInfo,
              brideName: data.brideName,
              groomName: data.groomName,
              weddingDate: data.weddingDate,
              location: data.location,
              guestCount: data.guestCount,
              budget: data.budget,
            });
            setShowInfoForm(false);
          }}
          onClose={() => setShowInfoForm(false)}
        />
      )}
    </div>
  );
}
