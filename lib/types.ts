export interface CanvasHandle {
  getCanvas: () => HTMLCanvasElement | null;
  getDataUrl: () => string;
  toBlob: (
    type?: "image/png" | "image/jpeg",
    quality?: number
  ) => Promise<Blob | null>;
}
