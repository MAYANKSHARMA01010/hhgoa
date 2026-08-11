"use client";

import Link from "next/link";

interface LandingHeaderProps {
  onCheckHype: () => void;
}

export default function LandingHeader({ onCheckHype }: LandingHeaderProps) {
  return (
    <header
      className="relative z-30 flex items-center justify-between"
      style={{
        padding: "clamp(0.875rem, 2.5vw, 2rem) clamp(1rem, 5vw, 3rem)",
        fontFamily: "'Space Mono', monospace",
        animation: "lpFadeDown 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
      }}
    >
      {/* Brand logo / Team OBOW wordmark */}
      <Link
        href="/"
        className="flex items-center gap-2 group text-decoration-none"
      >
        <span
          className="font-mono font-black text-lg sm:text-xl text-yellow-300 tracking-[0.25em] uppercase group-hover:text-pink-400 transition-colors"
          style={{ textShadow: "0 2px 8px rgba(254,225,1,0.4)" }}
        >
          OBOW
        </span>
        <span className="font-mono text-[10px] sm:text-xs text-pink-400 border border-pink-500/40 px-2 py-0.5 rounded-full bg-pink-500/10 tracking-widest uppercase">
          STUDIO
        </span>
      </Link>

      {/* Nav right cluster */}
      <nav className="flex items-center" style={{ gap: "clamp(0.75rem, 3vw, 2rem)" }}>
        {/* CHECK HYPE button */}
        <button
          type="button"
          onClick={onCheckHype}
          className="font-mono font-bold tracking-widest text-white/80 uppercase hover:text-yellow-300 transition-colors text-xs sm:text-sm"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.12em",
          }}
        >
          CHECK HYPE
        </button>

        {/* APPLY button */}
        <Link
          href="/create/builder-id"
          className="font-mono font-black uppercase text-xs sm:text-sm flex items-center"
          style={{
            letterSpacing: "0.15em",
            padding: "0.55em 1.4em",
            background: "#FEE101",
            color: "#011a0d",
            border: "2px solid #E8187A",
            outline: "2.5px dotted #E8187A",
            outlineOffset: "3px",
            textDecoration: "none",
            boxShadow: "0 4px 15px rgba(254,225,1,0.3)",
            transition: "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(232,24,122,0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(254,225,1,0.3)";
          }}
        >
          APPLY NOW
        </Link>
      </nav>

      <style>{`
        @keyframes lpFadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
