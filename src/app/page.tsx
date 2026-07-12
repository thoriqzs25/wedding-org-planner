"use client";

import { useState } from "react";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import Icon from "@/components/Icon";
import {
  mockQuestionnaire,
  mockNecessities,
  getTotalSpent,
} from "@/data/mock";
import { getNecessityIcon, getNecessityColor } from "@/data/necessityIcons";
import { Todo } from "@/types";
import Tooltip from "@/components/Tooltip";
import WeddingInfoModal from "@/components/WeddingInfoModal";
import { getTopRecommendations } from "@/utils/recommendations";

interface TodoActivity {
  id: string;
  necessityId: string;
  necessityName: string;
  todoId: string;
  todoTitle: string;
  newStatus: Todo["status"];
  createdAt: string;
}

export default function DashboardPage() {
  const [necessities, setNecessities] = useState(mockNecessities);
  const [weddingInfo, setWeddingInfo] = useState(mockQuestionnaire);
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [infoTab, setInfoTab] = useState<"acara" | "budget">("acara");
  const [showBeforeMarry, setShowBeforeMarry] = useState(true);
  const [activities, setActivities] = useState<TodoActivity[]>(() =>
    mockNecessities.flatMap((n) =>
      n.todos
        .filter((t) => t.status !== "pending")
        .sort((a, b) => b.dueDate.localeCompare(a.dueDate))
        .map((t) => ({
          id: `init-${t.id}`,
          necessityId: n.id,
          necessityName: n.name,
          todoId: t.id,
          todoTitle: t.title,
          newStatus: t.status as Todo["status"],
          createdAt: new Date(t.dueDate).toISOString(),
        }))
    ).slice(0, 10)
  );

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
          const updated = { ...t, status: nextStatus[t.status] };
          setActivities((a) => [
            {
              id: `act-${Date.now()}`,
              necessityId: n.id,
              necessityName: n.name,
              todoId: updated.id,
              todoTitle: updated.title,
              newStatus: updated.status,
              createdAt: new Date().toISOString(),
            },
            ...a,
          ]);
          return updated;
        }),
      }));
      return next;
    });
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

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-amber-900">
            Hai, {weddingInfo.brideName} & {weddingInfo.groomName}!{" "}
            <Icon name="waving_hand" size={24} className="inline" />
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-amber-800/60">
              {weddingInfo.weddingDate} • {weddingInfo.location}
            </p>
            <button onClick={() => { setInfoTab("acara"); setShowInfoForm(true); }}
              className="text-amber-800/30 hover:text-orange transition-colors" title="Edit tanggal & lokasi">
              <Icon name="edit" size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Full-width countdown banner */}
      <div className={`relative overflow-hidden rounded-2xl shadow-sm ${
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
        <div className="relative px-5 sm:px-8 py-5 sm:py-6 flex items-center gap-4 sm:gap-8">
          <div className="relative shrink-0">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#FFFAE5" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="15.5" fill="none"
                  stroke={warnThreshold.time ? "#FC95B4" : "#EB7B26"}
                  strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={`${timeProgress} ${100 - timeProgress}`}
                  className="transition-all duration-700" />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${
                warnThreshold.time ? "text-pink" : "text-orange"
              }`}>
                {daysToWedding}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold tracking-wide uppercase mb-1 ${
              warnThreshold.time ? "text-pink" : "text-amber-800/50"
            }`}>Countdown</p>
            <p className={`text-2xl sm:text-5xl font-bold leading-none tracking-tight ${
              warnThreshold.time ? "text-pink" : "text-amber-900"
            }`}>
              {daysToWedding}
              <span className={`text-sm sm:text-xl font-normal ml-2 ${
                warnThreshold.time ? "text-pink/60" : "text-amber-800/50"
              }`}>days to go</span>
            </p>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-sm text-amber-800/60">
                {weddingDate.toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
              <span className="text-amber-800/20">•</span>
              <p className="text-sm text-amber-800/50">{timeProgress}% journey</p>
            </div>
            <div className="mt-3 max-w-md">
              <div className="h-2 rounded-full bg-cream overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${
                  warnThreshold.time ? "bg-pink" : "bg-orange/60"
                }`} style={{ width: `${timeProgress}%` }} />
              </div>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-center gap-1 shrink-0">
            <Icon name={warnThreshold.time ? "emergency" : "celebration"} size={32}
              className={warnThreshold.time ? "text-pink" : "text-gold"} filled />
            {!warnThreshold.time && (
              <span className="text-[10px] text-amber-800/40 font-medium uppercase tracking-wide">
                {daysToWedding <= 90 ? "Soon!" : "Excited?"}
              </span>
            )}
          </div>
        </div>

        {warnThreshold.time && (
          <div className="relative px-5 sm:px-8 py-2 bg-pink/5 border-t border-pink/20 flex items-center gap-2">
            <Icon name="warning" size={14} className="text-pink" filled />
            <p className="text-xs text-pink font-medium">Less than 30 days to go — time to finalize everything!</p>
          </div>
        )}
      </div>

      {/* Progress card */}
      <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#FFFAE5" strokeWidth="2.5" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#EB7B26" strokeWidth="2.5"
                strokeDasharray={`${overallPct} ${100 - overallPct}`}
                strokeLinecap="round" className="transition-all duration-700" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-orange">
              {overallPct}%
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-amber-900">Progress Pernikahan</h2>
            <p className="text-xs text-amber-800/50">
              {doneTodos} dari {totalTodos} to-do selesai
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-cream/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="account_balance_wallet" size={16} className={warnThreshold.budget ? "text-pink" : "text-orange"} />
              <span className="text-xs font-medium text-amber-900/70">Budget</span>
              {warnThreshold.budget && <Tooltip content="Budget sudah terpakai lebih dari 80%"><Icon name="warning" size={12} className="text-pink" filled /></Tooltip>}
              <button onClick={() => { setInfoTab("budget"); setShowInfoForm(true); }}
                className="ml-auto text-amber-800/30 hover:text-orange transition-colors" title="Edit budget">
                <Icon name="edit" size={12} />
              </button>
            </div>
            <ProgressBar value={totalSpent} max={totalBudget} label="" color="bg-orange" showWarning={false} />
            <div className="flex justify-between text-[11px] text-amber-800/50 mt-1.5">
              <span>Rp {totalSpent.toLocaleString()}</span>
              <span>Rp {totalBudget.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-cream/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="checklist" size={16} className="text-green" />
              <span className="text-xs font-medium text-amber-900/70">Ceklis Kebutuhan</span>
            </div>
            <ProgressBar value={checklistedNec} max={necessities.length} label="" color="bg-green" showWarning={false} />
            <div className="flex justify-between text-[11px] text-amber-800/50 mt-1.5">
              <span>{checklistedNec} kebutuhan</span>
              <span>{necessities.length} total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Masih perlu dicari — grid of stickers */}
        <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
              <Icon name="storefront" size={20} />
              Masih perlu dicari
            </h2>
            {needsVendor.length > 0 && (
              <span className="text-xs bg-pink/10 text-pink px-2.5 py-1 rounded-full font-medium">
                {needsVendor.length} perlu vendor
              </span>
            )}
          </div>
          {needsVendor.length === 0 ? (
            <div className="text-center py-8 text-amber-800/40">
              <Icon name="celebration" size={36} className="mb-2" />
              <p className="text-sm">Semua kebutuhan sudah punya vendor!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {needsVendor.map((n) => {
                const c = getNecessityColor(n.id, n.color);
                return (
                  <Link key={n.id} href={`/necessity/${n.id}`}
                    className={`${c.bg} ${c.border} border rounded-xl p-4 hover:shadow-md transition-all group`}>
                    <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                      <Icon name={getNecessityIcon(n.id, n.icon)} size={20} className={c.text} />
                    </div>
                    <p className={`text-sm font-semibold ${c.text} mb-1 truncate`}>{n.name}</p>
                    <span className={`text-[10px] ${c.text}/60 flex items-center gap-0.5 group-hover:underline`}>
                      Cari vendor <Icon name="arrow_forward" size={10} />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent activity - timeline style */}
        <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
              <Icon name="edit_note" size={20} />
              Aktivitas Terakhir
            </h2>
            {activities.length > 0 && (
              <Link href="/necessity" className="text-xs text-orange font-medium hover:underline">
                Lihat semua
              </Link>
            )}
          </div>
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gold/30" />
            <div className="space-y-0">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-amber-800/40">
                  <Icon name="edit_note" size={32} className="mb-2 text-amber-800/20" />
                  <p className="text-sm">Belum ada aktivitas</p>
                  <Link href="/necessity" className="text-xs text-orange font-medium hover:underline mt-1 inline-block">
                    Ubah status to-do untuk memulai
                  </Link>
                </div>
              ) : (
                activities.slice(0, 5).map((act, idx) => {
                  const isLast = idx === Math.min(activities.length, 5) - 1;
                  const dotColor = act.newStatus === "done" ? "bg-green" : act.newStatus === "in_progress" ? "bg-gold" : "bg-amber-800/30";
                  const statusLabel = act.newStatus === "done" ? "Selesai" : act.newStatus === "in_progress" ? "Diproses" : "Pending";
                  const ago = getRelativeTime(act.createdAt);
                  return (
                    <Link key={act.id} href={`/necessity/${act.necessityId}`}
                      className={`flex gap-4 group ${isLast ? "" : "pb-4"} block`}>
                      <div className="relative z-10 mt-1">
                        <div className={`w-[15px] h-[15px] rounded-full ${dotColor} border-[3px] border-white shadow-sm`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-amber-900">
                          <span className="group-hover:text-orange transition-colors">{act.todoTitle}</span>
                        </p>
                        <p className="text-[11px] text-amber-800/50 mt-0.5">
                          Status: <span className="font-medium">{statusLabel}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            act.newStatus === "done" ? "bg-green/10 text-green" : act.newStatus === "in_progress" ? "bg-gold/20 text-amber-800" : "bg-cream text-amber-800/50"
                          }`}>
                            {statusLabel}
                          </span>
                          <span className="text-[11px] text-amber-800/40">{act.necessityName}</span>
                          <span className="text-[11px] text-amber-800/30">{ago}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overdue warning */}
      {overdueTodos.length > 0 && (
        <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-pink/50 bg-white">
          {/* Header banner */}
          <div className="bg-gradient-to-r from-pink to-pink/80 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                <Icon name="warning" size={24} className="text-white" filled />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white drop-shadow-sm">Todo Terlewat</h2>
                <p className="text-xs text-white/80">
                  {overdueTodos.length} item perlu segera ditindaklanjuti
                </p>
              </div>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-bold text-white">{overdueTodos.length}</p>
              <p className="text-[10px] text-white/70">item</p>
            </div>
          </div>

          {/* Items */}
          <div className="divide-y divide-pink/10">
            {overdueTodos.map((todo, idx) => {
              const daysOverdue = getDaysOverdue(todo.dueDate);
              const urgency = daysOverdue >= 7 ? "high" : daysOverdue >= 3 ? "medium" : "low";
              return (
                <div key={todo.id}
                  className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 transition-colors ${
                    urgency === "high" ? "bg-pink/[0.03]" : "hover:bg-pink/[0.02]"
                  }`}>
                  {/* Check button */}
                  <Tooltip content="Klik untuk tandai selesai">
                    <button onClick={() => cycleStatus(todo.id)}
                      className="flex items-center justify-center w-11 h-11 rounded-xl border-2 border-pink/40 shrink-0 hover:bg-pink hover:border-pink hover:text-white transition-all active:scale-90 group">
                      <Icon name="check" size={16} className="text-pink/50 group-hover:text-white transition-colors" />
                    </button>
                  </Tooltip>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-amber-900">{todo.title}</p>
                      {urgency === "high" && (
                        <span className="text-[9px] bg-pink/15 text-pink px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Urgent</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-amber-800/50">{(todo as Todo & { necessityName: string }).necessityName}</span>
                      <span className="text-[10px] text-amber-800/30">•</span>
                      <span className="text-xs text-amber-800/50">PIC: {todo.pic}</span>
                    </div>
                  </div>

                  {/* Overdue badge */}
                  <div className={`shrink-0 text-right ${
                    urgency === "high" ? "bg-pink/10 px-3 py-2 rounded-xl" : ""
                  }`}>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Icon name="schedule" size={14}
                        className={urgency === "high" ? "text-pink" : urgency === "medium" ? "text-gold" : "text-amber-800/40"} />
                      <span className={`text-xs font-bold ${
                        urgency === "high" ? "text-pink" : urgency === "medium" ? "text-gold" : "text-amber-800/50"
                      }`}>
                        {daysOverdue === 0 ? "Hari ini" : `${daysOverdue}h`}
                      </span>
                    </div>
                    <p className="text-[10px] text-amber-800/35 mt-0.5">
                      {new Date(todo.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="bg-pink/[0.02] px-6 py-3 border-t border-pink/10">
            <Link href="/necessity" className="text-xs text-pink font-medium hover:underline flex items-center gap-1">
              <Icon name="arrow_forward" size={12} />
              Lihat semua kebutuhan
            </Link>
          </div>
        </div>
      )}

      {/* Vendor Recommendations */}
      {necessities.some((n) => n.vendors.length > 0) && (
        <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="auto_awesome" size={20} className="text-orange" filled />
            <h2 className="text-lg font-semibold text-amber-900">Rekomendasi Vendor Terbaik</h2>
            <span className="text-xs bg-orange/10 text-orange px-2 py-0.5 rounded-full font-medium">
              {weddingInfo.guestCount} tamu
            </span>
          </div>
          <p className="text-xs text-amber-800/50 mb-4">
            Berdasarkan jumlah tamu ({weddingInfo.guestCount} orang) dan total budget (Rp {weddingInfo.budget.toLocaleString()})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getTopRecommendations(
              necessities.flatMap((n) =>
                n.vendors.map((v) => ({ vendor: v, necessityName: n.name }))
              ),
              weddingInfo.guestCount,
              weddingInfo.budget,
              6
            ).map(({ vendor, estimatedTotal, fitScore, necessityName }) => (
              <div key={vendor.id}
                className="bg-cream/50 rounded-xl p-4 border border-gold/20 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-amber-800/50 uppercase tracking-wide">{necessityName}</span>
                  {fitScore >= 80 && (
                    <span className="text-[10px] bg-green/10 text-green px-2 py-0.5 rounded-full font-bold">Best Match</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-amber-900 truncate">{vendor.name}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-amber-800/60">
                  <span>Budget: Rp {(vendor.budget / 1000000).toFixed(0)}jt</span>
                  {vendor.perPerson && (
                    <span>Rp {vendor.perPerson.toLocaleString()}/org</span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-cream overflow-hidden">
                    <div className={`h-full rounded-full ${
                      fitScore >= 80 ? "bg-green" : fitScore >= 50 ? "bg-gold" : "bg-pink/50"
                    }`} style={{ width: `${fitScore}%` }} />
                  </div>
                  <span className="text-[10px] font-medium text-amber-800/50">{fitScore}%</span>
                </div>
                <p className="text-[10px] text-amber-800/40 mt-1.5">
                  Estimasi: Rp {estimatedTotal.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Before You Marry Widget */}
      {showBeforeMarry && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink/10 via-gold/10 to-orange/5 border-2 border-pink/20 shadow-sm">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 10% 90%, #FC95B4 1px, transparent 1px),
                                radial-gradient(circle at 90% 10%, #FFCE62 1px, transparent 1px),
                                radial-gradient(circle at 50% 50%, #EB7B26 1px, transparent 1px)`,
              backgroundSize: '30px 30px, 40px 40px, 20px 20px',
            }}
          />
          <div className="relative px-5 sm:px-6 py-4 sm:py-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink to-orange flex items-center justify-center shadow-md shrink-0 animate-bounce">
                <span className="text-2xl">💍</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-amber-900">Before You Marry</h2>
                  <span className="text-xs bg-gradient-to-r from-pink/20 to-orange/20 text-pink px-2.5 py-0.5 rounded-full font-medium">Wajib Tahu!</span>
                </div>
                <p className="text-sm text-amber-800/60 mt-1">
                  Hal-hal penting yang wajib diketahui sebelum menikah di Indonesia
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                {
                  icon: "📋",
                  title: "Persyaratan Administrasi",
                  desc: "KTP, KK, Akta Kelahiran, Surat Nikah dari KUA, dan surat pengantar dari kelurahan/desa",
                },
                {
                  icon: "🏛️",
                  title: "Pendaftaran KUA",
                  desc: "Daftar minimal 10 hari kerja sebelum akad. Bawa dokumen asli + fotokopi ke KUA kecamatan setempat",
                },
                {
                  icon: "💰",
                  title: "Biaya Nikah",
                  desc: "Pencatatan nikah di KUA gratis (Rp 0). Untuk akad di luar KUA ada biaya hingga Rp 600rb tergantung kebijakan",
                },
                {
                  icon: "📖",
                  title: "Kursus Pranikah",
                  desc: "Sertifikat kursus pranikah (BP4) kini wajib sebagai syarat pendaftaran pernikahan di KUA",
                },
                {
                  icon: "🕌",
                  title: "Rukun Nikah",
                  desc: "Calon suami, calon istri, wali nikah, dua saksi laki-laki, dan ijab kabul (sighat)",
                },
                {
                  icon: "📝",
                  title: "Dokumen Tambahan",
                  desc: "Pas foto 2x3 & 3x4 (masing-masing 6 lembar), NPWP (jika ada), akta cerai/akta kematian bila perlu",
                },
              ].map((item, i) => (
                <div key={i}
                  className="flex gap-3 p-3 rounded-xl bg-white/60 border border-gold/20 hover:bg-white/90 transition-colors">
                  <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-amber-900">{item.title}</p>
                    <p className="text-xs text-amber-800/60 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gold/20 flex items-center justify-between">
              <p className="text-[10px] text-amber-800/40">Sumber: Kementerian Agama RI</p>
              <button onClick={() => setShowBeforeMarry(false)}
                className="flex items-center gap-1 text-xs text-orange font-medium hover:underline">
                Tutup
                <Icon name="close" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
      {!showBeforeMarry && (
        <button onClick={() => setShowBeforeMarry(true)}
          className="relative overflow-hidden w-full rounded-2xl bg-gradient-to-r from-pink/10 via-gold/10 to-orange/5 border-2 border-dashed border-pink/30 p-4 hover:border-pink/60 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink to-orange flex items-center justify-center shadow-sm">
              <span className="text-xl">💍</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-amber-900">Before You Marry</p>
              <p className="text-xs text-amber-800/50">Hal wajib tahu sebelum menikah — klik untuk buka</p>
            </div>
            <Icon name="add_circle" size={20} className="text-pink/50 group-hover:text-pink transition-colors" />
          </div>
        </button>
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
