"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Point, Area } from "react-easy-crop";

// Dynamic import for react-easy-crop
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Cropper = dynamic(() => import("react-easy-crop"), {
  ssr: false,
  loading: () => (
    <div
      className="skeleton w-full rounded-2xl"
      style={{ height: 320 }}
    />
  ),
}) as React.ComponentType<{
  image: string;
  crop: Point;
  zoom: number;
  rotation: number;
  minZoom: number;
  maxZoom: number;
  zoomSpeed: number;
  keyboardStep: number;
  aspect: number;
  onCropChange: (location: Point) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  cropShape: "rect" | "round";
  showGrid: boolean;
  restrictPosition: boolean;
  classes: Record<string, never>;
  mediaProps: Record<string, never>;
  cropperProps: Record<string, never>;
  style: {
    containerStyle?: React.CSSProperties;
    cropAreaStyle?: React.CSSProperties;
  };
}>;

type Format = "profile" | "builder-id" | "team";

const ASPECT_RATIOS: Record<Format, number> = {
  profile: 1,
  "builder-id": 4 / 5,
  team: 1, // individual team member photos cropped 1:1
};

interface StepCropProps {
  photoDataUrl: string;
  format: Format;
  onCropped: (croppedDataUrl: string) => void;
  label?: string;
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<string> {
  const img = new Image();
  img.src = imageSrc;
  await new Promise<void>((res) => {
    img.onload = () => res();
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    img,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg", 0.95);
}

export default function StepCrop({
  photoDataUrl,
  format,
  onCropped,
  label = "Adjust your photo",
}: StepCropProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_: Area, pixelArea: Area) => {
      setCroppedAreaPixels(pixelArea);
    },
    []
  );

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    const cropped = await getCroppedImg(photoDataUrl, croppedAreaPixels);
    onCropped(cropped);
  };

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      <div className="text-center">
        <span className="inline-block px-3 py-0.5 rounded-full font-mono font-bold text-[11px] text-pink-400 tracking-[0.25em] uppercase mb-1" style={{ background: "rgba(232,24,122,0.15)", border: "1px solid rgba(232,24,122,0.3)" }}>
          ✦ STEP 2: CROP & POSITION ✦
        </span>
        <p className="font-mono text-xs text-white/70">{label}</p>
      </div>

      {/* Cropper container */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ height: 320, background: "#011a0d", border: "2px solid rgba(254,225,1,0.3)" }}
      >
        <Cropper
          image={photoDataUrl}
          crop={crop}
          zoom={zoom}
          rotation={0}
          minZoom={1}
          maxZoom={3}
          zoomSpeed={0.1}
          keyboardStep={1}
          aspect={ASPECT_RATIOS[format]}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          cropShape={format === "profile" ? "round" : "rect"}
          showGrid={false}
          restrictPosition={true}
          classes={{}}
          mediaProps={{}}
          cropperProps={{}}
          style={{
            containerStyle: { borderRadius: 16 },
            cropAreaStyle: {
              border: "2.5px solid #FEE101",
              boxShadow: "0 0 0 9999px rgba(1,21,12,0.75), 0 0 15px rgba(254,225,1,0.4)",
            },
          }}
        />
      </div>

      {/* Zoom slider */}
      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(1,21,12,0.8)", border: "1px solid rgba(254,225,1,0.2)" }}>
        <span className="text-yellow-300 font-mono text-xs font-bold">🔍 ZOOM</span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1 accent-yellow-300 cursor-pointer"
        />
        <span className="text-yellow-300 font-mono text-xs font-bold">{(zoom * 100).toFixed(0)}%</span>
      </div>

      <p className="font-mono text-[11px] text-white/40 text-center uppercase tracking-widest">
        Drag to position · Scroll or pinch to zoom
      </p>

      <button
        type="button"
        onClick={handleConfirm}
        className="w-full py-4 rounded-xl font-mono font-black text-sm text-[#011a0d] uppercase tracking-[0.2em] transition-all"
        style={{
          background: "#FEE101",
          border: "2px solid #E8187A",
          outline: "3px dotted #E8187A",
          outlineOffset: "3px",
          boxShadow: "0 8px 25px rgba(254,225,1,0.35)",
        }}
      >
        + CONFIRM CROP & CONTINUE →
      </button>
    </div>
  );
}
