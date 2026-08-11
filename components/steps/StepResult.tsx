"use client";

import { useRef, useState, useEffect } from "react";
import { canvasToBlob, formatBytes } from "@/lib/canvasRender";
import { encodeShareState } from "@/lib/shareState";
import { apiClient, getBaseUrl } from "@/lib/api";

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
    let attempts = 0;
    const maxAttempts = 30;

    const interval = setInterval(async () => {
      attempts++;
      const handle = canvasRef.current;
      if (handle) {
        const dataUrl = handle.getDataUrl();
        if (dataUrl && dataUrl.length > 100) {
          clearInterval(interval);
          setPreviewUrl(dataUrl);

          // Compute file sizes
          const jpgBlob = await handle.toBlob("image/jpeg", 0.88);
          if (jpgBlob) setJpegSize(formatBytes(jpgBlob.size));
          const pngBlob = await handle.toBlob("image/png");
          if (pngBlob) setPngSize(formatBytes(pngBlob.size));
          return;
        }
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
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

      const origin = getBaseUrl();
      let generatedShareUrl = origin;

      try {
        const formData = new FormData();
        formData.append("file", blob, "hhgoa-frame.png");
        formData.append("name", name);
        formData.append("format", format);
        if (builderTitle) formData.append("builderTitle", builderTitle);

        const res = await apiClient.post("/api/share", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.data?.shareId) {
          generatedShareUrl = `${origin}/share/${res.data.shareId}`;
        }
      } catch {
        // Fallback: encode minimal state in URL
        const state = encodeShareState({
          blobUrl: "",
          name,
          format,
          builderTitle,
        });
        generatedShareUrl = `${origin}/share/${state}`;
      }

      setShareUrl(generatedShareUrl);

      // Open Twitter share modal
      const text = encodeURIComponent(
        `Just generated my official Hacker House Goa 2026 ${
          format === "builder-id" ? "Builder ID Card" : "Frame"
        }! 🌴✨\n\nBuild with Team OBOW at #FrameInGoa\n`
      );
      const url = encodeURIComponent(generatedShareUrl);
      window.open(
        `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      console.error("Share error:", err);
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Preview Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl p-3" style={{ background: "rgba(1,21,12,0.9)", border: "2px solid #FEE101" }}>
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            src={previewUrl}
            alt="Generated Frame Preview"
            className="w-full h-auto rounded-xl object-contain shadow-md"
            style={{ maxHeight: 480 }}
          />
        ) : (
          <div
            className="skeleton w-full rounded-xl flex items-center justify-center font-mono text-xs text-yellow-300"
            style={{ height: 360 }}
          >
            RENDERING HIGH-RES FRAME...
          </div>
        )}
      </div>

      {/* Format Switcher (JPEG / PNG) */}
      <div
        className="flex items-center justify-between p-3 rounded-xl"
        style={{ background: "rgba(1,21,12,0.8)", border: "1px solid rgba(254,225,1,0.2)" }}
      >
        <span className="font-mono text-xs font-bold text-yellow-300 uppercase tracking-wider">
          ✦ Select Export Format
        </span>
        <div className="flex gap-2">
          {(["jpeg", "png"] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setDownloadFormat(fmt)}
              className="px-3 py-1.5 rounded-lg font-mono text-xs font-bold uppercase transition-all"
              style={{
                background: downloadFormat === fmt ? "#FEE101" : "rgba(255,255,255,0.08)",
                color: downloadFormat === fmt ? "#011a0d" : "#ffffff",
                border: `1px solid ${downloadFormat === fmt ? "#E8187A" : "rgba(255,255,255,0.15)"}`,
              }}
            >
              {fmt.toUpperCase()}{" "}
              <span className="text-[10px] opacity-70">
                ({fmt === "jpeg" ? jpegSize : pngSize})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!previewUrl}
          className="flex-1 py-4 rounded-xl font-mono font-black text-sm text-[#011a0d] uppercase tracking-[0.18em] transition-all disabled:opacity-50"
          style={{
            background: "#FEE101",
            border: "2px solid #E8187A",
            boxShadow: "0 6px 20px rgba(254,225,1,0.3)",
          }}
        >
          ⬇ DOWNLOAD {downloadFormat.toUpperCase()}
        </button>

        <button
          type="button"
          onClick={handleShare}
          disabled={!previewUrl || sharing}
          className="flex-1 py-4 rounded-xl font-mono font-black text-sm text-white uppercase tracking-[0.18em] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #E8187A 0%, #a80f55 100%)",
            border: "2px solid #FEE101",
            boxShadow: "0 6px 20px rgba(232,24,122,0.35)",
          }}
        >
          {sharing ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              UPLOADING...
            </>
          ) : (
            <>✦ SHARE TO X (TWITTER)</>
          )}
        </button>
      </div>

      {shareUrl && (
        <div
          className="p-3 rounded-xl font-mono text-xs text-center break-all flex flex-col gap-1"
          style={{ background: "rgba(1,21,12,0.9)", border: "1px solid rgba(254,225,1,0.3)" }}
        >
          <span className="text-yellow-300 font-bold uppercase tracking-widest text-[10px]">
            ✓ SHAREABLE LINK GENERATED:
          </span>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 underline font-bold"
          >
            {shareUrl}
          </a>
        </div>
      )}

      {/* Reset button */}
      <button
        type="button"
        onClick={onReset}
        className="w-full py-2.5 font-mono text-xs text-white/50 hover:text-yellow-300 uppercase tracking-widest transition-colors text-center"
      >
        ← Create Another Frame
      </button>
    </div>
  );
}
