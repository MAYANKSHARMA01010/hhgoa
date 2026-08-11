"use client";

import { useState, useRef, useCallback, useEffect, use } from "react";
import Link from "next/link";
import StepUpload from "@/components/steps/StepUpload";
import StepCrop from "@/components/steps/StepCrop";
import StepForm, { type FormData } from "@/components/steps/StepForm";
import StepResult from "@/components/steps/StepResult";
import FormatSelector from "@/components/FormatSelector";
import dynamic from "next/dynamic";
import type { CanvasHandle } from "@/lib/types";
import { generateBuilderTitle, generateSeatNumber } from "@/lib/builderTitles";
import type { TeamMember } from "@/components/canvas/TeamFrameCanvas";

type Format = "profile" | "builder-id" | "team";
type Step = "upload" | "crop" | "form" | "render";

// Dynamic imports for canvas components
const ProfileFrameCanvas = dynamic(
  () => import("@/components/canvas/ProfileFrameCanvas"),
  { ssr: false, loading: () => <div className="skeleton w-full" style={{ height: 320 }} /> }
);
const BuilderIDCanvas = dynamic(
  () => import("@/components/canvas/BuilderIDCanvas"),
  { ssr: false, loading: () => <div className="skeleton w-full" style={{ height: 400 }} /> }
);
const TeamFrameCanvas = dynamic(
  () => import("@/components/canvas/TeamFrameCanvas"),
  { ssr: false, loading: () => <div className="skeleton w-full" style={{ height: 280 }} /> }
);

const STEP_LABELS: Record<Step, string> = {
  upload: "Upload Photo",
  crop: "Crop Photo",
  form: "Builder Details",
  render: "Export Frame",
};

