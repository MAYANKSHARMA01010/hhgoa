
type Format = "profile" | "builder-id" | "team";

interface FormatSelectorProps {
  selected: Format;
  onChange: (f: Format) => void;
}

const FORMATS: {
  id: Format;
  label: string;
  subtitle: string;
  size: string;
  emoji: string;
}[] = [
  {
    id: "profile",
    label: "Profile Frame",
    subtitle: "Perfect for X avatar",
    size: "1080 × 1080",
    emoji: "🪪",
  },
  {
    id: "builder-id",
    label: "Builder ID Card",
    subtitle: "Boarding-pass style",
    size: "1080 × 1350",
    emoji: "🎫",
  },
  {
    id: "team",
    label: "Team Frame",
    subtitle: "2–4 people together",
    size: "1200 × 630",
    emoji: "🤝",
  },
];

export default function FormatSelector({ selected, onChange }: FormatSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {FORMATS.map((fmt) => {
        const isActive = selected === fmt.id;
        return (
          <button
            key={fmt.id}
            onClick={() => onChange(fmt.id)}
            className="format-card text-left rounded-2xl p-4 transition-all"
            style={{
              background: isActive ? "rgba(245,230,66,0.1)" : "rgba(11,104,57,0.25)",
              border: `2px solid ${isActive ? "#F5E642" : "rgba(245,230,66,0.15)"}`,
              boxShadow: isActive ? "0 0 20px rgba(245,230,66,0.15)" : "none",
            }}
          >
            <div className="text-3xl mb-2">{fmt.emoji}</div>
            <div
              className="font-bold text-base mb-0.5"
              style={{ color: isActive ? "#F5E642" : "#F5F0E8" }}
            >
              {fmt.label}
            </div>
            <div className="text-cream/60 text-xs mb-1">{fmt.subtitle}</div>
            <div
              className="text-xs font-mono"
              style={{ color: isActive ? "rgba(245,230,66,0.7)" : "rgba(245,240,232,0.3)" }}
            >
              {fmt.size}
            </div>
          </button>
        );
      })}
    </div>
  );
}
