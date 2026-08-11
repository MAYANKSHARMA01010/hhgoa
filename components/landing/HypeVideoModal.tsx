"use client";

import { useEffect } from "react";

interface HypeVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HypeVideoModal({ isOpen, onClose }: HypeVideoModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(1,26,13,0.92)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full"
        style={{ maxWidth: "min(90vw, 900px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 font-mono text-white/60 hover:text-white transition-colors"
          style={{ fontSize: "0.85rem", letterSpacing: "0.1em", background: "none", border: "none", cursor: "pointer" }}
        >
          [ESC] CLOSE
        </button>

        {/* Video */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(254,225,1,0.2)", aspectRatio: "16/9" }}
        >
          <video
            src="/assets/Prehype.mp4"
            controls
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={{ background: "#011a0d" }}
          >
            Your browser does not support video.
          </video>
        </div>

        {/* Label */}
        <p
          className="text-center font-mono mt-4"
          style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", letterSpacing: "0.15em" }}
        >
          #FRAMEINGOA — PREHYPE REEL
        </p>
      </div>
    </div>
  );
}
