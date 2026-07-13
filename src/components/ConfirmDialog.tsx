"use client";

import Icon from "./Icon";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "default";
}

export default function ConfirmDialog({
  title, message, confirmLabel = "Hapus", cancelLabel = "Batal",
  onConfirm, onCancel, variant = "danger",
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 text-center space-y-4">
        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
          variant === "danger" ? "bg-red/10" : "bg-orange/10"
        }`}>
          <Icon name={variant === "danger" ? "warning" : "info"} size={28}
            className={variant === "danger" ? "text-red" : "text-orange"} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-amber-900">{title}</h3>
          <p className="text-sm text-amber-800/60 mt-1">{message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 min-h-[44px] rounded-xl border border-gold/40 text-amber-900 font-medium hover:bg-cream transition-colors active:scale-[0.98]">
            {cancelLabel}
          </button>
          <button onClick={onConfirm}
            className={`flex-1 min-h-[44px] rounded-xl text-white font-medium transition-colors active:scale-[0.98] ${
              variant === "danger"
                ? "bg-red hover:bg-red/90"
                : "bg-orange hover:bg-orange/90"
            }`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
