"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [phase, setPhase] = useState<"in" | "hold" | "tear" | "gone">("in");
  const [contentVisible, setContentVisible] = useState(true);

  useEffect(() => {
    // Display splash for ~1.5s hold time, then tear open over 0.5s (2.0s total max)
    const t1 = setTimeout(() => setPhase("tear"), 1500);
    const t2 = setTimeout(() => setPhase("gone"), 2000);

    return () => [t1, t2].forEach(clearTimeout);
  }, []);

  if (phase === "gone") return null;

  const isTearing = phase === "tear";

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden select-none"
      style={{ background: "#04150c" }}
    >
      {/* ── Top half (slides UP when tearing) ── */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "50%",
          transform: isTearing ? "translateY(-105%) scaleY(0.98)" : "translateY(0) scaleY(1)",
          transition: isTearing ? "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          willChange: "transform",
          overflow: "hidden",
        }}
      >
        <TicketFace contentVisible={contentVisible} />
      </div>

      {/* ── Bottom half (slides DOWN when tearing) ── */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "50%",
          transform: isTearing ? "translateY(105%) scaleY(0.98)" : "translateY(0) scaleY(1)",
          transition: isTearing ? "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          willChange: "transform",
          overflow: "hidden",
        }}
      >
        {/* Offset full face by -50vh */}
        <div style={{ position: "absolute", top: "-50vh", left: 0, right: 0, height: "100vh" }}>
          <TicketFace contentVisible={contentVisible} />
        </div>
      </div>

      {/* ── Perforation & Glow tear line ── */}
      {!isTearing && (
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            height: 30,
            zIndex: 50,
            opacity: contentVisible ? 1 : 0,
            transition: "opacity 0.2s ease",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Glowing central line */}
          <div
            style={{
              position: "absolute",
              inset: "0 0",
              height: 2,
              top: "50%",
              transform: "translateY(-50%)",
              background: "linear-gradient(90deg, transparent, rgba(254,225,1,0.6) 20%, rgba(232,24,122,0.8) 50%, rgba(254,225,1,0.6) 80%, transparent)",
              boxShadow: "0 0 12px rgba(254,225,1,0.8), 0 0 20px rgba(232,24,122,0.6)",
            }}
          />

          <svg width="100%" height="6" style={{ display: "block", position: "relative", zIndex: 2 }}>
            <line
              x1="0" y1="3" x2="100%" y2="3"
              stroke="#FEE101"
              strokeWidth="2"
              strokeDasharray="12 8"
            />
          </svg>

          {/* Notch cutouts */}
          <div style={{
            position: "absolute", left: -10, top: "50%",
            transform: "translateY(-50%)",
            width: 24, height: 24, borderRadius: "50%",
            background: "#04150c",
            border: "2px solid #FEE101",
            boxShadow: "0 0 10px rgba(254,225,1,0.4)",
          }} />
          <div style={{
            position: "absolute", right: -10, top: "50%",
            transform: "translateY(-50%)",
            width: 24, height: 24, borderRadius: "50%",
            background: "#04150c",
            border: "2px solid #FEE101",
            boxShadow: "0 0 10px rgba(254,225,1,0.4)",
          }} />
        </div>
      )}
    </div>
  );
}

