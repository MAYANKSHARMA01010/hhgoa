import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { encodeShareState } from "@/lib/shareState";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const name = (formData.get("name") as string) || "Builder";
    const format = (formData.get("format") as string) || "builder-id";
    const builderTitle = (formData.get("builderTitle") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
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

    return NextResponse.json({ shareId: state, blobUrl: blob.url });
  } catch (error) {
    console.error("Share upload error:", error);
    // Return a graceful fallback so the client can still share
    return NextResponse.json(
      { error: "Upload failed", shareId: null },
      { status: 500 }
    );
  }
}
