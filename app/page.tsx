"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SplashScreen from "@/components/landing/SplashScreen";
import LandingHeader from "@/components/landing/LandingHeader";
import HypeVideoModal from "@/components/landing/HypeVideoModal";

export default function HomePage() {
  const [isHypeModalOpen, setIsHypeModalOpen] = useState(false);

  return (
    <>
      <SplashScreen />
      <HypeVideoModal isOpen={isHypeModalOpen} onClose={() => setIsHypeModalOpen(false)} />

      {/* ════════════════════════════════════════
          SECTION 1 — HERO (full-screen tropical poster)
      ════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden select-none"
        style={{
          width: "100%",
          height: "100dvh",
          minHeight: 560,
          background: "radial-gradient(circle at 50% 40%, #035227 0%, #02381b 55%, #01210f 100%)",
          display: "grid",
          gridTemplateRows: "1fr auto",
        }}
      >
        {/* Sunburst Rays Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, rgba(254,225,1,0.2) 0deg 10deg, transparent 10deg 20deg)`,
            animation: "rotateHeroSunburst 80s linear infinite",
          }}
        />

        {/* Ambient Glows */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] blur-3xl opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #FEE101 0%, #E8187A 70%, transparent 100%)" }}
        />

        {/* Outer Retro Gold/Pink Border */}
        <div
          className="absolute inset-3 sm:inset-5 pointer-events-none rounded-lg z-20"
          style={{
            border: "1.5px solid rgba(254,225,1,0.25)",
            boxShadow: "inset 0 0 0 3px rgba(1,33,15,0.7)",
          }}
        >
          <span className="absolute top-2 left-2 text-yellow-300/50 text-xs">✦</span>
          <span className="absolute top-2 right-2 text-yellow-300/50 text-xs">✦</span>
          <span className="absolute bottom-2 left-2 text-yellow-300/50 text-xs">✦</span>
          <span className="absolute bottom-2 right-2 text-yellow-300/50 text-xs">✦</span>
        </div>

        {/* Palm Silhouettes (Left & Right) */}
        <div className="absolute left-0 top-0 bottom-0 pointer-events-none opacity-20 w-24 sm:w-44 flex items-center z-10">
          <svg viewBox="0 0 100 200" fill="#FEE101" className="w-full h-auto">
            <path d="M10 200 Q 30 140 0 80 Q 20 60 50 70 Q 30 40 10 50 Q 50 20 80 40 Q 60 70 70 90 Q 40 120 10 200 Z" />
            <path d="M0 160 Q 40 110 10 60 Q 60 50 70 80 Q 40 110 0 160 Z" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute right-0 top-0 bottom-0 pointer-events-none opacity-20 w-24 sm:w-44 flex items-center transform scale-x-[-1] z-10">
          <svg viewBox="0 0 100 200" fill="#FEE101" className="w-full h-auto">
            <path d="M10 200 Q 30 140 0 80 Q 20 60 50 70 Q 30 40 10 50 Q 50 20 80 40 Q 60 70 70 90 Q 40 120 10 200 Z" />
            <path d="M0 160 Q 40 110 10 60 Q 60 50 70 80 Q 40 110 0 160 Z" opacity="0.6" />
          </svg>
        </div>

        {/* Header — absolutely overlaid */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <LandingHeader onCheckHype={() => setIsHypeModalOpen(true)} />
        </div>

        {/* Hero Body */}
        <div
          className="relative z-20 flex flex-col items-center justify-center px-4"
          style={{
            animation: "heroFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s both",
            paddingTop: "clamp(4rem, 7vw, 5.5rem)",
            paddingBottom: "clamp(1rem, 2.5vw, 2rem)",
          }}
        >
          {/* Team OBOW Badge */}
          <div
            className="flex items-center gap-2 px-4 py-1 rounded-full mb-3 shadow-lg"
            style={{
              background: "rgba(232,24,122,0.18)",
              border: "1.5px solid #E8187A",
              boxShadow: "0 0 16px rgba(232,24,122,0.35)",
            }}
          >
            <span className="text-pink-400 text-xs">✦</span>
            <span className="font-mono font-black text-xs sm:text-sm text-yellow-300 tracking-[0.3em] uppercase">
              BUILT BY TEAM OBOW
            </span>
            <span className="text-pink-400 text-xs">✦</span>
          </div>

          {/* HACKER HOUSE Graphic */}
          <div className="relative w-full flex justify-center" style={{ maxWidth: 1100 }}>
            <Image
              src="/assets/Hacker-house.png"
              alt="HACKER HOUSE"
              width={1440}
              height={380}
              className="w-full h-auto object-contain block drop-shadow-[0_8px_20px_rgba(1,33,15,0.8)]"
              priority
              style={{ maxHeight: "48vh" }}
            />
            {/* Glowing Hindi Goa Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                <div
                  className="absolute inset-0 blur-lg opacity-60 rounded-full"
                  style={{ background: "#E8187A" }}
                />
                <Image
                  src="/assets/goa_hindi.svg"
                  alt="गोवा"
                  width={180}
                  height={110}
                  priority
                  loading="eager"
                  className="object-contain relative z-10 drop-shadow-[0_4px_12px_rgba(232,24,122,0.9)]"
                  style={{ height: "clamp(4rem, 10vw, 8.5rem)", width: "auto" }}
                />
              </div>
            </div>
          </div>

          {/* Date · Location */}
          <div
            className="flex items-center justify-center mt-3 px-5 py-1.5 rounded-full"
            style={{
              gap: "clamp(0.6rem, 2vw, 1.2rem)",
              flexWrap: "wrap",
              background: "rgba(1,33,15,0.7)",
              border: "1px solid rgba(254,225,1,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 flex-shrink-0" />
            <span className="font-mono font-bold text-yellow-300 tracking-[0.2em] text-xs sm:text-sm">
              GOA, INDIA
            </span>
          </div>

          {/* Generator Quick Action Buttons */}
          <div className="flex flex-wrap gap-3.5 justify-center mt-6">
            <Link
              href="/create/builder-id"
              className="font-mono font-black uppercase text-xs sm:text-sm"
              style={{
                letterSpacing: "0.18em",
                padding: "0.85em 2.2em",
                background: "#FEE101",
                color: "#011a0d",
                border: "2px solid #E8187A",
                outline: "2.5px dotted #E8187A",
                outlineOffset: "3px",
                textDecoration: "none",
                boxShadow: "0 6px 24px rgba(254,225,1,0.35)",
                transition: "transform 220ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 220ms ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1.05) translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(232,24,122,0.5)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1) translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(254,225,1,0.35)";
              }}
            >
              + BUILDER ID CARD
            </Link>

            <Link
              href="/create/profile"
              className="font-mono font-bold uppercase text-xs sm:text-sm"
              style={{
                letterSpacing: "0.15em",
                padding: "0.85em 1.8em",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(6px)",
                textDecoration: "none",
                transition: "all 200ms ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#FEE101";
                (e.currentTarget as HTMLElement).style.color = "#FEE101";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              PROFILE FRAME
            </Link>

            <Link
              href="/create/team"
              className="font-mono font-bold uppercase text-xs sm:text-sm"
              style={{
                letterSpacing: "0.15em",
                padding: "0.85em 1.8em",
                background: "rgba(232,24,122,0.15)",
                color: "#ff85c0",
                border: "1.5px solid #E8187A",
                backdropFilter: "blur(6px)",
                textDecoration: "none",
                transition: "all 200ms ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "#E8187A";
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(232,24,122,0.15)";
                (e.currentTarget as HTMLElement).style.color = "#ff85c0";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              TEAM FRAME (UP TO 3)
            </Link>
          </div>
        </div>

        {/* Pinned Info Bar */}
        <div
          className="relative z-20 flex items-center justify-between font-mono"
          style={{
            padding: "0.8em clamp(1rem, 5vw, 3rem)",
            background: "rgba(1,21,12,0.85)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(254,225,1,0.12)",
            fontSize: "clamp(0.6rem, 1.3vw, 0.85rem)",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          <span>
            TEAM <strong style={{ color: "#FEE101" }}>OBOW</strong> &nbsp;·&nbsp; #FRAMEINGOA &nbsp;·&nbsp; GOA 2026
          </span>
          <span style={{ color: "rgba(254,225,1,0.4)" }}>2:47 PM STUDIO</span>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 2 — HOW IT WORKS (Tropical Retro Cards)
      ════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden select-none"
        style={{
          background: "radial-gradient(circle at 50% 30%, #034521 0%, #022b15 60%, #011a0d 100%)",
          padding: "clamp(4.5rem, 9vw, 7rem) clamp(1rem, 5vw, 3rem)",
          borderTop: "2px solid rgba(254,225,1,0.15)",
        }}
      >
        {/* Decorative Grid Line */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(254,225,1,0.1) 40px, rgba(254,225,1,0.1) 41px),
                              repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(254,225,1,0.1) 40px, rgba(254,225,1,0.1) 41px)`,
          }}
        />

        <div className="relative z-10 text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full font-mono font-bold text-xs text-yellow-300 tracking-[0.3em] uppercase mb-3 shadow-md"
            style={{ background: "rgba(254,225,1,0.12)", border: "1.5px solid rgba(254,225,1,0.3)" }}
          >
            <span>✦</span>
            <span>SIMPLE WORKFLOW</span>
            <span>✦</span>
          </div>
          <h2
            className="font-mono font-black uppercase text-white tracking-wider leading-tight"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            3 STEPS TO YOUR FRAME
          </h2>
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-7" style={{ maxWidth: 1100, margin: "0 auto" }}>
          {[
            {
              step: "01",
              icon: "📷",
              title: "UPLOAD PHOTO",
              desc: "Upload any headshot or team photo. Built-in instant transcoding converts iPhone HEIC photos to JPG/PNG client-side.",
              accent: "#FEE101",
              textColor: "#011a0d",
              badgeText: "STEP ONE",
            },
            {
              step: "02",
              icon: "🎨",
              title: "CUSTOMIZE DETAILS",
              desc: "Type your name, developer role, tech stack & builder class. See real-time high-resolution canvas rendering.",
              accent: "#E8187A",
              textColor: "#ffffff",
              badgeText: "STEP TWO",
            },
            {
              step: "03",
              icon: "🚀",
              title: "EXPORT & SHARE",
              desc: "Download high-res PNG or tap once to share to X with pre-filled caption & automatic #FrameInGoa preview.",
              accent: "#026834",
              textColor: "#ffffff",
              badgeText: "STEP THREE",
            },
          ].map(({ step, icon, title, desc, accent, textColor, badgeText }) => (
            <div
              key={step}
              className="relative flex flex-col justify-between rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
              style={{
                background: accent,
                padding: "2.4rem 2rem",
                minWidth: 270,
                maxWidth: 330,
                flex: "1 1 270px",
                border: "2px solid rgba(255,255,255,0.18)",
                boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
              }}
            >
              {/* Background Step Number Watermark */}
              <span
                className="font-mono font-black select-none pointer-events-none"
                style={{
                  color: textColor,
                  fontSize: "4.5rem",
                  lineHeight: 0.8,
                  opacity: 0.12,
                  position: "absolute",
                  top: "1rem",
                  right: "1.2rem",
                }}
              >
                {step}
              </span>

              <div>
                {/* Step Icon Badge */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-4 shadow-md"
                  style={{
                    background: textColor === "#011a0d" ? "rgba(1,26,13,0.12)" : "rgba(255,255,255,0.15)",
                    border: `1.5px solid ${textColor === "#011a0d" ? "rgba(1,26,13,0.2)" : "rgba(255,255,255,0.25)"}`,
                  }}
                >
                  {icon}
                </div>

                <span
                  className="font-mono font-black text-[10px] tracking-[0.3em] uppercase block mb-2"
                  style={{ color: textColor, opacity: 0.65 }}
                >
                  {badgeText}
                </span>

                <h3
                  className="font-mono font-black text-xl tracking-wider mb-3 leading-snug"
                  style={{ color: textColor }}
                >
                  {title}
                </h3>

                <p
                  className="font-mono text-xs leading-relaxed"
                  style={{ color: textColor, opacity: 0.85 }}
                >
                  {desc}
                </p>
              </div>

              <div
                className="mt-6 pt-4 border-t font-mono text-[10px] tracking-[0.2em] font-bold uppercase flex items-center gap-1"
                style={{
                  borderColor: textColor === "#011a0d" ? "rgba(1,26,13,0.15)" : "rgba(255,255,255,0.2)",
                  color: textColor,
                }}
              >
                <span>INSTANT PROCESS</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Big Action Callout */}
        <div className="relative z-10 text-center mt-16">
          <Link
            href="/create/builder-id"
            className="font-mono font-black uppercase inline-block text-xs sm:text-sm tracking-[0.2em]"
            style={{
              padding: "1.1em 3em",
              background: "#FEE101",
              color: "#011a0d",
              border: "2px solid #E8187A",
              outline: "3px dotted #E8187A",
              outlineOffset: "4px",
              boxShadow: "0 8px 28px rgba(232,24,122,0.4)",
              textDecoration: "none",
              transition: "all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-3px) scale(1.04)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 14px 38px rgba(232,24,122,0.6)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(232,24,122,0.4)";
            }}
          >
            + GENERATE YOUR BUILDER CARD NOW
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 3 — CHOOSE YOUR FORMAT (Studio Modes)
      ════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden select-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, #02361b 0%, #012110 70%, #011309 100%)",
          padding: "clamp(4.5rem, 9vw, 7rem) clamp(1rem, 5vw, 3rem)",
          borderTop: "2px solid rgba(254,225,1,0.15)",
        }}
      >
        {/* Palm tree vector outline accent */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-10 w-48 sm:w-72">
          <svg viewBox="0 0 100 200" fill="#FEE101" className="w-full h-auto">
            <path d="M10 200 Q 30 140 0 80 Q 20 60 50 70 Q 30 40 10 50 Q 50 20 80 40 Q 60 70 70 90 Q 40 120 10 200 Z" />
          </svg>
        </div>

        <div className="relative z-10 text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full font-mono font-bold text-xs text-pink-400 tracking-[0.3em] uppercase mb-3 shadow-md"
            style={{ background: "rgba(232,24,122,0.15)", border: "1.5px solid #E8187A" }}
          >
            <span>✦</span>
            <span>STUDIO MODES</span>
            <span>✦</span>
          </div>
          <h2
            className="font-mono font-black uppercase text-white leading-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "0.08em", textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
          >
            CHOOSE YOUR FORMAT
          </h2>
        </div>

        <div
          className="relative z-10 grid gap-7"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          }}
        >
          {[
            {
              href: "/create/builder-id",
              title: "BUILDER ID CARD",
              badge: "SOLO FORMAT",
              featureBadge: "✦ OFFICIAL VERIFIED BADGE",
              desc: "Full vertical ID card complete with photo, name, tech stack, builder class & QR verification code.",
              accent: "#E8187A",
              cardBg: "rgba(2, 54, 27, 0.85)",
              textColor: "#ffffff",
              ctaText: "GENERATE ID CARD →",
              border: "2px solid rgba(232,24,122,0.5)",
            },
            {
              href: "/create/profile",
              title: "PROFILE OVERLAY",
              badge: "TWITTER / X AVATAR",
              featureBadge: "✦ HIGH-RES CIRCULAR BADGE",
              desc: "Square format profile overlay tailored for X/Twitter avatars with official Goa 2026 branding frame.",
              accent: "#FEE101",
              cardBg: "rgba(1, 33, 15, 0.85)",
              textColor: "#ffffff",
              ctaText: "GENERATE OVERLAY →",
              border: "2px solid rgba(254,225,1,0.5)",
            },
            {
              href: "/create/team",
              title: "TEAM FRAME",
              badge: "GROUP (1-3 MEMBERS)",
              desc: "Assemble up to 3 teammates side-by-side in a single unified hacker house team card for your squad.",
              accent: "#ff85c0",
              featureBadge: "✦ OBOW ASSEMBLED",
              cardBg: "rgba(1, 23, 11, 0.9)",
              textColor: "#ffffff",
              ctaText: "ASSEMBLE TEAM →",
              border: "2px solid rgba(232,24,122,0.5)",
            },
          ].map(({ href, title, badge, featureBadge, desc, accent, cardBg, textColor, ctaText, border }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col justify-between p-8 rounded-xl text-decoration-none transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
              style={{
                background: cardBg,
                border: border,
                backdropFilter: "blur(12px)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className="font-mono font-black text-[10px] tracking-[0.25em] uppercase px-3 py-1 rounded-full"
                    style={{ color: accent, background: "rgba(255,255,255,0.08)", border: `1px solid ${accent}40` }}
                  >
                    {badge}
                  </span>
                </div>

                <h3
                  className="font-mono font-black text-2xl tracking-wider mb-3 leading-snug group-hover:text-yellow-300 transition-colors"
                  style={{ color: textColor }}
                >
                  {title}
                </h3>

                <p
                  className="font-mono text-xs leading-relaxed opacity-75 mb-6"
                  style={{ color: textColor }}
                >
                  {desc}
                </p>

                <div
                  className="inline-block font-mono text-[10px] tracking-[0.18em] font-bold py-1 px-2.5 rounded mb-4"
                  style={{ color: accent, background: "rgba(255,255,255,0.05)" }}
                >
                  {featureBadge}
                </div>
              </div>

              <div
                className="pt-4 border-t font-mono font-bold text-xs tracking-wider flex items-center justify-between group-hover:translate-x-1 transition-transform"
                style={{ borderColor: "rgba(255,255,255,0.12)", color: accent }}
              >
                <span>{ctaText}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER (Retro Tropical Ribbon & Details)
      ════════════════════════════════════════ */}
      <footer
        className="relative select-none"
        style={{
          background: "#011309",
          borderTop: "2px solid rgba(254,225,1,0.2)",
        }}
      >
        {/* Retro Ticker Marquee Bar */}
        <div
          className="py-2 px-4 font-mono font-bold text-[11px] tracking-[0.3em] uppercase overflow-hidden whitespace-nowrap"
          style={{
            background: "#FEE101",
            color: "#011a0d",
            borderBottom: "2px solid #E8187A",
          }}
        >
          <div className="flex justify-around items-center gap-8">
            <span>✦ HACKER HOUSE GOA 2026</span>
            <span>🌴 TEAM OBOW STUDIO</span>
            <span>✦ #FRAMEINGOA</span>
            <span>🌴 GOA, INDIA · OCT 28-31</span>
            <span>✦ BUILD · SHIP · LAUNCH</span>
          </div>
        </div>

        <div
          className="py-12 px-6 sm:px-12"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div className="flex flex-wrap justify-between items-start gap-10">
            {/* OBOW Brand Info */}
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono font-black text-2xl text-yellow-300 tracking-[0.25em] uppercase">
                  OBOW
                </span>
                <span className="text-xs text-pink-400 font-mono border border-pink-500/40 px-2.5 py-0.5 rounded-full bg-pink-500/10 tracking-widest uppercase">
                  ✦ STUDIO
                </span>
              </div>
              <p
                className="font-mono text-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Official photo-to-card generator built by <strong style={{ color: "#FEE101" }}>Team OBOW</strong> for <strong style={{ color: "#fff" }}>Hacker House Goa 2026</strong>.
              </p>
            </div>

            {/* Links Columns */}
            <div className="flex gap-12 flex-wrap font-mono">
              <div>
                <p className="font-bold text-xs text-yellow-300 tracking-[0.25em] mb-4 uppercase">
                  CREATOR TOOLS
                </p>
                {[
                  ["BUILDER ID CARD", "/create/builder-id"],
                  ["PROFILE OVERLAY", "/create/profile"],
                  ["TEAM FRAME (UP TO 3)", "/create/team"],
                ].map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="block text-xs text-white/60 hover:text-yellow-300 transition-colors mb-2.5 tracking-wider text-decoration-none"
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div>
                <p className="font-bold text-xs text-yellow-300 tracking-[0.25em] mb-4 uppercase">
                  COMMUNITY
                </p>
                {[
                  ["#FRAMEINGOA ON X", "https://x.com/search?q=%23FrameInGoa"],
                  ["HH GOA 2026", "https://hackerhousegoa.com"],
                  ["2:47PM STUDIO", "https://x.com/247pmstudio"],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-white/60 hover:text-yellow-300 transition-colors mb-2.5 tracking-wider text-decoration-none"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div
            className="font-mono flex justify-between flex-wrap gap-3 text-[10px] sm:text-xs text-white/30 pt-8 mt-10"
            style={{
              borderTop: "1px solid rgba(254,225,1,0.1)",
            }}
          >
            <span>© 2026 TEAM OBOW. BUILT FOR HACKER HOUSE GOA 2026.</span>
            <span>#FRAMEINGOA · 2:47 PM STUDIO</span>
          </div>
        </div>
      </footer>

      {/* Keyframe animations */}
      <style>{`
        @keyframes rotateHeroSunburst {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
