import { Todo } from "@/types";

export const statusConfig: Record<Todo["status"], { label: string; icon: string; color: string; bg: string }> = {
  pending: { label: "Pending", icon: "radio_button_unchecked", color: "text-amber-800/30", bg: "bg-cream text-amber-800/50" },
  in_progress: { label: "Diproses", icon: "progress_activity", color: "text-gold", bg: "bg-gold/20 text-amber-800" },
  done: { label: "Selesai", icon: "check_circle", color: "text-green", bg: "bg-green/10 text-green" },
};

export const statusOrder: Record<string, number> = { pending: 0, in_progress: 1, done: 2 };

export const statusOptions: { value: Todo["status"]; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "Diproses" },
  { value: "done", label: "Selesai" },
];
