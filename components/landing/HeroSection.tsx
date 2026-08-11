"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <main
      className="relative z-10 flex-1 flex flex-col"
      style={{ animation: "heroFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both" }}
    >
      {/* ── HACKER HOUSE image fills the full width ── */}
      <div
        className="relative flex-1 flex items-center justify-center"
        style={{ padding: "0 clamp(0.5rem, 2vw, 2rem)" }}
      >
        {/* 
          Inner box: position-relative so % offsets hit the image 
          The "Hacker house.png" contains the full HACKER HOUSE lettering.
          We overlay гоа badge (goa_hindi.svg) on top.
        */}
        <div className="relative w-full" style={{ maxWidth: "100%" }}>
          {/* Main HACKER HOUSE title image */}
          <Image
            src="/assets/Hacker-house.png"
            alt="HACKER HOUSE"
            width={1440}
            height={380}
            className="w-full h-auto object-contain block"
            priority
            style={{ maxHeight: "45vh" }}
          />

          {/* गोवा badge — centered, slight pink background pill */}
          <div
            className="absolute"
            style={{
              /* Position badge over the space between HACKER and HOUSE */
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <Image
              src="/assets/goa_hindi.svg"
              alt="गोवा"
              width={160}
              height={100}
              className="object-contain"
              style={{ height: "clamp(3rem, 8vw, 7rem)", width: "auto" }}
            />
          </div>
        </div>
      </div>

      {/* ── Info strip ── */}
      <div
        className="relative z-10 flex items-center justify-between font-mono"
        style={{
          padding: "0.8em clamp(1rem, 5vw, 3rem)",
          background: "rgba(1,67,33,0.85)",
          backdropFilter: "blur(4px)",
          borderTop: "1px solid rgba(254,225,1,0.08)",
          fontSize: "clamp(0.65rem, 1.5vw, 1rem)",
          letterSpacing: "0.08em",
          color: "#fff",
        }}
      >
        <span>GOA, INDIA &nbsp;·&nbsp; 28 – 31 OCT 2026</span>
        <span style={{ color: "rgba(255,255,255,0.5)" }}>2:47 PM STUDIO</span>
      </div>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
