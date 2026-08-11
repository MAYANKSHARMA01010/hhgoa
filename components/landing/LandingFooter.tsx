"use client";

export default function LandingFooter() {
  return (
    <footer
      className="relative z-10 text-center font-mono"
      style={{
        padding: "0.75rem clamp(1rem, 5vw, 3rem)",
        fontSize: "clamp(0.6rem, 1.1vw, 0.85rem)",
        letterSpacing: "0.08em",
      }}
    >
      <p className="mb-0.5">
        <span style={{ color: "#FEE101" }}>#FrameInGoa</span>
        <span className="text-white/50"> &nbsp;·&nbsp; HH GOA 2026 &nbsp;·&nbsp; August 28-31, 2026 &nbsp;·&nbsp; Goa, India</span>
      </p>
      <p style={{ color: "rgba(255,255,255,0.3)" }}>
        Built for HH Goa 2026 builders &amp; attendees.
      </p>
    </footer>
  );
}
