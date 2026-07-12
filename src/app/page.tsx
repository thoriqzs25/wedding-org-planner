"use client";

import { useState } from "react";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import Icon from "@/components/Icon";
import {
  mockQuestionnaire,
  mockNecessities,
  mockRecentActivities,
  getTotalBudget,
  getTotalSpent,
} from "@/data/mock";
import { Todo } from "@/types";

export default function DashboardPage() {
  const [necessities, setNecessities] = useState(mockNecessities);

  const allTodos = necessities.flatMap((n) =>
    n.todos.map((t) => ({ ...t, necessityName: n.name }))
  );
  const totalTodos = allTodos.length;
  const doneTodos = allTodos.filter((t) => t.status === "done").length;
  const totalBudget = getTotalBudget();
  const totalSpent = getTotalSpent();
  const today = new Date();

  const overdueTodos = allTodos.filter(
    (t) => t.status !== "done" && new Date(t.dueDate) < today
  );

  const needsVendor = necessities.filter((n) => n.vendors.length === 0);

  const checklistedNec = necessities.filter(
    (n) => n.todos.length > 0 && n.todos.every((t) => t.status === "done")
  ).length;

  const daysToWedding = Math.ceil(
    (new Date(mockQuestionnaire.weddingDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const cycleStatus = (todoId: string) => {
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
  };

  const getDaysOverdue = (dueDate: string) => {
    const diff = today.getTime() - new Date(dueDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-amber-900">
          Hai, {mockQuestionnaire.brideName} & {mockQuestionnaire.groomName}!{" "}
          <Icon name="waving_hand" size={24} className="inline" />
        </h1>
        <p className="text-amber-800/60">
          {mockQuestionnaire.weddingDate} • {mockQuestionnaire.location}
        </p>
      </div>

      {/* Progress bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <ProgressBar
            value={totalSpent}
            max={totalBudget}
            label="Budget"
            color="bg-orange"
            showWarning={totalSpent > totalBudget * 0.8}
          />
        </div>
        <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <ProgressBar
            value={checklistedNec}
            max={necessities.length}
            label="Ceklis Kebutuhan"
            color="bg-green"
            showWarning={overdueTodos.length > 0}
          />
        </div>
        <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <div className="flex items-center gap-3 h-full">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              daysToWedding <= 30 ? "bg-pink/10" : daysToWedding <= 90 ? "bg-gold/20" : "bg-green/10"
            }`}>
              <Icon name="event" size={24} className={`${
                daysToWedding <= 30 ? "text-pink" : daysToWedding <= 90 ? "text-gold" : "text-green"
              }`} />
            </div>
            <div>
              <p className="text-xs text-amber-800/60">Hari Menuju Acara</p>
              <p className={`text-2xl font-bold ${
                daysToWedding <= 30 ? "text-pink" : daysToWedding <= 90 ? "text-gold" : "text-amber-900"
              }`}>
                {daysToWedding}
                <span className="text-sm font-normal text-amber-800/40 ml-1">hari</span>
              </p>
              <p className="text-[10px] text-amber-800/40">
                {new Date(mockQuestionnaire.weddingDate).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs vendor list */}
        <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
            <Icon name="storefront" size={20} />
            Butuh Vendor
          </h2>
          {needsVendor.length === 0 ? (
            <div className="text-center py-8 text-amber-800/40">
              <Icon name="celebration" size={36} className="mb-2" />
              <p className="text-sm">Semua kebutuhan sudah punya vendor!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {needsVendor.map((n) => (
                <Link
                  key={n.id}
                  href={`/necessity/${n.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-cream transition-colors group"
                >
                  <span className="text-sm font-medium text-amber-900">
                    {n.name}
                  </span>
                  <span className="text-xs text-pink group-hover:underline flex items-center gap-1">
                    Cari vendor
                    <Icon name="arrow_forward" size={14} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-gold/30 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
            <Icon name="edit_note" size={20} />
            Aktivitas Terakhir
          </h2>
          <div className="space-y-3">
            {mockRecentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-orange/60 shrink-0" />
                <div>
                  <p className="text-sm text-amber-900">{activity.action}</p>
                  <p className="text-xs text-amber-800/40">
                    {activity.necessityName} •{" "}
                    {new Date(activity.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overdue warning - redesigned */}
      {overdueTodos.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-pink/40 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-pink/10 to-pink/5 px-6 py-4 border-b border-pink/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink/20 flex items-center justify-center">
                <Icon name="warning" size={22} className="text-pink" filled />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-pink">
                  Todo Terlewat
                </h2>
                <p className="text-xs text-amber-800/50">
                  {overdueTodos.length} item perlu segera diselesaikan
                </p>
              </div>
            </div>
            <span className="text-3xl font-bold text-pink/30">
              {overdueTodos.length}
            </span>
          </div>

          <div className="divide-y divide-pink/10">
            {overdueTodos.map((todo) => {
              const daysOverdue = getDaysOverdue(todo.dueDate);
              return (
                <div
                  key={todo.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-pink/[0.02] transition-colors group"
                >
                  <button
                    onClick={() => cycleStatus(todo.id)}
                    className="w-6 h-6 rounded-full border-2 border-pink/50 flex items-center justify-center shrink-0 hover:bg-pink/10 transition-all active:scale-90"
                  >
                    <Icon
                      name="check"
                      size={14}
                      className="text-pink opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-amber-900">
                      {todo.title}
                    </p>
                    <p className="text-xs text-amber-800/50">
                      {(todo as Todo & { necessityName: string }).necessityName}{" "}
                      • PIC: {todo.pic}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Icon name="schedule" size={14} className="text-pink" />
                      <span className="text-xs font-semibold text-pink">
                        {daysOverdue === 0
                          ? "Hari ini"
                          : `${daysOverdue} hari terlewat`}
                      </span>
                    </div>
                    <p className="text-[10px] text-amber-800/40 mt-0.5">
                      Deadline:{" "}
                      {new Date(todo.dueDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
