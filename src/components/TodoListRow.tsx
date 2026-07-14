"use client";

import Link from "next/link";
import { Todo } from "@/types";
import { statusConfig, statusOptions } from "@/constants/todo";
import Icon from "@/components/Icon";

interface TodoListRowProps {
  todo: Todo & { weddingElementId: string; weddingElementName: string };
  onStatusChange: (todoId: string, newStatus: Todo["status"]) => void;
}

export default function TodoListRow({ todo, onStatusChange }: TodoListRowProps) {
  const today = new Date();
  const isOverdue = todo.status !== "done" && new Date(todo.dueDate) < today;
  const isDone = todo.status === "done";
  const daysLeft = Math.ceil(
    (new Date(todo.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const config = statusConfig[todo.status];

  return (
    <div
      id={`todo-${todo.id}`}
      className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 px-4 py-3 sm:py-0 sm:h-18 border-b border-gold/20 border-l-2 transition-colors ${
        isOverdue
          ? "bg-red/[0.03] border-l-red"
          : isDone
          ? "border-l-green"
          : todo.status === "in_progress"
          ? "border-l-gold"
          : "border-l-transparent"
      } ${isDone ? "opacity-70" : ""}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <select
          id={`todo-${todo.id}-status-select`}
          value={todo.status}
          onChange={(e) => onStatusChange(todo.id, e.target.value as Todo["status"])}
          className={`shrink-0 text-xs font-medium rounded-lg border px-2.5 py-2 sm:py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange/30 appearance-none bg-white ${
            isDone
              ? "border-green/40 text-green"
              : isOverdue
              ? "border-red/40 text-red"
              : "border-gold/40 text-amber-800"
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23b8860b' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 6px center',
            paddingRight: '22px',
          }}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isDone ? "text-amber-800/40 line-through" : "text-amber-900"}`}>
            {todo.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${config.bg}`}>
              {config.label}
            </span>
            <span className="text-[11px] text-amber-800/60">{todo.weddingElementName}</span>
            {todo.pic && (
              <span className="hidden sm:inline text-[11px] text-amber-800/50">• PIC: {todo.pic}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:gap-0.5 shrink-0 pl-0 sm:pl-3">
        <div className={`flex items-center gap-1 text-xs font-medium ${
          isOverdue ? "text-red" : isDone ? "text-green" : "text-amber-800/60"
        }`}>
          <Icon name="schedule" size={12} />
          {isDone ? "Selesai" : isOverdue ? `${Math.abs(daysLeft)} hari terlewat` : daysLeft === 0 ? "Hari ini" : `${daysLeft} hari lagi`}
        </div>
        <Link
          href={`/wedding-elements/${todo.weddingElementId}`}
          className="text-[10px] text-orange hover:underline sm:mt-0.5 inline-block"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
