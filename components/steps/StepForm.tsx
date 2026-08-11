"use client";

import { useState } from "react";
import type { BuilderRole } from "@/lib/builderTitles";
import { generateBuilderTitle, generateSeatNumber } from "@/lib/builderTitles";

export interface FormData {
  name: string;
  role: BuilderRole;
  handle: string;
  builderTitle: string;
  seat: string;
}

interface StepFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  format: "builder-id" | "team";
}

const ROLES: BuilderRole[] = [
  "Frontend",
  "Backend",
  "Full-Stack",
  "Product",
  "Design",
  "AI-ML",
  "Other",
];

export default function StepForm({ initialData, onSubmit, format }: StepFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [role, setRole] = useState<BuilderRole>(initialData?.role ?? "Full-Stack");
  const [handle, setHandle] = useState(initialData?.handle ?? "");
  const [builderTitle, setBuilderTitle] = useState(
    initialData?.builderTitle ?? generateBuilderTitle("Full-Stack")
  );
  const [seat] = useState(initialData?.seat ?? generateSeatNumber());
  const [error, setError] = useState("");

  function reroll() {
    setBuilderTitle(generateBuilderTitle(role));
  }

  function handleRoleChange(newRole: BuilderRole) {
    setRole(newRole);
    setBuilderTitle(generateBuilderTitle(newRole));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    onSubmit({ name: name.trim(), role, handle: handle.replace(/^@/, ""), builderTitle, seat });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
      {/* Name */}
      <div>
        <label className="block text-pink-brand font-semibold text-xs uppercase tracking-widest mb-2">
          Full Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          placeholder="e.g. Rahul Mehta"
          maxLength={32}
          className="w-full px-4 py-3 rounded-xl text-cream placeholder-cream/30 outline-none focus:ring-2"
          style={{
            background: "rgba(11,104,57,0.3)",
            border: "1px solid rgba(245,230,66,0.2)",
          }}
        />
        {error && <p className="mt-1 text-sm" style={{ color: "#E8187A" }}>{error}</p>}
      </div>

      {/* Role */}
      <div>
        <label className="block text-pink-brand font-semibold text-xs uppercase tracking-widest mb-2">
          Stack / Role
        </label>
        <div className="grid grid-cols-4 gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              className="px-2 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: role === r ? "#F5E642" : "rgba(11,104,57,0.4)",
                color: role === r ? "#063725" : "#F5F0E8",
                border: `1px solid ${role === r ? "#F5E642" : "rgba(245,230,66,0.15)"}`,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Builder Title */}
      {format === "builder-id" && (
        <div>
          <label className="block text-pink-brand font-semibold text-xs uppercase tracking-widest mb-2">
            Builder Class (auto-generated)
          </label>
          <div className="flex gap-2">
            <div
              className="flex-1 px-4 py-3 rounded-xl font-bold"
              style={{
                background: "rgba(245,230,66,0.1)",
                border: "1px solid rgba(245,230,66,0.3)",
                color: "#F5E642",
              }}
            >
              {builderTitle}
            </div>
            <button
              type="button"
              onClick={reroll}
              className="px-4 py-3 rounded-xl font-bold transition-all btn-press"
              style={{
                background: "rgba(232,24,122,0.2)",
                color: "#E8187A",
                border: "1px solid rgba(232,24,122,0.3)",
              }}
              title="Re-roll builder title"
            >
              🎲
            </button>
          </div>
          <p className="text-cream/40 text-xs mt-1">
            Hit 🎲 to re-roll — each title is unique
          </p>
        </div>
      )}

      {/* X Handle */}
      <div>
        <label className="block text-pink-brand font-semibold text-xs uppercase tracking-widest mb-2">
          X Handle (optional)
        </label>
        <div className="flex items-center gap-0">
          <span
            className="px-3 py-3 rounded-l-xl font-bold"
            style={{ background: "rgba(232,24,122,0.2)", color: "#E8187A", border: "1px solid rgba(232,24,122,0.3)" }}
          >
            @
          </span>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
            placeholder="yourhandle"
            maxLength={20}
            className="flex-1 px-4 py-3 rounded-r-xl text-cream placeholder-cream/30 outline-none"
            style={{
              background: "rgba(11,104,57,0.3)",
              border: "1px solid rgba(245,230,66,0.2)",
              borderLeft: "none",
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 rounded-xl font-bold text-lg text-green-deep btn-press"
        style={{ background: "#F5E642" }}
      >
        Generate My {format === "builder-id" ? "Builder ID" : "Team Frame"} →
      </button>
    </form>
  );
}
