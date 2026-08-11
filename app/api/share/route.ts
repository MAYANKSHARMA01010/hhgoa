import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { encodeShareState } from "@/lib/shareState";
import { getCorsHeaders } from "@/lib/api";

// OPTIONS handler for CORS preflight checks
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const headers = getCorsHeaders(origin);

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const name = (formData.get("name") as string) || "Builder";
    const format = (formData.get("format") as string) || "builder-id";
    const builderTitle = (formData.get("builderTitle") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400, headers }
      );
    }

    // Generate short ID
    const id = nanoid(10);

    // Upload to Vercel Blob
    const blob = await put(`frames/${id}.png`, file, {
      access: "public",
      contentType: "image/png",
    });

    // Encode share state (blobUrl + metadata) into the shareId
    const state = encodeShareState({
      blobUrl: blob.url,
      name,
      format,
      builderTitle,
    });

    return NextResponse.json(
      { shareId: state, blobUrl: blob.url },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Share upload error:", error);
    // Return a graceful fallback so the client can still share
    return NextResponse.json(
      { error: "Upload failed", shareId: null },
      { status: 500, headers }
    );
  }
}
