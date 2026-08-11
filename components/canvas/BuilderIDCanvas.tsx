"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import {
  COLORS,
  drawBarcode,
  drawRoundedRect,
} from "@/lib/canvasRender";
import type { CanvasHandle } from "@/lib/types";

export interface BuilderIDData {
  name: string;
  role: string;
  builderTitle: string;
  handle?: string;
  seat: string;
  photoDataUrl: string;
}

interface BuilderIDCanvasProps {
  data: BuilderIDData;
  onReady?: (canvas: HTMLCanvasElement) => void;
}

export type { CanvasHandle };

// ─── Canvas: 1080×1350 logical → 2160×2700 canvas (DPR=2) ───
const DPR = 2;
const CW  = 1080 * DPR;
const CH  = 1350 * DPR;

const BuilderIDCanvas = forwardRef<CanvasHandle, BuilderIDCanvasProps>(
  function BuilderIDCanvas({ data, onReady }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      getDataUrl: () => canvasRef.current?.toDataURL("image/jpeg", 0.93) ?? "",
      toBlob: (type = "image/jpeg", quality = 0.93) =>
        new Promise((resolve) =>
          canvasRef.current?.toBlob(resolve, type, quality) ?? resolve(null)
        ),
    }));

    useEffect(() => {
      let alive = true;

      // Draw immediately on mount synchronously so canvas is NEVER blank/black
      if (canvasRef.current) {
        draw(null, null);
      }

      async function go() {
        try { await document.fonts.ready; } catch (_) { /* ok */ }

        /** Robust image loader with instant cache resolution and timeout safety */
        function loadImg(src: string): Promise<HTMLImageElement> {
          return new Promise((resolve, reject) => {
            if (!src) return reject(new Error("Empty src"));
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              if (img.naturalWidth > 0 && img.naturalHeight > 0) resolve(img);
              else reject(new Error("Invalid dimensions"));
            };
            img.onerror = reject;
            img.src = src;
            if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
              resolve(img);
            }
          });
        }

        // Load Goa background illustration
        let bgImg: HTMLImageElement | null = null;
        try { bgImg = await loadImg("/goa-bg.png"); } catch (_) { /* ok – fallback gradient */ }

        // Load user portrait
        let portraitImg: HTMLImageElement | null = null;
        if (data.photoDataUrl) {
          try { portraitImg = await loadImg(data.photoDataUrl); } catch (_) { /* ok */ }
        }

        if (alive && canvasRef.current) {
          draw(bgImg, portraitImg);
        }
      }

      go();
      return () => { alive = false; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.photoDataUrl, data.name, data.role, data.builderTitle, data.handle, data.seat]);

    const S = DPR; // shorthand for scale

    /** Set canvas letterSpacing safely */
    function ls(ctx: CanvasRenderingContext2D, v: string) {
      if ("letterSpacing" in ctx)
        (ctx as unknown as { letterSpacing: string }).letterSpacing = v;
    }

    /** Draw text, auto-shrinking font until it fits maxW */
    function autoText(
      ctx: CanvasRenderingContext2D,
      text: string, x: number, y: number, maxW: number,
      weight: string, size: number, family: string
    ) {
      let sz = size;
      ctx.font = `${weight} ${sz}px ${family}`;
      while (ctx.measureText(text).width > maxW && sz > 16) {
        sz -= 1;
        ctx.font = `${weight} ${sz}px ${family}`;
      }
      ctx.fillText(text, x, y);
    }

    function draw(bgImg: HTMLImageElement | null, portraitImg: HTMLImageElement | null) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const MG = 28 * S;    // outer margin (for dashed border)

      // ── §1 SOLID BACKGROUND ─────────────────────────────────
      const mainBg = ctx.createLinearGradient(0, 0, 0, CH);
      mainBg.addColorStop(0, "#041C10");
      mainBg.addColorStop(0.6, "#0B4228");
      mainBg.addColorStop(1, "#021510");
      ctx.fillStyle = mainBg;
      ctx.fillRect(0, 0, CW, CH);

      // ── §2 HERO PHOTO — full bleed, top of card ─────────────
      const PHOTO_H = 980 * S;   // ~73% height for the photo block (with overlays)

      // ── GOA BACKGROUND ILLUSTRATION ──────────────────────────
      if (bgImg && bgImg.naturalWidth > 0 && bgImg.naturalHeight > 0) {
        try {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, CW, PHOTO_H);
          ctx.clip();
          // Cover-crop the illustration to fill the photo area
          const ia = bgImg.naturalWidth / bgImg.naturalHeight;
          const ra = CW / PHOTO_H;
          let sx = 0, sy = 0, sw = bgImg.naturalWidth, sh = bgImg.naturalHeight;
          if (ia > ra) { sw = sh * ra; sx = (bgImg.naturalWidth - sw) / 2; }
          else          { sh = sw / ra; sy = (bgImg.naturalHeight - sh) / 2; }
          ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, CW, PHOTO_H);
          // Dark scrim at top for "HACKER HOUSE" readability
          const topScrim = ctx.createLinearGradient(0, 0, 0, 180 * S);
          topScrim.addColorStop(0, "rgba(2,10,6,0.75)");
          topScrim.addColorStop(1, "rgba(2,10,6,0)");
          ctx.fillStyle = topScrim;
          ctx.fillRect(0, 0, CW, 180 * S);
          // Dark fade at bottom → merges into info section
          const botFade = ctx.createLinearGradient(0, PHOTO_H - 280 * S, 0, PHOTO_H);
          botFade.addColorStop(0, "rgba(4,28,16,0)");
          botFade.addColorStop(1, "rgba(4,28,16,1)");
          ctx.fillStyle = botFade;
          ctx.fillRect(0, PHOTO_H - 280 * S, CW, 280 * S);
          ctx.restore();
        } catch (e) {
          console.warn("Goa bg draw error:", e);
        }
      } else {
        // Fallback gradient when illustration fails to load
        const ph = ctx.createLinearGradient(0, 0, 0, PHOTO_H);
        ph.addColorStop(0, "#1A5C32");
        ph.addColorStop(0.5, "#0A3D1E");
        ph.addColorStop(1, "#041C10");
        ctx.fillStyle = ph;
        ctx.fillRect(0, 0, CW, PHOTO_H);
      }

      // ── USER PORTRAIT CIRCLE (overlaid on illustration) ──────
      const AVATAR_R = 80 * S;   // 80 logical px radius
      const AVATAR_CX = CW / 2;
      const AVATAR_CY = PHOTO_H - AVATAR_R - 20 * S;  // near bottom of illustration

      if (portraitImg && portraitImg.naturalWidth > 0 && portraitImg.naturalHeight > 0) {
        try {
          ctx.save();
          // Circular clip for portrait
          ctx.beginPath();
          ctx.arc(AVATAR_CX, AVATAR_CY, AVATAR_R, 0, Math.PI * 2);
          ctx.clip();
          // Cover-crop portrait into circle
          const minDim = Math.min(portraitImg.naturalWidth, portraitImg.naturalHeight);
          if (minDim > 0) {
            const psx = (portraitImg.naturalWidth - minDim) / 2;
            const psy = (portraitImg.naturalHeight - minDim) / 2;
            const D = AVATAR_R * 2;
            ctx.drawImage(portraitImg, psx, psy, minDim, minDim, AVATAR_CX - AVATAR_R, AVATAR_CY - AVATAR_R, D, D);
          }
          ctx.restore();
          // Avatar border ring (yellow)
          ctx.beginPath();
          ctx.arc(AVATAR_CX, AVATAR_CY, AVATAR_R + 4 * S, 0, Math.PI * 2);
          ctx.strokeStyle = COLORS.yellow;
          ctx.lineWidth = 3 * S;
          ctx.stroke();
        } catch (e) {
          console.warn("Portrait draw error:", e);
        }
      } else {
        // Avatar placeholder circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(AVATAR_CX, AVATAR_CY, AVATAR_R, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(4,28,16,0.7)";
        ctx.fill();
        ctx.strokeStyle = COLORS.yellow;
        ctx.lineWidth = 3 * S;
        ctx.stroke();
        ctx.fillStyle = COLORS.cream;
        ctx.globalAlpha = 0.4;
        ctx.font = `${36 * S}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("👤", AVATAR_CX, AVATAR_CY);
        ctx.restore();
      }

      // ── §3 EVENT BRANDING (overlaid on photo, top-left) ─────
      const PAD = 36 * S;

      ctx.save();
      ctx.textBaseline = "top";

      // "HACKER HOUSE" — large, bold
      ctx.fillStyle = COLORS.yellow;
      ctx.font = `900 ${62 * S}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "left";
      ls(ctx, `${4 * S}px`);
      ctx.fillText("HACKER HOUSE", PAD, 30 * S);
      ls(ctx, "0px");

      // "GOA · 2026"
      ctx.fillStyle = COLORS.cream;
      ctx.globalAlpha = 0.82;
      ctx.font = `400 ${22 * S}px 'Space Grotesk', sans-serif`;
      ls(ctx, `${8 * S}px`);
      ctx.fillText("G O A   ·   2 0 2 6", PAD, 96 * S);
      ls(ctx, "0px");
      ctx.globalAlpha = 1;

      // Top-right seat badge
      const SEAT_BW = 96 * S, SEAT_BH = 56 * S;
      const SEAT_BX = CW - PAD - SEAT_BW;
      ctx.fillStyle = "rgba(254,225,1,0.14)";
      drawRoundedRect(ctx, SEAT_BX, 26 * S, SEAT_BW, SEAT_BH, 10 * S);
      ctx.fill();
      ctx.strokeStyle = "rgba(254,225,1,0.5)";
      ctx.lineWidth = 1.5 * S;
      drawRoundedRect(ctx, SEAT_BX, 26 * S, SEAT_BW, SEAT_BH, 10 * S);
      ctx.stroke();
      ctx.fillStyle = COLORS.pink;
      ctx.font = `600 ${12 * S}px 'Inter', sans-serif`;
      ctx.textAlign = "center";
      ls(ctx, `${2 * S}px`);
      ctx.fillText("SEAT", SEAT_BX + SEAT_BW / 2, 30 * S);
      ls(ctx, "0px");
      ctx.fillStyle = COLORS.yellow;
      ctx.font = `900 ${26 * S}px 'Space Grotesk', sans-serif`;
      ctx.fillText(data.seat || "01A", SEAT_BX + SEAT_BW / 2, 46 * S);

      ctx.restore();

      // ── §4 PINK ACCENT LINE ──────────────────────────────────
      ctx.fillStyle = COLORS.pink;
      ctx.fillRect(0, PHOTO_H, CW, 4 * S);

      // ── §5 OUTER DASHED BORDER (on top of everything) ───────
      ctx.save();
      ctx.strokeStyle = "rgba(245,230,66,0.25)";
      ctx.lineWidth = 2 * S;
      ctx.setLineDash([16 * S, 10 * S]);
      ctx.strokeRect(MG, MG, CW - MG * 2, CH - MG * 2);
      ctx.restore();

      // ── §6 NAME + BUILDER TITLE ──────────────────────────────
      const NAME_TOP = PHOTO_H + 4 * S + 36 * S;   // start of name section

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      // "PASSENGER" micro-label
      ctx.fillStyle = COLORS.pink;
      ctx.font = `600 ${13 * S}px 'Inter', sans-serif`;
      ls(ctx, `${3 * S}px`);
      ctx.fillText("PASSENGER", CW / 2, NAME_TOP);
      ls(ctx, "0px");

      // NAME — very big, auto-shrinks to fit
      ctx.fillStyle = COLORS.cream;
      autoText(
        ctx,
        (data.name || "BUILDER").toUpperCase(),
        CW / 2,
        NAME_TOP + 18 * S,
        CW - PAD * 2 - 10 * S,
        "800", 76, "'Space Grotesk', sans-serif"
      );

      // BUILDER TITLE — yellow ✦ accented
      ctx.fillStyle = COLORS.yellow;
      const title = `✦  ${(data.builderTitle || "CHAD BUILDER").toUpperCase()}  ✦`;
      ctx.font = `500 ${25 * S}px 'Space Grotesk', sans-serif`;
      ls(ctx, `${2 * S}px`);
      ctx.fillText(title, CW / 2, NAME_TOP + 106 * S);
      ls(ctx, "0px");

      ctx.restore();

      // ── §7 ROLE / HANDLE ROW ────────────────────────────────
      const INFO_Y = NAME_TOP + 148 * S;
      const half   = (CW - PAD * 2) / 2;

      ctx.save();
      // vertical separator
      ctx.strokeStyle = "rgba(245,230,66,0.14)";
      ctx.lineWidth = S;
      ctx.beginPath();
      ctx.moveTo(CW / 2, INFO_Y - 4 * S);
      ctx.lineTo(CW / 2, INFO_Y + 56 * S);
      ctx.stroke();

      [
        { label: "ROLE / STACK", value: data.role || "FULL-STACK",          cx: PAD + half / 2 },
        { label: "X HANDLE",     value: data.handle ? `@${data.handle}` : "—", cx: PAD + half * 1.5 },
      ].forEach((f) => {
        ctx.fillStyle = COLORS.pink;
        ctx.font = `600 ${13 * S}px 'Inter', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ls(ctx, `${2 * S}px`);
        ctx.fillText(f.label, f.cx, INFO_Y);
        ls(ctx, "0px");
        ctx.fillStyle = COLORS.cream;
        ctx.font = `700 ${27 * S}px 'Space Grotesk', sans-serif`;
        ctx.fillText(f.value, f.cx, INFO_Y + 18 * S);
      });
      ctx.restore();

      // ── §8 BOARDING-PASS STUB ────────────────────────────────
      const STUB_Y = INFO_Y + 80 * S;
      const CR     = 24 * S;

      ctx.save();
      ctx.fillStyle = "#041C10";   // same as card bg — simulates notch cutout
      ctx.beginPath(); ctx.arc(0,  STUB_Y, CR, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(CW, STUB_Y, CR, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(245,230,66,0.28)";
      ctx.lineWidth = 2 * S;
      ctx.setLineDash([13 * S, 8 * S]);
      ctx.beginPath();
      ctx.moveTo(CR + 8 * S, STUB_Y);
      ctx.lineTo(CW - CR - 8 * S, STUB_Y);
      ctx.stroke();
      ctx.restore();

      // ── §9 BLR → GOA ────────────────────────────────────────
      const FLT_Y = STUB_Y + 20 * S;

      ctx.save();
      ctx.textBaseline = "top";

      // FROM / TO labels
      ctx.fillStyle = COLORS.cream;
      ctx.globalAlpha = 0.42;
      ctx.font = `500 ${12 * S}px 'Inter', sans-serif`;
      ls(ctx, `${2 * S}px`);
      ctx.textAlign = "left";  ctx.fillText("FROM", PAD + 40 * S, FLT_Y + 10 * S);
      ctx.textAlign = "right"; ctx.fillText("TO",   CW - PAD - 40 * S, FLT_Y + 10 * S);
      ctx.globalAlpha = 1;
      ls(ctx, "0px");

      // Airport codes
      ctx.fillStyle = COLORS.yellow;
      ctx.font = `900 ${62 * S}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "left";  ctx.fillText("BLR", PAD + 40 * S, FLT_Y + 22 * S);
      ctx.textAlign = "right"; ctx.fillText("GOA", CW - PAD - 40 * S, FLT_Y + 22 * S);

      // Arrow
      ctx.fillStyle = COLORS.cream;
      ctx.globalAlpha = 0.5;
      ctx.font = `${34 * S}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("→", CW / 2, FLT_Y + 54 * S);
      ctx.globalAlpha = 1;
      ctx.restore();

      // ── §10 GATE + DATE (compact row) ───────────────────────
      const GATE_Y = FLT_Y + 110 * S;

      ctx.save();
      [
        { label: "GATE", value: "HHG-26",         cx: CW / 2 - 110 * S },
        { label: "DATE", value: "28–31 OCT 2026",  cx: CW / 2 + 110 * S },
      ].forEach((f) => {
        ctx.fillStyle = COLORS.pink;
        ctx.font = `600 ${12 * S}px 'Inter', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ls(ctx, `${2 * S}px`);
        ctx.fillText(f.label, f.cx, GATE_Y);
        ls(ctx, "0px");
        ctx.fillStyle = COLORS.cream;
        ctx.font = `700 ${23 * S}px 'Space Grotesk', sans-serif`;
        ctx.fillText(f.value, f.cx, GATE_Y + 15 * S);
      });
      ctx.restore();

      // ── §11 BARCODE ──────────────────────────────────────────
      const BC_Y = GATE_Y + 56 * S;
      drawBarcode(
        ctx,
        PAD + 36 * S,
        BC_Y,
        CW - PAD * 2 - 72 * S,
        62 * S,
        COLORS.yellow
      );

      // ── §12 FOOTER ───────────────────────────────────────────
      const FTR_Y = BC_Y + 62 * S + 14 * S;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      ctx.fillStyle = COLORS.pink;
      ctx.font = `800 ${21 * S}px 'Space Grotesk', sans-serif`;
      ls(ctx, `${4 * S}px`);
      ctx.fillText("#FrameInGoa", CW / 2, FTR_Y);
      ls(ctx, "0px");

      ctx.fillStyle = COLORS.cream;
      ctx.globalAlpha = 0.32;
      ctx.font = `400 ${13 * S}px 'Inter', sans-serif`;
      ctx.fillText("Team OBOW Studio  ·  HH Goa 2026", CW / 2, FTR_Y + 28 * S);

      ctx.restore();

      onReady?.(canvas);
    }

    return (
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        style={{ width: "100%", height: "100%", imageRendering: "crisp-edges" }}
      />
    );
  }
);

export default BuilderIDCanvas;
