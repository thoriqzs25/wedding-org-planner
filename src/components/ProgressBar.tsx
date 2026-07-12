import Icon from "./Icon";

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  label: string;
  showWarning?: boolean;
}

export default function ProgressBar({
  value,
  max,
  color = "bg-orange",
  label,
  showWarning,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-amber-900/70">{label}</span>
        <span className="font-medium text-amber-900">
          {value.toLocaleString()}
          {max > 0 && ` / ${max.toLocaleString()}`}
        </span>
      </div>
      <div className="h-3 bg-cream rounded-full overflow-hidden border border-gold/30">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color} ${
            showWarning ? "animate-pulse" : ""
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showWarning && (
        <p className="text-xs text-pink mt-1 font-medium flex items-center gap-1">
          <Icon name="warning" size={14} />
          Perlu perhatian!
        </p>
      )}
    </div>
  );
}
