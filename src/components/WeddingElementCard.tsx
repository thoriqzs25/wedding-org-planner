"use client";

import Link from "next/link";
import { WeddingElement } from "@/types";
import { getWeddingElementIcon, getWeddingElementColor } from "@/data/weddingElementIcons";
import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";

interface WeddingElementCardProps {
  nec: WeddingElement;
  onDelete: (id: string) => void;
}

export default function WeddingElementCard({ nec, onDelete }: WeddingElementCardProps) {
  const today = new Date();

  const todoDone = nec.todos.filter((t) => t.status === "done").length;
  const todoTotal = nec.todos.length;
  const pct = todoTotal > 0 ? Math.round((todoDone / todoTotal) * 100) : 0;
  const hasOverdue = nec.todos.some(
    (t) => t.status !== "done" && new Date(t.dueDate) < today
  );
  const allDone = todoTotal > 0 && todoDone === todoTotal;
  const c = getWeddingElementColor(nec.id, nec.color);

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
    <div id={`card-${nec.id}`} className="relative group h-full">
      <Link id={`card-${nec.id}-link`} href={`/wedding-elements/${nec.id}`}
        className={`flex flex-col rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 h-full ${
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
            <Icon name={getWeddingElementIcon(nec.id, nec.icon)} size={24}
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
              <h3 id={`card-${nec.id}-name`} className={`text-sm font-bold truncate ${
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

        <div id={`card-${nec.id}-progress-section`} className="mb-4">
          <div id={`card-${nec.id}-progress-row`} className="flex items-center gap-3 mb-1.5">
            <div id={`card-${nec.id}-progress-track`} className={`flex-1 h-2 rounded-full overflow-hidden ${
              todoTotal > 0 ? "bg-cream" : "bg-cream/50"
            }`}>
              {todoTotal > 0 && (
                <div id={`card-${nec.id}-progress-fill`} className={`h-full rounded-full transition-all duration-500 ${
                  allDone ? "bg-green" : hasOverdue ? "bg-red" : "bg-orange"
                }`} style={{ width: `${pct}%` }} />
              )}
            </div>
            <span id={`card-${nec.id}-progress-text`} className={`text-xs font-semibold ${
              todoTotal > 0
                ? allDone ? "text-green" : hasOverdue ? "text-red" : "text-orange"
                : "text-amber-800/20"
            }`}>
              {todoTotal > 0 ? `${pct}%` : "—"}
            </span>
          </div>
        </div>

        <div id={`card-${nec.id}-footer`} className="flex items-center gap-3 text-[11px] text-amber-800/50 flex-wrap mt-auto">
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
            <span id={`card-${nec.id}-upcoming-todo`} className="flex items-center gap-1 ml-auto text-[10px] max-w-[140px] truncate">
              <Icon name="flag" size={10} />
              {upcomingTodo.title.length > 12 ? upcomingTodo.title.slice(0, 12) + "…" : upcomingTodo.title}
            </span>
          )}
        </div>
      </Link>

      <button id={`card-${nec.id}-delete-button`} onClick={() => onDelete(nec.id)}
        className="absolute top-3 right-3 flex items-center justify-center w-11 h-11 rounded-xl text-amber-800/30 hover:text-red hover:bg-red/10 transition-colors active:scale-90 cursor-pointer">
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
