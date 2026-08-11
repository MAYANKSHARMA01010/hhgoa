export default function HowToStrip() {
  return (
    <section
      className="rounded-2xl p-6 md:p-8"
      style={{
        background: "rgba(11,104,57,0.25)",
        border: "1px solid rgba(245,230,66,0.15)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
          style={{ background: "rgba(232,24,122,0.2)", color: "#E8187A", border: "1px solid rgba(232,24,122,0.3)" }}
        >
          How It Works
        </span>
        <h2 className="text-xl font-bold text-cream">
          Create Your <span style={{ color: "#F5E642" }}>#FrameInGoa</span> in 3 Steps
        </h2>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            emoji: "📤",
            step: "01",
            title: "Upload",
            desc: "Any photo — JPG, PNG, HEIC, WebP. We fix orientation automatically.",
          },
          {
            emoji: "✂️",
            step: "02",
            title: "Crop & Fill",
            desc: "Pinch, zoom, and position. No manual pre-cropping needed.",
          },
          {
            emoji: "🚀",
            step: "03",
            title: "Share",
            desc: "Download PNG or share straight to X with one tap.",
          },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto mb-3"
              style={{ background: "rgba(245,230,66,0.1)", border: "1px solid rgba(245,230,66,0.2)" }}
            >
              {item.emoji}
            </div>
            <div
              className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: "#E8187A" }}
            >
              Step {item.step}
            </div>
            <div className="text-cream font-semibold text-sm mb-1">
              {item.title}
            </div>
            <div className="text-cream/50 text-xs leading-relaxed hidden sm:block">
              {item.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Screenshot CTA */}
      <div
        className="rounded-xl p-4 text-center"
        style={{
          background: "rgba(232,24,122,0.08)",
          border: "1px dashed rgba(232,24,122,0.3)",
        }}
      >
        <p className="text-cream/70 text-sm">
          📸 <strong className="text-cream">Screenshot this</strong> to share as your "how-to" on X
          — post your own frame + this guide to get featured in the{" "}
          <span style={{ color: "#F5E642" }}>Radar</span>
        </p>
        <p className="text-cream/40 text-xs mt-2">
          Tag <span style={{ color: "#E8187A" }}>@247pmstudio</span> · Use{" "}
          <span style={{ color: "#F5E642" }}>#FrameInGoa</span>
        </p>
      </div>
    </section>
  );
}
