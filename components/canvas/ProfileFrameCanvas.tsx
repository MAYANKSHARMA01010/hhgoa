"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import {
  COLORS,
  drawArcText,
  drawPalmOrnament,
  drawSunriseGradient,
  dataUrlToImage,
} from "@/lib/canvasRender";
import type { CanvasHandle } from "@/lib/types";

interface ProfileFrameCanvasProps {
  photoDataUrl: string;
  circular?: boolean;
  onReady?: (canvas: HTMLCanvasElement) => void;
}

export type { CanvasHandle };

const SIZE = 1080;
const DPR = 2;
const CANVAS_SIZE = SIZE * DPR;

const ProfileFrameCanvas = forwardRef<CanvasHandle, ProfileFrameCanvasProps>(
  function ProfileFrameCanvas({ photoDataUrl, circular = false, onReady }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      getDataUrl: () => canvasRef.current?.toDataURL("image/png") ?? "",
      toBlob: (type = "image/png", quality = 0.92) =>
        new Promise((resolve) => canvasRef.current?.toBlob(resolve, type, quality) ?? resolve(null)),
    }));

    useEffect(() => {
      if (!photoDataUrl) return;
      drawFrame();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photoDataUrl, circular]);

    async function drawFrame() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d")!;
      const S = CANVAS_SIZE;

      // ── Background ─────────────────────────────────────────
      drawSunriseGradient(ctx, 0, 0, S, S);

      // ── Photo (fill square, optionally clipped to circle) ──
      const img = await dataUrlToImage(photoDataUrl);
      const padding = S * 0.08;
      const photoSize = S - padding * 2;
      const photoX = padding;
      const photoY = padding;

      ctx.save();
      if (circular) {
        ctx.beginPath();
        ctx.arc(S / 2, S / 2, photoSize / 2, 0, Math.PI * 2);
        ctx.clip();
      } else {
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoSize, photoSize, S * 0.04);
        ctx.clip();
      }
      // Cover-fit the image
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (imgAspect > 1) {
        sw = img.naturalHeight;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth;
        sy = (img.naturalHeight - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoSize, photoSize);
      ctx.restore();

      // ── Ring border ─────────────────────────────────────────
      const ringX = S / 2;
      const ringY = S / 2;
      const ringR = (photoSize / 2) + S * 0.03;

      // Outer ring: yellow
      ctx.save();
      ctx.strokeStyle = COLORS.yellow;
      ctx.lineWidth = S * 0.018;
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2);
      ctx.stroke();

      // Inner accent ring: green light
      ctx.strokeStyle = COLORS.greenLight;
      ctx.lineWidth = S * 0.008;
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringR - S * 0.022, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // ── Arc text: "HACKER HOUSE GOA 2026" ─────────────────
      const arcR = ringR + S * 0.012;
      drawArcText(
        ctx,
        "★  HACKER HOUSE GOA 2026  ★",
        ringX,
        ringY,
        arcR,
        -Math.PI * 0.85,
        `bold ${S * 0.028}px 'Space Grotesk', sans-serif`,
        COLORS.yellow,
        0.165
      );

      // ── Pink "गोवा" badge (bottom-left) ─────────────────────
      const badgeX = S * 0.1;
      const badgeY = S * 0.83;
      const badgeW = S * 0.24;
      const badgeH = S * 0.08;
      ctx.save();
      ctx.fillStyle = COLORS.pink;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, S * 0.012);
      ctx.fill();
      ctx.fillStyle = COLORS.white;
      ctx.font = `bold ${S * 0.038}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("गोवा", badgeX + badgeW / 2, badgeY + badgeH / 2);
      ctx.restore();

      // ── Corner palm ornaments ───────────────────────────────
      ctx.globalAlpha = 0.35;
      drawPalmOrnament(ctx, S * 0.04, S * 0.04, S * 0.07, COLORS.yellow);
      ctx.save();
      ctx.translate(S * 0.96, S * 0.04);
      ctx.scale(-1, 1);
      drawPalmOrnament(ctx, 0, 0, S * 0.07, COLORS.yellow);
      ctx.restore();
      ctx.globalAlpha = 1;

      // ── Bottom watermark ─────────────────────────────────────
      ctx.save();
      ctx.fillStyle = COLORS.cream;
      ctx.globalAlpha = 0.6;
      ctx.font = `${S * 0.018}px 'Inter', sans-serif`;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText("#FrameInGoa · Team OBOW Studio", S - S * 0.04, S - S * 0.03);
      ctx.restore();

      onReady?.(canvas);
    }

    return (
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{ width: "100%", height: "100%", imageRendering: "crisp-edges" }}
      />
    );
  }
);

export default ProfileFrameCanvas;
