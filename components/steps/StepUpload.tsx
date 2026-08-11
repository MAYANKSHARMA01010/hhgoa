"use client";

import { useRef, useState, useCallback } from "react";
import { isHeicFile, transcodeHeic } from "@/lib/heicTranscode";
import { correctOrientation } from "@/lib/exifRotate";

interface StepUploadProps {
  onPhotoReady: (dataUrl: string, fileName: string) => void;
  label?: string;
  existingPreview?: string;
}

export default function StepUpload({
  onPhotoReady,
  label = "Upload Your Photo",
  existingPreview,
}: StepUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setError(null);

      try {
        let source: File | Blob = file;

        // Step 1: transcode HEIC/HEIF → PNG
        if (isHeicFile(file)) {
          source = await transcodeHeic(file);
        }

        // Step 2: fix EXIF orientation
        const correctedCanvas = await correctOrientation(source);
        const dataUrl = correctedCanvas.toDataURL("image/jpeg", 0.95);

        onPhotoReady(dataUrl, file.name);
      } catch (err) {
        console.error("Photo processing error:", err);
        setError("Could not process this image. Try a JPEG, PNG, or WebP instead.");
      } finally {
        setIsProcessing(false);
      }
    },
    [onPhotoReady]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      const allowed = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/heif",
      ];
      if (!allowed.includes(file.type) && !isHeicFile(file)) {
        setError("Please upload a JPEG, PNG, WebP, or HEIC/HEIF file.");
        return;
      }
      processFile(file);
    },
    [processFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className="w-full select-none">
      {/* Drop zone */}
      <div
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
          isDragging
            ? "border-yellow-300 bg-yellow-300/10 shadow-[0_0_30px_rgba(254,225,1,0.3)]"
            : "border-yellow-300/40 hover:border-yellow-300 bg-emerald-950/60 hover:bg-emerald-950/80 shadow-lg"
        }`}
        style={{
          minHeight: 250,
          backdropFilter: "blur(10px)",
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        {isProcessing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="w-12 h-12 rounded-full border-3 border-yellow-300 border-t-pink-500 animate-spin" />
            <p className="font-mono font-bold text-sm text-yellow-300 uppercase tracking-wider">
              PROCESSING PHOTO...
            </p>
            <p className="font-mono text-xs text-white/60">
              Applying EXIF auto-rotation & format conversion
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center gap-4">
            {/* Palm/Upload Icon */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg"
              style={{
                background: "rgba(232,24,122,0.15)",
                border: "1.5px solid #E8187A",
                boxShadow: "0 0 20px rgba(232,24,122,0.3)",
              }}
            >
              🌴
            </div>

            <div>
              <h3 className="font-mono font-black text-lg text-yellow-300 uppercase tracking-wider mb-1">
                {label}
              </h3>
              <p className="font-mono text-xs text-white/60">
                Drag & drop your photo here or click to browse
              </p>
            </div>

            {/* Choose File Button */}
            <button
              type="button"
              className="font-mono font-black text-xs uppercase tracking-[0.18em] py-3 px-6 rounded-lg transition-all"
              style={{
                background: "#FEE101",
                color: "#011a0d",
                border: "2px solid #E8187A",
                boxShadow: "0 4px 15px rgba(254,225,1,0.3)",
              }}
            >
              + CHOOSE PHOTO FILE
            </button>

            {/* Supported Formats Pill */}
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
                SUPPORTS: JPG · PNG · WEBP · HEIC
              </span>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <div
          className="mt-3 p-3 rounded-lg font-mono text-xs text-pink-300 text-center"
          style={{
            background: "rgba(232,24,122,0.2)",
            border: "1px solid #E8187A",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