export default function CreatePage({
  params,
}: {
  params: Promise<{ format: string }>;
}) {
  const { format: rawFormat } = use(params);
  const [format, setFormat] = useState<Format>(
    (["profile", "builder-id", "team"].includes(rawFormat)
      ? rawFormat
      : "builder-id") as Format
  );

  // Step state
  const [step, setStep] = useState<Step>("upload");

  // Photo state
  const [rawPhoto, setRawPhoto] = useState<string>("");
  const [croppedPhoto, setCroppedPhoto] = useState<string>("");
  const [fileName, setFileName] = useState("");

  // Team state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamMemberIndex, setTeamMemberIndex] = useState(0); // which member we're adding
  const [teamMemberPhotos, setTeamMemberPhotos] = useState<string[]>([]);
  const [teamMemberCropped, setTeamMemberCropped] = useState<string[]>([]);
  const [teamMemberNames, setTeamMemberNames] = useState<string[]>(["", "", "", ""]);
  const [teamMemberRoles, setTeamMemberRoles] = useState<string[]>(["Full-Stack", "Full-Stack", "Full-Stack", "Full-Stack"]);
  const [teamSize, setTeamSize] = useState(2);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    role: "Full-Stack",
    handle: "",
    builderTitle: generateBuilderTitle("Full-Stack"),
    seat: generateSeatNumber(),
  });

  // Canvas ref
  const canvasRef = useRef<CanvasHandle>(null);

  // Restore saved state from localStorage on mount
  useEffect(() => {
    try {
      const savedCropped = localStorage.getItem("hhgoa_cropped_photo");
      const savedFormData = localStorage.getItem("hhgoa_form_data");
      if (savedCropped) setCroppedPhoto(savedCropped);
      if (savedFormData) {
        const parsed = JSON.parse(savedFormData);
        if (parsed.name) setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.warn("Could not read from localStorage:", e);
    }
  }, []);

  // Save state to localStorage when updated
  useEffect(() => {
    if (croppedPhoto) {
      try {
        localStorage.setItem("hhgoa_cropped_photo", croppedPhoto);
      } catch (e) {
        console.warn("Could not write croppedPhoto to localStorage:", e);
      }
    }
  }, [croppedPhoto]);

  useEffect(() => {
    if (formData.name) {
      try {
        localStorage.setItem("hhgoa_form_data", JSON.stringify(formData));
      } catch (e) {
        console.warn("Could not write formData to localStorage:", e);
      }
    }
  }, [formData]);

  // Steps applicable per format
  const stepsForFormat: Step[] =
    format === "profile"
      ? ["upload", "crop", "render"]
      : format === "team"
      ? ["upload", "crop", "form", "render"]
      : ["upload", "crop", "form", "render"];

  const currentStepIndex = stepsForFormat.indexOf(step);

  // ── Handlers ────────────────────────────────────────────

  // Jump back to any already-completed step by clicking its dot
  const handleStepClick = useCallback(
    (targetStep: Step) => {
      const targetIdx = stepsForFormat.indexOf(targetStep);
      if (targetIdx < currentStepIndex) {
        setStep(targetStep);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentStepIndex, stepsForFormat]
  );

  const handleFormatChange = useCallback((f: Format) => {
    setFormat(f);
    setStep("upload");
    setRawPhoto("");
    setCroppedPhoto("");
    setTeamMembers([]);
    setTeamMemberIndex(0);
    setTeamMemberPhotos([]);
    setTeamMemberCropped([]);
  }, []);

  const handlePhotoReady = useCallback(
    (dataUrl: string, name: string) => {
      setFileName(name);
      if (format === "team") {
        const updated = [...teamMemberPhotos];
        updated[teamMemberIndex] = dataUrl;
        setTeamMemberPhotos(updated);
        setRawPhoto(dataUrl);
      } else {
        setRawPhoto(dataUrl);
      }
      setStep("crop");
    },
    [format, teamMemberIndex, teamMemberPhotos]
  );

  const handleCropped = useCallback(
    (dataUrl: string) => {
      if (format === "team") {
        const updated = [...teamMemberCropped];
        updated[teamMemberIndex] = dataUrl;
        setTeamMemberCropped(updated);

        if (teamMemberIndex < teamSize - 1) {
          // Continue uploading next member
          setTeamMemberIndex(teamMemberIndex + 1);
          setRawPhoto("");
          setStep("upload");
        } else {
          // All members uploaded — go to form
          setCroppedPhoto(dataUrl);
          setStep("form");
        }
      } else {
        setCroppedPhoto(dataUrl);
        if (format === "profile") {
          setStep("render");
        } else {
          setStep("form");
        }
      }
    },
    [format, teamMemberIndex, teamMemberCropped, teamSize]
  );

  const handleFormSubmit = useCallback(
    (data: FormData) => {
      setFormData(data);
      if (format === "team") {
        // Build team members array
        const members: TeamMember[] = teamMemberCropped
          .slice(0, teamSize)
          .map((photo, i) => ({
            photoDataUrl: photo,
            name: i === 0 ? data.name : teamMemberNames[i] || `Member ${i + 1}`,
            role: i === 0 ? data.role : teamMemberRoles[i] || "Builder",
          }));
        setTeamMembers(members);
      }
      setStep("render");
    },
    [format, teamMemberCropped, teamSize, teamMemberNames, teamMemberRoles]
  );

  const handleReset = useCallback(() => {
    setStep("upload");
    setRawPhoto("");
    setCroppedPhoto("");
    setTeamMembers([]);
    setTeamMemberIndex(0);
    setTeamMemberPhotos([]);
    setTeamMemberCropped([]);
  }, []);

  // Determine which step label to show for team
  const getStepLabel = () => {
    if (format === "team" && (step === "upload" || step === "crop")) {
      return `Member ${teamMemberIndex + 1} of ${teamSize}`;
    }
    return STEP_LABELS[step];
  };

  return (
    <main
      className="min-h-screen flex flex-col relative select-none overflow-x-hidden"
      style={{
        background: "radial-gradient(circle at 50% 30%, #035227 0%, #02381b 55%, #01210f 100%)",
      }}
    >
      {/* Sunburst background rays */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, rgba(254,225,1,0.2) 0deg 10deg, transparent 10deg 20deg)`,
        }}
      />

      {/* Palm silhouettes */}
      <div className="absolute left-0 top-0 bottom-0 pointer-events-none opacity-15 w-24 sm:w-44 flex items-center z-0">
        <svg viewBox="0 0 100 200" fill="#FEE101" className="w-full h-auto">
          <path d="M10 200 Q 30 140 0 80 Q 20 60 50 70 Q 30 40 10 50 Q 50 20 80 40 Q 60 70 70 90 Q 40 120 10 200 Z" />
        </svg>
      </div>
      <div className="absolute right-0 top-0 bottom-0 pointer-events-none opacity-15 w-24 sm:w-44 flex items-center transform scale-x-[-1] z-0">
        <svg viewBox="0 0 100 200" fill="#FEE101" className="w-full h-auto">
          <path d="M10 200 Q 30 140 0 80 Q 20 60 50 70 Q 30 40 10 50 Q 50 20 80 40 Q 60 70 70 90 Q 40 120 10 200 Z" />
        </svg>
      </div>

      {/* Navigation Header */}
      <nav
        className="relative z-20 flex items-center justify-between px-6 py-4"
        style={{
          borderBottom: "1px solid rgba(254,225,1,0.12)",
          background: "rgba(1,21,12,0.85)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-mono font-bold text-xs sm:text-sm text-yellow-300 hover:text-pink-400 transition-colors uppercase tracking-wider text-decoration-none"
        >
          <span>← HOME STUDIO</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="font-mono font-black text-xs text-yellow-300 tracking-[0.25em] uppercase hidden sm:inline-block">
            OBOW STUDIO
          </span>
          <span
            className="text-[11px] font-mono font-bold px-3 py-1 rounded-full text-pink-400 tracking-wider uppercase"
            style={{
              background: "rgba(232,24,122,0.15)",
              border: "1.5px solid #E8187A",
              boxShadow: "0 0 12px rgba(232,24,122,0.3)",
            }}
          >
            #FRAMEINGOA
          </span>
        </div>
      </nav>

      {/* Studio Workspace Container */}
      <div className="relative z-10 flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-7">
        {/* Format Selector (shown on upload step) */}
        {step === "upload" && teamMemberIndex === 0 && (
          <div className="flex flex-col gap-4">
            <div className="text-center sm:text-left">
              <span className="inline-block px-3 py-0.5 rounded-full font-mono font-bold text-[11px] text-pink-400 tracking-[0.25em] uppercase mb-1" style={{ background: "rgba(232,24,122,0.15)", border: "1px solid rgba(232,24,122,0.3)" }}>
                ✦ STEP 1: FORMAT ✦
              </span>
              <h1 className="text-2xl sm:text-3xl font-mono font-black text-yellow-300 uppercase tracking-wider leading-tight">
                Choose Your Format
              </h1>
              <p className="text-white/60 font-mono text-xs mt-1">
                Select the badge style to customize & export
              </p>
            </div>

            <FormatSelector selected={format} onChange={handleFormatChange} />

            {/* Team size picker */}
            {format === "team" && (
              <div className="p-4 rounded-xl" style={{ background: "rgba(1,26,13,0.6)", border: "1px solid rgba(254,225,1,0.2)" }}>
                <label className="block text-yellow-300 font-mono font-bold text-xs uppercase tracking-widest mb-3">
                  ✦ Select Team Size
                </label>
                <div className="flex gap-2.5">
                  {[2, 3].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setTeamSize(n)}
                      className="flex-1 py-2.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-all"
                      style={{
                        background: teamSize === n ? "#FEE101" : "rgba(255,255,255,0.08)",
                        color: teamSize === n ? "#011a0d" : "#ffffff",
                        border: `1.5px solid ${teamSize === n ? "#E8187A" : "rgba(255,255,255,0.2)"}`,
                        boxShadow: teamSize === n ? "0 4px 15px rgba(254,225,1,0.3)" : "none",
                      }}
                    >
                      {n} Members
                    </button>
                  ))}
                </div>

                {/* Team member names pre-fill */}
                <div className="mt-4 flex flex-col gap-2.5">
                  {Array.from({ length: teamSize }, (_, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={i === 0 ? teamMemberNames[0] : teamMemberNames[i]}
                        onChange={(e) => {
                          const updated = [...teamMemberNames];
                          updated[i] = e.target.value;
                          setTeamMemberNames(updated);
                        }}
                        placeholder={`Member ${i + 1} Name${i === 0 ? " (You)" : ""}`}
                        className="flex-1 px-3 py-2 rounded-lg text-white font-mono text-xs placeholder-white/40 outline-none"
                        style={{
                          background: "rgba(1,21,12,0.8)",
                          border: "1px solid rgba(254,225,1,0.2)",
                        }}
                      />
                      <select
                        value={teamMemberRoles[i]}
                        onChange={(e) => {
                          const updated = [...teamMemberRoles];
                          updated[i] = e.target.value;
                          setTeamMemberRoles(updated);
                        }}
                        className="px-2 py-2 rounded-lg text-yellow-300 font-mono text-xs outline-none"
                        style={{
                          background: "rgba(1,21,12,0.9)",
                          border: "1px solid rgba(254,225,1,0.2)",
                        }}
                      >
                        {["Frontend","Backend","Full-Stack","Product","Design","AI-ML","Other"].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step Progress Stepper */}
        <div
          className="p-4 rounded-xl"
          style={{
            background: "rgba(1,21,12,0.75)",
            border: "1px solid rgba(254,225,1,0.18)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            {stepsForFormat.map((s, i) => {
              const isCompleted = i < currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={s} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => handleStepClick(s)}
                    disabled={!isCompleted}
                    title={isCompleted ? `Go back to: ${STEP_LABELS[s]}` : undefined}
                    className="flex items-center justify-center w-8 h-8 rounded-full font-mono text-xs font-black transition-all"
                    style={{
                      background:
                        i <= currentStepIndex ? "#FEE101" : "rgba(255,255,255,0.1)",
                      color: i <= currentStepIndex ? "#011a0d" : "rgba(255,255,255,0.4)",
                      border: `1.5px solid ${i <= currentStepIndex ? "#E8187A" : "transparent"}`,
                      boxShadow: isCurrent
                        ? "0 0 18px rgba(254,225,1,0.6)"
                        : isCompleted
                        ? "0 0 10px rgba(254,225,1,0.3)"
                        : "none",
                      cursor: isCompleted ? "pointer" : "default",
                      transform: isCompleted ? "scale(1)" : "scale(1)",
                    }}
                    onMouseEnter={(e) => {
                      if (isCompleted) (e.currentTarget as HTMLElement).style.transform = "scale(1.15)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    }}
                  >
                    {isCompleted ? "✓" : i + 1}
                  </button>
                  {i < stepsForFormat.length - 1 && (
                    <div
                      className="flex-1 h-0.5 mx-2 transition-all"
                      style={{
                        background:
                          i < currentStepIndex
                            ? "#FEE101"
                            : "rgba(255,255,255,0.15)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span
              className="font-mono text-xs font-black uppercase tracking-wider text-pink-400"
            >
              ✦ {getStepLabel()} ✦
            </span>
            <span className="font-mono text-[10px] text-yellow-300/50 uppercase tracking-widest">
              STEP {currentStepIndex + 1} OF {stepsForFormat.length}
            </span>
          </div>
        </div>

        {/* Step Content Area */}
        <div className="relative">
          {step === "upload" && (
            <StepUpload
              onPhotoReady={handlePhotoReady}
              label={
                format === "team"
                  ? `Upload photo for Member ${teamMemberIndex + 1}${teamMemberIndex === 0 ? " (You)" : ""}`
                  : "Upload Your Photo"
              }
              existingPreview={rawPhoto}
            />
          )}

          {step === "crop" && rawPhoto && (
            <StepCrop
              photoDataUrl={rawPhoto}
              format={format}
              onCropped={handleCropped}
              label={
                format === "team"
                  ? `Crop Member ${teamMemberIndex + 1}'s Photo`
                  : "Crop & Position Photo"
              }
            />
          )}

          {step === "form" && (
            <>
              {format === "team" ? (
                <StepForm
                  format="team"
                  initialData={{
                    name: teamMemberNames[0] || "",
                    role: (teamMemberRoles[0] as FormData["role"]) || "Full-Stack",
                    builderTitle: generateBuilderTitle("Full-Stack"),
                    seat: generateSeatNumber(),
                  }}
                  onSubmit={handleFormSubmit}
                />
              ) : (
                <StepForm
                  format="builder-id"
                  initialData={formData}
                  onSubmit={handleFormSubmit}
                />
              )}
            </>
          )}

          {step === "render" && (
            <>
              {/* Offscreen Canvas Container (rendered in DOM tree for high-res 2D drawing) */}
              <div style={{ position: "fixed", left: -9999, top: -9999, opacity: 0, pointerEvents: "none" }}>
                {format === "profile" && (
                  <ProfileFrameCanvas
                    ref={canvasRef}
                    photoDataUrl={croppedPhoto || ""}
                    circular={true}
                  />
                )}
                {format === "builder-id" && (
                  <BuilderIDCanvas
                    ref={canvasRef}
                    data={{
                      name: formData.name || "BUILDER",
                      role: formData.role || "FULL-STACK",
                      builderTitle: formData.builderTitle || "CHAD BUILDER",
                      handle: formData.handle || "",
                      seat: formData.seat || "01A",
                      photoDataUrl: croppedPhoto || "",
                    }}
                  />
                )}
                {format === "team" && teamMembers.length > 0 && (
                  <TeamFrameCanvas
                    ref={canvasRef}
                    members={teamMembers}
                  />
                )}
              </div>

              <StepResult
                canvasRef={canvasRef}
                format={format}
                name={formData.name || teamMemberNames[0] || "Builder"}
                builderTitle={formData.builderTitle}
                onReset={handleReset}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
