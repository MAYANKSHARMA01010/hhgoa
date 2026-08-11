"use client";

import { memo } from "react";
import { Dithering } from "@paper-design/shaders-react";
import type { DitheringShape, DitheringType } from "@paper-design/shaders";

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
  type = "4x4",
  pxSize = 5,
}: DitheringBackgroundProps) {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ backgroundColor }}
    >
      <MemoizedDithering
        colorBack={colorBack}
        colorFront={colorFront}
        speed={speed}
        shape={shape}
        type={type}
        pxSize={pxSize}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
