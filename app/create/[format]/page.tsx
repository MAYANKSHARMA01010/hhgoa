"use client";

import { useState, useRef, useCallback, use } from "react";
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
  upload: "Upload",
  crop: "Crop",
  form: "Details",
  render: "Result",
};

const STEPS: Step[] = ["upload", "crop", "form", "render"];

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

  // Steps applicable per format
  const stepsForFormat: Step[] =
    format === "profile"
      ? ["upload", "crop", "render"]
      : format === "team"
      ? ["upload", "crop", "form", "render"]
      : ["upload", "crop", "form", "render"];

  const currentStepIndex = stepsForFormat.indexOf(step);

  // ── Handlers ────────────────────────────────────────────

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
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-green-light/20">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black" style={{ color: "#F5E642" }}>
            ← HH GOA
          </span>
        </Link>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: "rgba(232,24,122,0.15)", color: "#E8187A", border: "1px solid rgba(232,24,122,0.2)" }}
        >
          #FrameInGoa
        </span>
      </nav>

      <div className="flex-1 max-w-lg mx-auto w-full px-5 py-8 flex flex-col gap-8">
        {/* Format selector (shown on upload step) */}
        {step === "upload" && teamMemberIndex === 0 && (
          <>
            <div>
              <h1 className="text-2xl font-black text-cream mb-2">
                Choose Your Format
              </h1>
              <p className="text-cream/50 text-sm">
                Pick the style you want to generate
              </p>
            </div>
            <FormatSelector selected={format} onChange={handleFormatChange} />

            {/* Team size picker */}
            {format === "team" && (
              <div>
                <label className="block text-pink-brand font-semibold text-xs uppercase tracking-widest mb-3">
                  Team Size
                </label>
                <div className="flex gap-2">
                  {[2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setTeamSize(n)}
                      className="flex-1 py-2.5 rounded-xl font-bold transition-all"
                      style={{
                        background: teamSize === n ? "#F5E642" : "rgba(11,104,57,0.3)",
                        color: teamSize === n ? "#063725" : "#F5F0E8",
                        border: `1px solid ${teamSize === n ? "#F5E642" : "rgba(245,230,66,0.15)"}`,
                      }}
                    >
                      {n} people
                    </button>
                  ))}
                </div>
                {/* Team member names pre-fill */}
                <div className="mt-3 flex flex-col gap-2">
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
                        placeholder={`Member ${i + 1} name${i === 0 ? " (you)" : ""}`}
                        className="flex-1 px-3 py-2 rounded-lg text-cream text-sm placeholder-cream/30 outline-none"
                        style={{
                          background: "rgba(11,104,57,0.3)",
                          border: "1px solid rgba(245,230,66,0.15)",
                        }}
                      />
                      <select
                        value={teamMemberRoles[i]}
                        onChange={(e) => {
                          const updated = [...teamMemberRoles];
                          updated[i] = e.target.value;
                          setTeamMemberRoles(updated);
                        }}
                        className="px-2 py-2 rounded-lg text-cream text-xs outline-none"
                        style={{ background: "rgba(11,104,57,0.5)", border: "1px solid rgba(245,230,66,0.15)" }}
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
          </>
        )}

        {/* Progress indicator */}
        <div>
          <div className="flex items-center justify-between mb-2">
            {stepsForFormat.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all"
                  style={{
                    background:
                      i <= currentStepIndex ? "#F5E642" : "rgba(11,104,57,0.4)",
                    color: i <= currentStepIndex ? "#063725" : "#F5F0E8",
                  }}
                >
                  {i < currentStepIndex ? "✓" : i + 1}
                </div>
                {i < stepsForFormat.length - 1 && (
                  <div
                    className="flex-1 h-0.5 mx-1 transition-all"
                    style={{
                      background:
                        i < currentStepIndex
                          ? "#F5E642"
                          : "rgba(11,104,57,0.4)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#E8187A" }}
          >
            {getStepLabel()}
          </p>
        </div>

        {/* Step content */}
        {step === "upload" && (
          <StepUpload
            onPhotoReady={handlePhotoReady}
            label={
              format === "team"
                ? `Upload photo for Member ${teamMemberIndex + 1}${teamMemberIndex === 0 ? " (you)" : ""}`
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
                ? `Crop Member ${teamMemberIndex + 1}'s photo`
                : "Adjust your photo"
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
            {/* Canvas (hidden, used for rendering) */}
            <div className="hidden">
              {format === "profile" && croppedPhoto && (
                <ProfileFrameCanvas
                  ref={canvasRef}
                  photoDataUrl={croppedPhoto}
                  circular={true}
                />
              )}
              {format === "builder-id" && croppedPhoto && (
                <BuilderIDCanvas
                  ref={canvasRef}
                  data={{
                    name: formData.name,
                    role: formData.role,
                    builderTitle: formData.builderTitle,
                    handle: formData.handle,
                    seat: formData.seat,
                    photoDataUrl: croppedPhoto,
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
    </main>
  );
}
