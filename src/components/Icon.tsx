interface IconProps {
  name: string;
  size?: number;
  className?: string;
  filled?: boolean;
}

export default function Icon({ name, size = 20, className = "", filled = false }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0`,
      }}
    >
      {name}
    </span>
  );
}
