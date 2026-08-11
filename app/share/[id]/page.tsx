import type { Metadata } from "next";
import Link from "next/link";
import { decodeShareState } from "@/lib/shareState";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const { id } = await params;
  const state = decodeShareState(id);

  if (!state) {
    return {
      title: "HH Goa 2026 Frame Studio",
      description: "Generate your Hacker House Goa 2026 pass. #FrameInGoa",
    };
  }

  const title = state.builderTitle
    ? `${state.name} — ${state.builderTitle} | HH Goa 2026`
    : `${state.name} | HH Goa 2026 Builder Pass`;

  return {
    title,
    description: `${state.name} generated their Hacker House Goa 2026 pass. Create yours at #FrameInGoa`,
    openGraph: {
      title,
      description: `${state.name}'s HH Goa 2026 Builder Pass · #FrameInGoa`,
      images: state.blobUrl
        ? [
            {
              url: state.blobUrl,
              width: 1080,
              height: 1350,
              alt: `${state.name}'s HH Goa 2026 Builder Pass`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `${state.name}'s HH Goa 2026 Builder Pass · #FrameInGoa`,
      images: state.blobUrl ? [state.blobUrl] : [],
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const state = decodeShareState(id);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
      {/* Nav */}
      <div className="w-full max-w-lg mb-8">
        <Link
          href="/"
          className="text-xl font-black"
          style={{ color: "#F5E642" }}
        >
          ← HH GOA 2026
        </Link>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-6">
        {/* Card preview */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(245,230,66,0.2)" }}
        >
          {state?.blobUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={state.blobUrl}
              alt={`${state.name}'s HH Goa 2026 frame`}
              className="w-full h-auto block"
            />
          ) : (
            <div
              className="w-full flex items-center justify-center"
              style={{ height: 320, background: "#0B6839" }}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🎫</div>
                <p className="text-cream font-bold">HH Goa 2026 Pass</p>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        {state && (
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(11,104,57,0.3)",
              border: "1px solid rgba(245,230,66,0.15)",
            }}
          >
            <p className="text-cream/60 text-xs uppercase tracking-widest mb-1">
              Passenger
            </p>
            <p className="text-cream font-bold text-xl">{state.name}</p>
            {state.builderTitle && (
              <>
                <p className="text-cream/60 text-xs uppercase tracking-widest mt-3 mb-1">
                  Builder Class
                </p>
                <p className="font-bold text-lg" style={{ color: "#F5E642" }}>
                  {state.builderTitle}
                </p>
              </>
            )}
            <p className="text-cream/60 text-xs uppercase tracking-widest mt-3 mb-1">
              Event
            </p>
            <p className="text-cream font-semibold">
              Hacker House Goa 2026 · 28–31 OCT
            </p>
          </div>
        )}

        {/* Download */}
        {state?.blobUrl && (
          <a
            href={state.blobUrl}
            download="hhgoa-2026-frame.png"
            className="w-full py-4 rounded-xl font-bold text-lg text-green-deep text-center btn-press"
            style={{ background: "#F5E642", display: "block" }}
          >
            ⬇️ Download This Frame
          </a>
        )}

        {/* CTA */}
        <Link
          href="/create/builder-id"
          className="w-full py-4 rounded-xl font-bold text-lg text-center btn-press"
          style={{
            background: "rgba(232,24,122,0.2)",
            color: "#E8187A",
            border: "1px solid rgba(232,24,122,0.4)",
            display: "block",
          }}
        >
          ⚡ Generate Your Own Frame →
        </Link>

        <p className="text-center text-cream/40 text-sm">
          #FrameInGoa · Team OBOW Studio
        </p>
      </div>
    </main>
  );
}
