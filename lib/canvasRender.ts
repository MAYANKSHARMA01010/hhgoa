"use client";

// ─────────────────────────────────────────────────────────────
//  Canvas render utilities shared across all 3 frame formats
// ─────────────────────────────────────────────────────────────

export const COLORS = {
  greenDeep: "#063725",
  greenMid: "#0B6839",
  greenLight: "#1A8B4E",
  yellow: "#F5E642",
  pink: "#E8187A",
  cream: "#F5F0E8",
  white: "#FFFFFF",
};

/** Ensure a font face is loaded before drawing to canvas */
export async function loadFontFace(
  name: string,
  url: string,
  weight = "normal"
): Promise<void> {
  if (typeof document === "undefined") return;
  const font = new FontFace(name, `url(${url})`, { weight });
  await font.load();
  document.fonts.add(font);
}

/** Draw a rounded rectangle path */
export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Draw text curved along an arc */
export function drawArcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  font: string,
  color: string,
  letterSpacing = 0.18
) {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const chars = text.split("");
  const totalAngle = chars.length * letterSpacing;
  let angle = startAngle - totalAngle / 2;

  for (const char of chars) {
    ctx.save();
    ctx.translate(
      cx + radius * Math.cos(angle),
      cy + radius * Math.sin(angle)
    );
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
    angle += letterSpacing;
  }
  ctx.restore();
}

/** Draw a simple barcode pattern */
export function drawBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color = COLORS.cream,
  bgColor = "transparent"
) {
  if (bgColor !== "transparent") {
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, width, height);
  }

  const numBars = 52;
  const barUnit = width / numBars;
  const barWidths = [1, 2, 1, 3, 1, 2, 2, 1, 2, 3, 1, 1, 2, 1, 2, 1, 3, 2, 1, 2];

  ctx.fillStyle = color;
  let curX = x;

  for (let i = 0; i < numBars; i++) {
    const bw = barWidths[i % barWidths.length] * barUnit;
    if (i % 2 === 0) {
      ctx.fillRect(curX, y, Math.max(bw - 1, 1), height);
    }
    curX += bw;
  }
}

/** Draw a palm/wave ornament motif using canvas paths */
export function drawPalmOrnament(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.06;
  ctx.lineCap = "round";

  // Trunk
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.quadraticCurveTo(size * 0.1, size * 0.5, size * 0.3, 0);
  ctx.stroke();

  // Fronds
  const frondAngles = [-70, -45, -20, 5, 25];
  for (const angle of frondAngles) {
    ctx.save();
    ctx.translate(size * 0.3, 0);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.25, -size * 0.1, size * 0.45, size * 0.05);
    ctx.stroke();
    ctx.restore();
  }

  // Wave lines below
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, size + i * size * 0.12);
    ctx.quadraticCurveTo(0, size + i * size * 0.12 - size * 0.06, size * 0.2, size + i * size * 0.12);
    ctx.stroke();
  }

  ctx.restore();
}

/** Draw a sunrise gradient background */
export function drawSunriseGradient(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, COLORS.greenDeep);
  grad.addColorStop(0.5, COLORS.greenMid);
  grad.addColorStop(0.8, "#1A5C3A");
  grad.addColorStop(1, "#2A1535");
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);
}

/** Clip canvas drawing to a circle */
export function clipCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
}

/** Draw image centered & cropped into a rectangle (object-fit: cover) */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const srcW = "naturalWidth" in img ? img.naturalWidth : img.width;
  const srcH = "naturalHeight" in img ? img.naturalHeight : img.height;
  const scale = Math.max(dw / srcW, dh / srcH);
  const sw = dw / scale;
  const sh = dh / scale;
  const sx = (srcW - sw) / 2;
  const sy = (srcH - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

/** Wrap text to fit within maxWidth, return array of lines */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Create an HTMLImageElement from a data URL */
export function dataUrlToImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/** Convert canvas to a compressed Blob */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: "image/png" | "image/jpeg" = "image/jpeg",
  quality = 0.88
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      type,
      quality
    );
  });
}

/** Format bytes to human-readable string */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
