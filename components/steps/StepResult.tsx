"use client";

import { useRef, useState, useEffect } from "react";
import { canvasToBlob, formatBytes } from "@/lib/canvasRender";
import { encodeShareState } from "@/lib/shareState";

interface StepResultProps {
  canvasRef: React.RefObject<{
    getCanvas: () => HTMLCanvasElement | null;
    getDataUrl: () => string;
    toBlob: (
      type?: "image/png" | "image/jpeg",
      quality?: number
    ) => Promise<Blob | null>;
  } | null>;
  format: "profile" | "builder-id" | "team";
  name?: string;
  builderTitle?: string;
  onReset: () => void;
}

export default function StepResult({
  canvasRef,
  format,
  name = "Builder",
  builderTitle = "",
  onReset,
}: StepResultProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [jpegSize, setJpegSize] = useState<string>("");
  const [pngSize, setPngSize] = useState<string>("");
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [downloadFormat, setDownloadFormat] = useState<"jpeg" | "png">("jpeg");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Small delay to ensure canvas is rendered
    const t = setTimeout(async () => {
      const handle = canvasRef.current;
      if (!handle) return;
      const dataUrl = handle.getDataUrl();
      setPreviewUrl(dataUrl);

      // Compute sizes
      const jpgBlob = await handle.toBlob("image/jpeg", 0.88);
      if (jpgBlob) setJpegSize(formatBytes(jpgBlob.size));
      const pngBlob = await handle.toBlob("image/png");
      if (pngBlob) setPngSize(formatBytes(pngBlob.size));
    }, 200);
    return () => clearTimeout(t);
  }, [canvasRef]);

  async function handleDownload() {
    const handle = canvasRef.current;
    if (!handle) return;

    const type = downloadFormat === "png" ? "image/png" : "image/jpeg";
    const quality = downloadFormat === "png" ? 1 : 0.88;
    const blob = await handle.toBlob(type, quality);
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hhgoa-2026-${format}-${name.toLowerCase().replace(/\s+/g, "-")}.${downloadFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    setSharing(true);
    try {
      const handle = canvasRef.current;
      if (!handle) return;

      const blob = await handle.toBlob("image/png");
      if (!blob) return;

      // Upload to blob storage
      let generatedShareUrl = window.location.origin;
      try {
        const formData = new FormData();
        formData.append("file", blob, "hhgoa-frame.png");
        formData.append("name", name);
        formData.append("format", format);
        if (builderTitle) formData.append("builderTitle", builderTitle);

        const res = await fetch("/api/share", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const { shareId } = await res.json();
          generatedShareUrl = `${window.location.origin}/share/${shareId}`;
        }
      } catch {
        // Fallback: encode minimal state in URL
        const state = encodeShareState({
          blobUrl: "",
          name,
          format,
          builderTitle,
        });
        generatedShareUrl = `${window.location.origin}/share/${state}`;
      }

      setShareUrl(generatedShareUrl);

      const text = `Just built my Hacker House Goa 2026 pass ⚡ Generate yours in seconds → ${generatedShareUrl} #FrameInGoa`;

      // Try native share with file attachment (works on iOS/Android)
      if (typeof navigator.share === "function") {
        try {
          const file = new File([blob], "hhgoa-frame.png", { type: "image/png" });
          await navigator.share({
            files: [file],
            title: "HH Goa 2026 Builder Pass",
            text,
          });
          return;
        } catch {
          // User cancelled or not supported — fall through
        }
      }

      // Fallback: Twitter intent
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(tweetUrl, "_blank", "noopener,noreferrer");
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Preview */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: "#0B6839" }}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            src={previewUrl}
            alt="Your HH Goa 2026 frame"
            className="w-full h-auto block"
            style={{ imageRendering: "crisp-edges" }}
          />
        ) : (
          <div className="skeleton w-full" style={{ height: 320 }} />
        )}
      </div>

      {/* Download format toggle */}
      <div className="flex gap-2">
        {(["jpeg", "png"] as const).map((fmt) => (
          <button
            key={fmt}
            onClick={() => setDownloadFormat(fmt)}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{
              background:
                downloadFormat === fmt ? "rgba(245,230,66,0.15)" : "rgba(11,104,57,0.3)",
              color: downloadFormat === fmt ? "#F5E642" : "#F5F0E8",
              border: `1px solid ${downloadFormat === fmt ? "rgba(245,230,66,0.4)" : "rgba(245,230,66,0.1)"}`,
            }}
          >
            {fmt.toUpperCase()}
            {fmt === "jpeg" && jpegSize && (
              <span className="ml-1 opacity-60">· {jpegSize}</span>
            )}
            {fmt === "png" && pngSize && (
              <span className="ml-1 opacity-60">· {pngSize}</span>
            )}
          </button>
        ))}
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="w-full py-4 rounded-xl font-bold text-lg text-green-deep btn-press flex items-center justify-center gap-2"
        style={{ background: "#F5E642" }}
      >
        ⬇️ Download {downloadFormat.toUpperCase()}
      </button>

      {/* Share button */}
      <button
        onClick={handleShare}
        disabled={sharing}
        className="w-full py-4 rounded-xl font-bold text-lg btn-press flex items-center justify-center gap-2 disabled:opacity-60"
        style={{
          background: "rgba(232,24,122,0.2)",
          color: "#E8187A",
          border: "1px solid rgba(232,24,122,0.4)",
        }}
      >
        {sharing ? (
          <>
            <span className="animate-spin">⚡</span>
            Uploading for share…
          </>
        ) : (
          <>𝕏 Share to X</>
        )}
      </button>

      {shareUrl && (
        <div
          className="rounded-xl p-3 text-xs"
          style={{ background: "rgba(11,104,57,0.3)", border: "1px solid rgba(245,230,66,0.15)" }}
        >
          <p className="text-cream/60 mb-1">Share link (copy for desktop):</p>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-brand underline break-all"
          >
            {shareUrl}
          </a>
        </div>
      )}

      {/* Make another */}
      <button
        onClick={onReset}
        className="w-full py-3 rounded-xl text-cream/60 text-sm font-medium hover:text-cream transition-colors"
        style={{ border: "1px solid rgba(245,240,232,0.1)" }}
      >
        ↩ Generate Another
      </button>
    </div>
  );
}
