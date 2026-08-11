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
    <div className="w-full">
      {/* Drop zone */}
      <div
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
          isDragging
            ? "border-yellow-brand bg-yellow-brand/10"
            : "border-green-light/50 hover:border-yellow-brand/60 hover:bg-green-mid/20"
        }`}
        style={{ minHeight: 220 }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        {isProcessing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            {/* Skeleton shimmer */}
            <div className="skeleton w-16 h-16 rounded-full" />
            <div className="skeleton w-40 h-4 rounded" />
            <p className="text-cream/60 text-sm">Processing photo…</p>
          </div>
        ) : existingPreview ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={existingPreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-2xl opacity-75"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-green-deep/60">
              <div className="text-center">
                <div className="text-4xl mb-2">🔄</div>
                <p className="text-cream font-semibold">Click to replace</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-10">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
              style={{ background: "rgba(26,139,78,0.3)" }}
            >
              📤
            </div>
            <div className="text-center">
              <p className="text-cream font-semibold text-lg">{label}</p>
              <p className="text-cream/50 text-sm mt-1">
                Drag & drop or tap · JPG, PNG, WebP, HEIC
              </p>
            </div>
            <div
              className="px-6 py-2.5 rounded-full font-semibold text-sm"
              style={{
                background: "rgba(245,230,66,0.15)",
                color: "#F5E642",
                border: "1px solid rgba(245,230,66,0.3)",
              }}
            >
              Choose File
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.heic,.heif,image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="mt-3 text-sm rounded-lg px-4 py-2.5"
          style={{ background: "rgba(232,24,122,0.15)", color: "#E8187A", border: "1px solid rgba(232,24,122,0.3)" }}
        >
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
