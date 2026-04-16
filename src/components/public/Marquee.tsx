interface Props {
  items: string[];
  variant?: "brick" | "cream" | "ink";
}

export function Marquee({ items, variant = "ink" }: Props) {
  const bg =
    variant === "brick" ? "#b8341c" : variant === "cream" ? "#f5f1e8" : "#0a0908";
  const fg =
    variant === "brick" ? "#f5f1e8" : variant === "cream" ? "#0a0908" : "#f5f1e8";
  const border =
    variant === "ink" ? "rgba(245,241,232,0.14)" : "transparent";

  const track = [...items, ...items, ...items, ...items];

  return (
    <div
      className="overflow-hidden py-4 border-y"
      style={{ backgroundColor: bg, color: fg, borderColor: border }}
    >
      <div className="marquee-track">
        {track.map((item, i) => (
          <span
            key={i}
            className="text-display text-2xl md:text-3xl mx-6 flex items-center gap-6"
          >
            {item}
            <span
              aria-hidden
              className="inline-block h-1 w-1 rounded-full"
              style={{ backgroundColor: fg }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
