"use client";

/**
 * Reads EXIF orientation from a file using exifr and returns
 * a corrected ImageBitmap with the orientation applied.
 */
export async function correctOrientation(
  source: File | Blob
): Promise<HTMLCanvasElement> {
  // Dynamic import to avoid SSR
  const exifr = await import("exifr");

  let orientation = 1;
  try {
    const result = await exifr.default.parse(source, { pick: ["Orientation"] });
    orientation = result?.Orientation ?? 1;
  } catch {
    // No EXIF data — assume normal orientation
    orientation = 1;
  }

  const bitmap = await createImageBitmap(source);
  const { width, height } = bitmap;

  // Determine if we need to swap width/height
  const swapped = orientation >= 5 && orientation <= 8;
  const canvasWidth = swapped ? height : width;
  const canvasHeight = swapped ? width : height;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d")!;

  // Apply the transform based on orientation
  ctx.save();
  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, width, 0);
      break;
    case 3:
      ctx.transform(-1, 0, 0, -1, width, height);
      break;
    case 4:
      ctx.transform(1, 0, 0, -1, 0, height);
      break;
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, height, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, height, width);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, width);
      break;
    default:
      break;
  }
  ctx.drawImage(bitmap, 0, 0);
  ctx.restore();

  return canvas;
}
