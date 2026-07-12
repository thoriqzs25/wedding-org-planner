import Icon from "./Icon";

interface EmptyStateProps {
  icon: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-10 text-amber-800/40">
      <Icon name={icon} size={40} className="mb-3 text-amber-800/30" />
      <p className="text-sm mb-4">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange text-white rounded-xl font-medium hover:bg-orange/90 transition-colors shadow-sm text-sm">
          <Icon name="add" size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
