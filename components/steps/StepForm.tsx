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
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 select-none">
      {/* Name */}
      <div>
        <label className="block text-yellow-300 font-mono font-bold text-xs uppercase tracking-[0.2em] mb-2">
          ✦ Full Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          placeholder="e.g. Rahul Mehta"
          maxLength={32}
          className="w-full px-4 py-3 rounded-xl text-white font-mono text-sm placeholder-white/30 outline-none transition-all"
          style={{
            background: "rgba(1,21,12,0.85)",
            border: "1.5px solid rgba(254,225,1,0.3)",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
          }}
        />
        {error && <p className="mt-1 font-mono text-xs text-pink-400">{error}</p>}
      </div>

      {/* Role */}
      <div>
        <label className="block text-yellow-300 font-mono font-bold text-xs uppercase tracking-[0.2em] mb-2">
          ✦ Stack / Role
        </label>
        <div className="grid grid-cols-4 gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              className="px-2 py-2.5 rounded-lg text-xs font-mono font-bold uppercase transition-all"
              style={{
                background: role === r ? "#FEE101" : "rgba(1,21,12,0.7)",
                color: role === r ? "#011a0d" : "rgba(255,255,255,0.7)",
                border: `1.5px solid ${role === r ? "#E8187A" : "rgba(255,255,255,0.15)"}`,
                boxShadow: role === r ? "0 4px 12px rgba(254,225,1,0.25)" : "none",
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
          <label className="block text-yellow-300 font-mono font-bold text-xs uppercase tracking-[0.2em] mb-2">
            ✦ Builder Class (auto-generated)
          </label>
          <div className="flex gap-2.5">
            <div
              className="flex-1 px-4 py-3 rounded-xl font-mono font-bold text-xs text-yellow-300 flex items-center justify-between"
              style={{
                background: "rgba(1,21,12,0.9)",
                border: "1.5px solid rgba(254,225,1,0.3)",
              }}
            >
              <span>{builderTitle}</span>
              <span className="text-pink-400 text-[10px] tracking-widest uppercase">CLASS {seat}</span>
            </div>
            <button
              type="button"
              onClick={reroll}
              className="px-4 py-3 rounded-xl font-bold transition-all text-base"
              style={{
                background: "rgba(232,24,122,0.2)",
                color: "#E8187A",
                border: "1.5px solid #E8187A",
                boxShadow: "0 4px 12px rgba(232,24,122,0.3)",
              }}
              title="Re-roll builder title"
            >
              🎲
            </button>
          </div>
          <p className="text-white/40 font-mono text-[11px] mt-1.5">
            Hit 🎲 to re-roll — each title is uniquely generated
          </p>
        </div>
      )}

      {/* X Handle */}
      <div>
        <label className="block text-yellow-300 font-mono font-bold text-xs uppercase tracking-[0.2em] mb-2">
          ✦ X / Twitter Handle (optional)
        </label>
        <div className="flex items-center gap-0">
          <span
            className="px-4 py-3 rounded-l-xl font-mono font-bold text-xs"
            style={{
              background: "rgba(232,24,122,0.2)",
              color: "#E8187A",
              border: "1.5px solid #E8187A",
              borderRight: "none",
            }}
          >
            @
          </span>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
            placeholder="yourhandle"
            maxLength={20}
            className="flex-1 px-4 py-3 rounded-r-xl text-white font-mono text-sm placeholder-white/30 outline-none"
            style={{
              background: "rgba(1,21,12,0.85)",
              border: "1.5px solid rgba(254,225,1,0.3)",
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 rounded-xl font-mono font-black text-sm text-[#011a0d] uppercase tracking-[0.2em] mt-2 transition-all"
        style={{
          background: "#FEE101",
          border: "2px solid #E8187A",
          outline: "3px dotted #E8187A",
          outlineOffset: "3px",
          boxShadow: "0 8px 25px rgba(254,225,1,0.35)",
        }}
      >
        Generate My {format === "builder-id" ? "Builder ID Card" : "Team Frame"} →
      </button>
    </form>
  );
}
