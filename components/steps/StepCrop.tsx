"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Point, Area } from "react-easy-crop";

// Dynamic import for react-easy-crop — use `any` to avoid strict required-props mismatch
// (library defaultProps cover all "required" fields that have defaults)
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
    <div className="w-full flex flex-col gap-4">
      <p className="text-cream/70 text-sm text-center">{label}</p>

      {/* Cropper container */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ height: 320, background: "#063725" }}
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
              border: "2px solid #F5E642",
              boxShadow: "0 0 0 9999px rgba(6,55,37,0.7)",
            },
          }}
        />
      </div>

      {/* Zoom slider */}
      <div className="flex items-center gap-3">
        <span className="text-cream/50 text-xs">🔍</span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1 accent-yellow-brand"
        />
        <span className="text-cream/50 text-xs">+</span>
      </div>

      <p className="text-cream/40 text-xs text-center">
        Pinch or scroll to zoom · Drag to reposition
      </p>

      <button
        onClick={handleConfirm}
        className="w-full py-3.5 rounded-xl font-bold text-green-deep btn-press"
        style={{ background: "#F5E642" }}
      >
        Crop & Continue →
      </button>
    </div>
  );
}
