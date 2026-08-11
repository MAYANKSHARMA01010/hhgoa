export interface ShareState {
  blobUrl: string;
  name: string;
  format: string;
  builderTitle?: string;
  role?: string;
}

export function encodeShareState(state: ShareState): string {
  const json = JSON.stringify(state);
  // URL-safe base64
  return btoa(json)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeShareState(encoded: string): ShareState | null {
  try {
    // Restore standard base64 padding
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice((base64.length + 3) % 4);
    const json = atob(padded);
    return JSON.parse(json) as ShareState;
  } catch {
    return null;
  }
}
