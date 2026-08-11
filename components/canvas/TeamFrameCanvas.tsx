"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { COLORS, dataUrlToImage } from "@/lib/canvasRender";
import type { CanvasHandle } from "@/lib/types";

export interface TeamMember {
  photoDataUrl: string;
  name: string;
  role: string;
}

interface TeamFrameCanvasProps {
  members: TeamMember[];
  onReady?: (canvas: HTMLCanvasElement) => void;
}

export type { CanvasHandle };

const W = 1200;
const H = 630;
const DPR = 2;
const CW = W * DPR;
const CH = H * DPR;

const TeamFrameCanvas = forwardRef<CanvasHandle, TeamFrameCanvasProps>(
  function TeamFrameCanvas({ members, onReady }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      getDataUrl: () => canvasRef.current?.toDataURL("image/jpeg", 0.92) ?? "",
      toBlob: (type = "image/jpeg", quality = 0.92) =>
        new Promise((resolve) => canvasRef.current?.toBlob(resolve, type, quality) ?? resolve(null)),
    }));

    useEffect(() => {
      if (!members.length) return;
      drawFrame();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [members]);

    async function drawFrame() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const sc = DPR;

      // ── Background ──────────────────────────────────────────
      const bg = ctx.createLinearGradient(0, 0, CW, CH);
      bg.addColorStop(0, "#04231A");
      bg.addColorStop(0.5, "#063725");
      bg.addColorStop(1, "#0B4A2D");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CW, CH);

      // Grid pattern background
      ctx.save();
      ctx.globalAlpha = 0.04;
      ctx.strokeStyle = COLORS.yellow;
      ctx.lineWidth = 1;
      const gridSize = 40 * sc;
      for (let x = 0; x < CW; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CH);
        ctx.stroke();
      }
      for (let y = 0; y < CH; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CW, y);
        ctx.stroke();
      }
      ctx.restore();

      // ── Header bar ──────────────────────────────────────────
      const headerH = 130 * sc;
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, CW, headerH);

      // Accent line
      ctx.fillStyle = COLORS.pink;
      ctx.fillRect(0, headerH - 3 * sc, CW, 3 * sc);

      // HH Goa logo text (left)
      ctx.fillStyle = COLORS.yellow;
      ctx.font = `900 ${44 * sc}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("HACKER HOUSE", 50 * sc, headerH * 0.42);

      ctx.fillStyle = COLORS.cream;
      ctx.globalAlpha = 0.75;
      ctx.font = `400 ${22 * sc}px 'Space Grotesk', sans-serif`;
      if ("letterSpacing" in ctx) {
        (ctx as unknown as { letterSpacing: string }).letterSpacing = `${6 * sc}px`;
      }
      ctx.fillText("G O A  2 0 2 6", 52 * sc, headerH * 0.72);
      if ("letterSpacing" in ctx) {
        (ctx as unknown as { letterSpacing: string }).letterSpacing = "0px";
      }
      ctx.globalAlpha = 1;

      // "TEAM AT HH GOA" right side
      ctx.fillStyle = COLORS.pink;
      ctx.font = `700 ${20 * sc}px 'Inter', sans-serif`;
      ctx.textAlign = "right";
      if ("letterSpacing" in ctx) {
        (ctx as unknown as { letterSpacing: string }).letterSpacing = `${3 * sc}px`;
      }
      ctx.fillText("TEAM AT HH GOA 2026", CW - 50 * sc, headerH * 0.42);
      if ("letterSpacing" in ctx) {
        (ctx as unknown as { letterSpacing: string }).letterSpacing = "0px";
      }

      // Event date
      ctx.fillStyle = COLORS.cream;
      ctx.globalAlpha = 0.6;
      ctx.font = `400 ${18 * sc}px 'Inter', sans-serif`;
      ctx.fillText("28–31 OCT · GOA, INDIA", CW - 50 * sc, headerH * 0.72);
      ctx.restore();

      // ── Member photos ────────────────────────────────────────
      const n = members.length;
      const totalPhotosW = CW;
      const photoPadding = 60 * sc;
      const photoAreaTop = headerH + 30 * sc;
      const photoAreaH = CH - headerH - 100 * sc;
      const avatarR = Math.min(
        (photoAreaH - 80 * sc) / 2,
        ((totalPhotosW - photoPadding * (n + 1)) / n) / 2
      );
      const slotW = (CW - photoPadding * (n + 1)) / n;
      const avatarY = photoAreaTop + (photoAreaH - avatarR * 2 - 60 * sc) / 2 + avatarR;

      for (let i = 0; i < n; i++) {
        const member = members[i];
        const slotX = photoPadding + i * (slotW + photoPadding) + slotW / 2;

        // Draw avatar circle
        const img = await dataUrlToImage(member.photoDataUrl);

        ctx.save();
        ctx.beginPath();
        ctx.arc(slotX, avatarY, avatarR, 0, Math.PI * 2);
        ctx.clip();

        const imgAspect = img.naturalWidth / img.naturalHeight;
        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
        if (imgAspect > 1) {
          sw = img.naturalHeight;
          sx = (img.naturalWidth - sw) / 2;
        } else {
          sh = img.naturalWidth;
          sy = (img.naturalHeight - sh) / 2;
        }
        ctx.drawImage(
          img,
          sx, sy, sw, sh,
          slotX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2
        );
        ctx.restore();

        // Avatar border
        ctx.save();
        const hue = i % 2 === 0 ? COLORS.yellow : COLORS.pink;
        ctx.strokeStyle = hue;
        ctx.lineWidth = 4 * sc;
        ctx.beginPath();
        ctx.arc(slotX, avatarY, avatarR + 2 * sc, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Name
        ctx.save();
        ctx.fillStyle = COLORS.cream;
        ctx.font = `700 ${22 * sc}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(
          member.name.length > 16
            ? member.name.slice(0, 14) + "…"
            : member.name,
          slotX,
          avatarY + avatarR + 16 * sc
        );

        // Role
        ctx.fillStyle = COLORS.pink;
        ctx.font = `500 ${16 * sc}px 'Inter', sans-serif`;
        ctx.fillText(
          member.role,
          slotX,
          avatarY + avatarR + 44 * sc
        );
        ctx.restore();

        // Separator line between members
        if (i < n - 1) {
          const lineX = slotX + slotW / 2 + photoPadding / 2;
          ctx.save();
          ctx.strokeStyle = "rgba(245,230,66,0.2)";
          ctx.lineWidth = 1 * sc;
          ctx.setLineDash([6 * sc, 6 * sc]);
          ctx.beginPath();
          ctx.moveTo(lineX, photoAreaTop + 20 * sc);
          ctx.lineTo(lineX, CH - 80 * sc);
          ctx.stroke();
          ctx.restore();
        }
      }

      // ── Bottom strip ─────────────────────────────────────────
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(0, CH - 72 * sc, CW, 72 * sc);

      ctx.fillStyle = COLORS.pink;
      ctx.font = `700 ${22 * sc}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("#FrameInGoa", CW / 2, CH - 36 * sc);

      ctx.fillStyle = COLORS.cream;
      ctx.globalAlpha = 0.5;
      ctx.font = `400 ${15 * sc}px 'Inter', sans-serif`;
      ctx.textAlign = "right";
      ctx.fillText("Team OBOW Studio · HH Goa 2026", CW - 40 * sc, CH - 36 * sc);
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

export default TeamFrameCanvas;
