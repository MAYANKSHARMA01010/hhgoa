export type BuilderRole =
  | "Frontend"
  | "Backend"
  | "Full-Stack"
  | "Product"
  | "Design"
  | "AI-ML"
  | "Other";

const adjectives = [
  "Full-Stack",
  "Rogue",
  "Midnight",
  "Coastal",
  "Neon",
  "Terminal",
  "Serverless",
  "Zero-to-One",
  "Sun-Drenched",
  "Ship-First",
  "Breakwater",
  "Pixel-Perfect",
  "Deep-Sea",
  "Off-Grid",
  "Mainframe",
  "Analog",
  "Hyper-Local",
  "Ocean-Born",
  "Dark-Mode",
  "Hard-Fork",
];

const nouns: Record<BuilderRole, string[]> = {
  Frontend: ["Alchemist", "Artisan", "Conjurer", "Pixel-Pusher", "Renderer"],
  Backend: ["Architect", "Renegade", "Mechanic", "Forger", "Stack-Master"],
  "Full-Stack": ["Wizard", "Operator", "Polyglot", "Ninja", "Sovereign"],
  Product: ["Visionary", "Navigator", "Strategist", "Catalyst"],
  Design: ["Craftsman", "Sorcerer", "Sculptor", "Illustrator"],
  "AI-ML": ["Whisperer", "Alchemist", "Oracle", "Synthesizer"],
  Other: ["Wildcard", "Maverick", "Pioneer", "Outlier"],
};

export function generateBuilderTitle(role: BuilderRole): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const roleNouns = nouns[role] ?? nouns["Other"];
  const noun = roleNouns[Math.floor(Math.random() * roleNouns.length)];
  return `${adj} ${noun}`;
}

export function generateSeatNumber(): string {
  const rows = ["A", "B", "C", "D", "E", "F"];
  const row = rows[Math.floor(Math.random() * rows.length)];
  const num = Math.floor(Math.random() * 30) + 1;
  return `${num}${row}`;
}
