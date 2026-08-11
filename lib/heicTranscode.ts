"use client";

/**
 * Transcodes HEIC/HEIF blobs to PNG blobs client-side using heic2any.
 * Dynamically imported to avoid SSR bundle hit.
 */
export async function transcodeHeic(file: File): Promise<Blob> {
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({
    blob: file,
    toType: "image/png",
    quality: 0.95,
  });
  return Array.isArray(result) ? result[0] : result;
}

export function isHeicFile(file: File): boolean {
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  );
}