/* ─── Rich Tropical Retro Ticket Face (100vh) ─── */
function TicketFace({ contentVisible }: { contentVisible: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-between"
      style={{
        height: "100vh",
        background: "radial-gradient(circle at 50% 40%, #035227 0%, #02381b 55%, #01210f 100%)",
        opacity: contentVisible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      {/* ── Background Sunburst Rays ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, rgba(254,225,1,0.15) 0deg 10deg, transparent 10deg 20deg)`,
          animation: "rotateSunburst 60s linear infinite",
        }}
      />

      {/* ── Outer Decorative Border Frame ── */}
      <div
        className="absolute inset-4 sm:inset-6 pointer-events-none rounded-lg"
        style={{
          border: "2px solid rgba(254,225,1,0.3)",
          boxShadow: "inset 0 0 0 4px rgba(2,56,27,0.8), inset 0 0 0 6px rgba(232,24,122,0.4)",
        }}
      >
        {/* Corner Ornaments */}
        <span className="absolute top-2 left-2 text-yellow-300 opacity-60 text-xs">✦</span>
        <span className="absolute top-2 right-2 text-yellow-300 opacity-60 text-xs">✦</span>
        <span className="absolute bottom-2 left-2 text-yellow-300 opacity-60 text-xs">✦</span>
        <span className="absolute bottom-2 right-2 text-yellow-300 opacity-60 text-xs">✦</span>
      </div>

      {/* ── Palm Tree Silhouette Overlay (Left & Right) ── */}
      <div className="absolute left-0 top-0 bottom-0 pointer-events-none opacity-25 w-24 sm:w-40 flex items-center">
        <svg viewBox="0 0 100 200" fill="#FEE101" className="w-full h-auto">
          <path d="M10 200 Q 30 140 0 80 Q 20 60 50 70 Q 30 40 10 50 Q 50 20 80 40 Q 60 70 70 90 Q 40 120 10 200 Z" />
          <path d="M0 160 Q 40 110 10 60 Q 60 50 70 80 Q 40 110 0 160 Z" opacity="0.6" />
        </svg>
      </div>
      <div className="absolute right-0 top-0 bottom-0 pointer-events-none opacity-25 w-24 sm:w-40 flex items-center transform scale-x-[-1]">
        <svg viewBox="0 0 100 200" fill="#FEE101" className="w-full h-auto">
          <path d="M10 200 Q 30 140 0 80 Q 20 60 50 70 Q 30 40 10 50 Q 50 20 80 40 Q 60 70 70 90 Q 40 120 10 200 Z" />
          <path d="M0 160 Q 40 110 10 60 Q 60 50 70 80 Q 40 110 0 160 Z" opacity="0.6" />
        </svg>
      </div>

      {/* ── Side Marquee Vertical Text Bars ── */}
      <div
        className="absolute left-0 top-0 bottom-0 hidden sm:flex items-center justify-center pointer-events-none"
        style={{ width: 44, borderRight: "1px solid rgba(254,225,1,0.15)", background: "rgba(1,33,15,0.4)" }}
      >
        <span
          className="font-mono text-[10px] tracking-[0.35em] text-yellow-300/40 uppercase whitespace-nowrap"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          🌴 TROPICAL HACKER RESIDENCY · GOA 2026
        </span>
      </div>
      <div
        className="absolute right-0 top-0 bottom-0 hidden sm:flex items-center justify-center pointer-events-none"
        style={{ width: 44, borderLeft: "1px solid rgba(254,225,1,0.15)", background: "rgba(1,33,15,0.4)" }}
      >
        <span
          className="font-mono text-[10px] tracking-[0.35em] text-yellow-300/40 uppercase whitespace-nowrap"
          style={{ writingMode: "vertical-rl" }}
        >
          ✦ BUILD · SHIP · LAUNCH · #FRAMEINGOA
        </span>
      </div>

      {/* ════════════════════════════════════════
          TOP HALF CONTENT (0 – 50vh)
      ════════════════════════════════════════ */}
      <div
        className="absolute inset-x-0 top-0 flex flex-col items-center justify-center px-4"
        style={{ height: "50vh", paddingTop: "2vh" }}
      >
        {/* Team OBOW Vintage Badge */}
        <div
          className="flex items-center gap-2 px-4 py-1 rounded-full mb-3"
          style={{
            background: "rgba(232,24,122,0.15)",
            border: "1.5px solid #E8187A",
            boxShadow: "0 0 15px rgba(232,24,122,0.3)",
          }}
        >
          <span className="text-pink-400 text-xs">✦</span>
          <span className="font-mono font-black text-xs sm:text-sm text-yellow-300 tracking-[0.35em] uppercase">
            TEAM OBOW
          </span>
          <span className="text-pink-400 text-xs">✦</span>
        </div>

        {/* HACKER HOUSE Typography */}
        <div className="relative text-center">
          {/* Subtle Glow aura behind text */}
          <div
            className="absolute inset-0 blur-2xl opacity-40 pointer-events-none"
            style={{ background: "radial-gradient(circle, #FEE101 0%, #E8187A 70%, transparent 100%)" }}
          />

          <h1
            className="font-mono font-black uppercase relative z-10 leading-[0.85]"
            style={{
              fontSize: "clamp(3.5rem, 10.5vw, 8.5rem)",
              color: "#FEE101",
              letterSpacing: "-0.03em",
              textShadow: "0 4px 0 #E8187A, 0 8px 0 #01210f, 0 14px 25px rgba(0,0,0,0.6)",
            }}
          >
            HACKER<br />HOUSE
          </h1>
        </div>
      </div>

      {/* ════════════════════════════════════════
          BOTTOM HALF CONTENT (50vh – 100vh)
      ════════════════════════════════════════ */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center px-4"
        style={{ height: "50vh", paddingBottom: "2vh" }}
      >
        {/* Glowing Hindi Goa Badge */}
        <div className="relative mb-3">
          <div
            className="absolute inset-0 blur-xl opacity-60 rounded-full"
            style={{ background: "#E8187A" }}
          />
          <Image
            src="/assets/goa_hindi.svg"
            alt="गोवा"
            width={180}
            height={110}
            priority
            loading="eager"
            className="relative z-10 object-contain drop-shadow-[0_4px_12px_rgba(232,24,122,0.9)]"
            style={{ height: "clamp(3.2rem, 7.5vh, 5.5rem)", width: "auto" }}
          />
        </div>

        {/* Event Date & Location Tag */}
        <div
          className="flex items-center justify-center gap-3 px-5 py-1.5 rounded-md mb-2"
          style={{
            background: "rgba(1,33,15,0.75)",
            border: "1px solid rgba(254,225,1,0.25)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <span className="font-mono font-bold text-xs sm:text-sm text-yellow-300 tracking-[0.2em]">
            GOA, INDIA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
          <span className="font-mono font-bold text-yellow-300 tracking-[0.2em]">
            OCT 28 – 31, 2026
          </span>
        </div>

        {/* Subtitle / Hashtag */}
        <p className="font-mono text-[10px] sm:text-xs text-yellow-200/50 tracking-[0.3em] uppercase">
          #FRAMEINGOA &nbsp;·&nbsp; OFFICIAL BUILDER FRAME STUDIO
        </p>
      </div>

      {/* ── Keyframe Animations ── */}
      <style>{`
        @keyframes rotateSunburst {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
