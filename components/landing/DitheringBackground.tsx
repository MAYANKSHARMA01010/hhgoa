"use client";

import { memo } from "react";
import { Dithering } from "@paper-design/shaders-react";

type DitheringShape = "simplex" | "wave" | "sphere" | "torus" | "twist" | string;
type DitheringType = "4x4" | "8x8" | "random" | string;

const MemoizedDithering = memo(Dithering);

interface DitheringBackgroundProps {
  colorBack?: string;
  colorFront?: string;
  backgroundColor?: string;
  speed?: number;
  shape?: DitheringShape;
  type?: DitheringType;
  pxSize?: number;
  scale?: number;
}

export default function DitheringBackground({
  colorBack = "#02683400",
  colorFront = "#FEE101",
  backgroundColor = "#026834",
  speed = 0.25,
  shape = "wave",
  type = "8x8",
  pxSize = 3,
  scale = 1,
}: DitheringBackgroundProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ backgroundColor }}
    >
      <MemoizedDithering
        colorBack={colorBack}
        colorFront={colorFront}
        speed={speed}
        shape={shape as any}
        type={type as any}
        pxSize={pxSize}
        scale={scale}
      />
    </div>
  );
}
