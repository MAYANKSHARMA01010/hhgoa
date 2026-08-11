"use client";

type Format = "profile" | "builder-id" | "team";

interface FormatSelectorProps {
  selected: Format;
  onChange: (f: Format) => void;
}

const FORMATS: {
  id: Format;
  label: string;
  subtitle: string;
  badge: string;
  size: string;
  emoji: string;
}[] = [
  {
    id: "profile",
    label: "Profile Overlay",
    subtitle: "Twitter / X avatar badge",
    badge: "SOLO",
    size: "1080 × 1080",
    emoji: "🪪",
  },
  {
    id: "builder-id",
    label: "Builder ID Card",
    subtitle: "Official boarding pass",
    badge: "SOLO",
    size: "1080 × 1350",
    emoji: "🎫",
  },
  {
    id: "team",
    label: "Team Frame",
    subtitle: "2–3 members squad",
    badge: "GROUP",
    size: "1200 × 630",
    emoji: "🤝",
  },
];

export default function FormatSelector({ selected, onChange }: FormatSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 select-none">
      {FORMATS.map((fmt) => {
        const isActive = selected === fmt.id;
        return (
          <button
            key={fmt.id}
            type="button"
            onClick={() => onChange(fmt.id)}
            className="format-card text-left rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            style={{
              background: isActive
                ? "rgba(1, 33, 15, 0.95)"
                : "rgba(1, 21, 12, 0.65)",
              border: isActive
                ? "2px solid #FEE101"
                : "1.5px solid rgba(255,255,255,0.15)",
              outline: isActive ? "2.5px dotted #E8187A" : "none",
              outlineOffset: "2px",
              boxShadow: isActive
                ? "0 8px 24px rgba(254,225,1,0.25)"
                : "0 4px 15px rgba(0,0,0,0.2)",
              transform: isActive ? "translateY(-2px)" : "none",
            }}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-2xl">{fmt.emoji}</span>
                <span
                  className="font-mono font-bold text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full"
                  style={{
                    background: isActive ? "rgba(232,24,122,0.2)" : "rgba(255,255,255,0.08)",
                    color: isActive ? "#ff85c0" : "rgba(255,255,255,0.5)",
                    border: `1px solid ${isActive ? "#E8187A" : "rgba(255,255,255,0.15)"}`,
                  }}
                >
                  {fmt.badge}
                </span>
              </div>

              <div
                className="font-mono font-black text-sm uppercase tracking-wider mb-0.5 leading-snug"
                style={{ color: isActive ? "#FEE101" : "#ffffff" }}
              >
                {fmt.label}
              </div>
              <div className="text-white/60 font-mono text-[11px] mb-2">
                {fmt.subtitle}
              </div>
            </div>

            <div
              className="text-[10px] font-mono font-bold tracking-widest pt-2 border-t flex items-center justify-between"
              style={{
                borderColor: isActive ? "rgba(254,225,1,0.2)" : "rgba(255,255,255,0.1)",
                color: isActive ? "#FEE101" : "rgba(255,255,255,0.4)",
              }}
            >
              <span>{fmt.size}</span>
              {isActive && <span className="text-pink-400">✓ SELECTED</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
