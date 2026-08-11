"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import {
  COLORS,
  drawBarcode,
  drawPalmOrnament,
  dataUrlToImage,
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

const W = 1080;
const H = 1350;
const DPR = 2;
const CW = W * DPR;
const CH = H * DPR;

const BuilderIDCanvas = forwardRef<CanvasHandle, BuilderIDCanvasProps>(
  function BuilderIDCanvas({ data, onReady }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      getDataUrl: () => canvasRef.current?.toDataURL("image/jpeg", 0.92) ?? "",
      toBlob: (type = "image/jpeg", quality = 0.92) =>
        new Promise((resolve) => canvasRef.current?.toBlob(resolve, type, quality) ?? resolve(null)),
    }));

    useEffect(() => {
      if (!data.photoDataUrl) return;
      drawCard();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    async function drawCard() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;

      // Scale for DPR
      const sc = DPR;

      // ── Background ──────────────────────────────────────────
      const bg = ctx.createLinearGradient(0, 0, CW, CH);
      bg.addColorStop(0, "#063725");
      bg.addColorStop(0.4, "#0B5830");
      bg.addColorStop(1, "#04231A");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CW, CH);

      // Noise dots for texture
      ctx.save();
      ctx.globalAlpha = 0.03;
      for (let i = 0; i < 800; i++) {
        ctx.fillStyle = "#F5F0E8";
        ctx.fillRect(
          Math.random() * CW,
          Math.random() * CH,
          2,
          2
        );
      }
      ctx.restore();

      // ── Perforated border ───────────────────────────────────
      const margin = 32 * sc;
      ctx.save();
      ctx.strokeStyle = "rgba(245,230,66,0.3)";
      ctx.lineWidth = 2 * sc;
      ctx.setLineDash([12 * sc, 8 * sc]);
      ctx.strokeRect(margin, margin, CW - margin * 2, CH - margin * 2);
      ctx.restore();

      // ── Header section ──────────────────────────────────────
      const headerH = 180 * sc;
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(margin, margin, CW - margin * 2, headerH);

      // "HACKER HOUSE" title
      ctx.fillStyle = COLORS.yellow;
      ctx.font = `900 ${68 * sc}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = `${4 * sc}px`;
      ctx.fillText("HACKER HOUSE", CW / 2, margin + headerH * 0.36);
      ctx.letterSpacing = "0px";

      // "G O A  2 0 2 6" subtitle
      ctx.fillStyle = COLORS.cream;
      ctx.globalAlpha = 0.85;
      ctx.font = `400 ${30 * sc}px 'Space Grotesk', sans-serif`;
      ctx.letterSpacing = `${10 * sc}px`;
      ctx.fillText("G O A   2 0 2 6", CW / 2, margin + headerH * 0.72);
      ctx.letterSpacing = "0px";
      ctx.globalAlpha = 1;

      // Pink accent line under header
      ctx.fillStyle = COLORS.pink;
      ctx.fillRect(margin, margin + headerH, CW - margin * 2, 3 * sc);

      // ── Photo + details section ─────────────────────────────
      const sectionTop = margin + headerH + 3 * sc;
      const sectionH = 520 * sc;

      const photoSize = 220 * sc;
      const photoX = margin + 40 * sc;
      const photoY = sectionTop + (sectionH - photoSize) / 2;

      // Photo (rounded square)
      const img = await dataUrlToImage(data.photoDataUrl);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoSize, photoSize, 20 * sc);
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
      ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoSize, photoSize);
      ctx.restore();

      // Photo border
      ctx.save();
      ctx.strokeStyle = COLORS.yellow;
      ctx.lineWidth = 3 * sc;
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoSize, photoSize, 20 * sc);
      ctx.stroke();
      ctx.restore();

      // Divider line between photo and text
      const divX = photoX + photoSize + 40 * sc;
      ctx.save();
      ctx.strokeStyle = "rgba(245,230,66,0.2)";
      ctx.lineWidth = 1 * sc;
      ctx.beginPath();
      ctx.moveTo(divX, sectionTop + 30 * sc);
      ctx.lineTo(divX, sectionTop + sectionH - 30 * sc);
      ctx.stroke();
      ctx.restore();

      // Passenger details
      const textX = divX + 40 * sc;
      const textMaxW = CW - margin - textX - 20 * sc;
      const labelSize = 16 * sc;
      const valueSize = 28 * sc;
      const lineGap = 68 * sc;
      let textY = sectionTop + 70 * sc;

      const fields: { label: string; value: string; accent?: boolean }[] = [
        { label: "PASSENGER", value: data.name, accent: false },
        { label: "BUILDER CLASS", value: data.builderTitle, accent: true },
        { label: "ROLE / STACK", value: data.role },
        { label: "X HANDLE", value: data.handle ? `@${data.handle}` : "—" },
      ];

      for (const field of fields) {
        ctx.save();
        ctx.fillStyle = COLORS.pink;
        ctx.font = `600 ${labelSize}px 'Inter', sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.letterSpacing = `${2 * sc}px`;
        ctx.fillText(field.label, textX, textY);

        ctx.fillStyle = field.accent ? COLORS.yellow : COLORS.cream;
        ctx.font = `700 ${valueSize}px 'Space Grotesk', sans-serif`;
        ctx.letterSpacing = "0px";

        // Truncate if needed
        let val = field.value;
        while (ctx.measureText(val).width > textMaxW && val.length > 3) {
          val = val.slice(0, -1);
        }
        if (val !== field.value) val += "…";
        ctx.fillText(val, textX, textY + labelSize + 6 * sc);
        ctx.restore();

        textY += lineGap;
      }

      // ── Horizontal divider with circles (boarding-pass stub) ──
      const stubY = sectionTop + sectionH;
      const circleR = 28 * sc;

      // Left circle cutout
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(0, stubY, circleR, 0, Math.PI * 2);
      ctx.fill();
      // Right circle cutout
      ctx.beginPath();
      ctx.arc(CW, stubY, circleR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Dashed line
      ctx.save();
      ctx.strokeStyle = "rgba(245,230,66,0.35)";
      ctx.lineWidth = 2 * sc;
      ctx.setLineDash([10 * sc, 8 * sc]);
      ctx.beginPath();
      ctx.moveTo(circleR, stubY);
      ctx.lineTo(CW - circleR, stubY);
      ctx.stroke();
      ctx.restore();

      // ── Flight info row ─────────────────────────────────────
      const flightY = stubY + 20 * sc;
      const flightH = 160 * sc;

      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(margin, flightY, CW - margin * 2, flightH);
      ctx.restore();

      // FROM → TO
      ctx.save();
      ctx.fillStyle = COLORS.cream;
      ctx.globalAlpha = 0.6;
      ctx.font = `500 ${18 * sc}px 'Inter', sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.letterSpacing = `${2 * sc}px`;
      ctx.fillText("FROM", margin + 40 * sc, flightY + 24 * sc);
      ctx.textAlign = "right";
      ctx.fillText("TO", CW - margin - 40 * sc, flightY + 24 * sc);
      ctx.globalAlpha = 1;
      ctx.letterSpacing = "0px";

      ctx.fillStyle = COLORS.yellow;
      ctx.font = `900 ${42 * sc}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText("BLR", margin + 40 * sc, flightY + 44 * sc);
      ctx.textAlign = "right";
      ctx.fillText("GOA", CW - margin - 40 * sc, flightY + 44 * sc);

      // Arrow
      ctx.fillStyle = COLORS.cream;
      ctx.font = `${36 * sc}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("→", CW / 2, flightY + 50 * sc);
      ctx.restore();

      // Seat / Gate / Date
      const infoY = flightY + flightH - 30 * sc;
      const infos = [
        { label: "SEAT", value: data.seat },
        { label: "GATE", value: "HHG-26" },
        { label: "DATE", value: "28-31 OCT 2026" },
      ];
      const colW = (CW - margin * 2) / infos.length;

      for (let i = 0; i < infos.length; i++) {
        const ix = margin + i * colW + colW / 2;
        ctx.save();
        ctx.fillStyle = COLORS.pink;
        ctx.font = `600 ${16 * sc}px 'Inter', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.letterSpacing = `${2 * sc}px`;
        ctx.fillText(infos[i].label, ix, infoY - 24 * sc);
        ctx.fillStyle = COLORS.cream;
        ctx.font = `700 ${24 * sc}px 'Space Grotesk', sans-serif`;
        ctx.letterSpacing = "0px";
        ctx.fillText(infos[i].value, ix, infoY);
        ctx.restore();
      }

      // ── Barcode section ─────────────────────────────────────
      const barcodeY = flightY + flightH + 20 * sc;
      const barcodeH = CH - barcodeY - margin - 60 * sc;
      const barcodeW = (CW - margin * 2) * 0.65;
      const barcodeX = margin + 40 * sc;

      drawBarcode(ctx, barcodeX, barcodeY, barcodeW, barcodeH, COLORS.cream);

      // QR placeholder (concentric squares)
      const qrSize = barcodeH;
      const qrX = CW - margin - 40 * sc - qrSize;
      ctx.save();
      ctx.strokeStyle = COLORS.cream;
      ctx.lineWidth = 3 * sc;
      for (let i = 0; i < 4; i++) {
        const s = qrSize - i * qrSize * 0.22;
        ctx.strokeRect(
          qrX + (qrSize - s) / 2,
          barcodeY + (qrSize - s) / 2,
          s,
          s
        );
      }
      ctx.fillStyle = COLORS.cream;
      ctx.font = `${12 * sc}px 'Inter', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("QR", qrX + qrSize / 2, barcodeY + qrSize / 2);
      ctx.restore();

      // ── Footer ──────────────────────────────────────────────
      const footerY = CH - margin - 50 * sc;

      // Palm ornaments
      ctx.globalAlpha = 0.25;
      drawPalmOrnament(ctx, margin + 10 * sc, footerY, 30 * sc, COLORS.yellow);
      ctx.globalAlpha = 1;

      ctx.save();
      ctx.fillStyle = COLORS.pink;
      ctx.font = `700 ${22 * sc}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("#FrameInGoa", CW / 2, footerY + 26 * sc);

      ctx.fillStyle = COLORS.cream;
      ctx.globalAlpha = 0.5;
      ctx.font = `400 ${16 * sc}px 'Inter', sans-serif`;
      ctx.fillText("Team OBOW Studio · HH Goa 2026", CW / 2, footerY + 50 * sc);
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
