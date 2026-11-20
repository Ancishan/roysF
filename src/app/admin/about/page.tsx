
"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import Image from "next/image";

import {
  Save,
  Loader2,
  Plus,
  Trash2,
  Pencil,
  Users,
  Target,
  Building2,
  ImagePlus,
  X,
  RefreshCw,
  Eye,
  Upload,
  Mail,
  BookOpen,
  Sparkles,
} from "lucide-react";


const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
    .replace(/\/+$/, "")
    .replace(/\/api$/, "") + "/api";

const primaryButton =
  "btn border-0 bg-gradient-to-r from-[#7f1d2d] to-[#a33348] text-white shadow-md shadow-[#7f1d2d]/20 transition-all duration-300 hover:scale-[1.02] hover:from-[#641725] hover:to-[#7f1d2d]";

const cardStyle =
  "card border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-[#7f1d2d]/20 hover:shadow-md";

const inputStyle =
  "input input-bordered w-full border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-[#7f1d2d] focus:outline-none focus:ring-1 focus:ring-[#7f1d2d]/20";

const textareaStyle =
  "textarea textarea-bordered min-h-32 w-full border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-[#7f1d2d] focus:outline-none focus:ring-1 focus:ring-[#7f1d2d]/20";

/* =========================================================
   TYPES
========================================================= */

type TeamMember = {
  id: string;
  name: string;
  designation: string;
  roleType: string;
  imageUrl: string;
  bio: string;
  email: string | null;
  facebookUrl: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  displayOrder: number;
  isActive: boolean;
};

type Goal = {
  id: string;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
};

type AboutData = {
  companyTitle: string;
  companySubtitle: string;
  heroImage: string;
  companyDescription: string;
  storyTitle: string;
  storyDescription: string;
  missionTitle: string;
  missionDescription: string;
  missionImage: string;
  visionTitle: string;
  visionDescription: string;
  visionImage: string;
  isActive: boolean;
  teamMembers: TeamMember[];
  features: Goal[];
};

type AboutImageField =
  | "heroImage"
  | "missionImage"
  | "visionImage"
  | "memberImage";

type AboutEditableField = Exclude<
  keyof AboutData,
  "teamMembers" | "features"
>;

type MemberForm = {
  name: string;
  designation: string;
  roleType: string;
  imageUrl: string;
  bio: string;
  email: string;
  facebookUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  displayOrder: number;
  isActive: boolean;
};

type GoalForm = {
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
};

type ApiResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  url?: string;
};

/* =========================================================
   DEFAULT DATA
========================================================= */

const emptyAbout: AboutData = {
  companyTitle: "About ROYS",
  companySubtitle: "",
  heroImage: "",
  companyDescription: "",
  storyTitle: "Our Story",
  storyDescription: "",
  missionTitle: "Our Mission",
  missionDescription: "",
  missionImage: "",
  visionTitle: "Our Vision",
  visionDescription: "",
  visionImage: "",
  isActive: true,
  teamMembers: [],
  features: [],
};

const emptyMember: MemberForm = {
  name: "",
  designation: "",
  roleType: "LEADERSHIP",
  imageUrl: "",
  bio: "",
  email: "",
  facebookUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
  displayOrder: 0,
  isActive: true,
};

const emptyGoal: GoalForm = {
  title: "",
  description: "",
  icon: "target",
  displayOrder: 0,
  isActive: true,
};

/* =========================================================
   API RESPONSE HANDLER
========================================================= */

async function readResponse<T = unknown>(
  response: Response,
): Promise<ApiResponse<T>> {
  const result = (await response.json().catch(() => ({}))) as ApiResponse<T>;

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Request failed.");
  }

  return result;
}

/* =========================================================
   REUSABLE INPUT COMPONENT
========================================================= */

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
};

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: InputFieldProps) {
  return (
    <label className="form-control w-full gap-2">
      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        className={inputStyle}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

/* =========================================================
   REUSABLE TEXTAREA COMPONENT
========================================================= */

type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: TextAreaFieldProps) {
  return (
    <label className="form-control w-full gap-2">
      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>

      <textarea
        className={textareaStyle}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

/* =========================================================
   REUSABLE IMAGE UPLOADER
========================================================= */

type ImageUploaderProps = {
  image: string;
  field: AboutImageField;
  label: string;
  uploading: string;
  member?: boolean;
  onImageChange: (
    event: ChangeEvent<HTMLInputElement>,
    field: AboutImageField,
  ) => void;
  onRemove: (field: AboutImageField) => void;
};

function ImageUploader({
  image,
  field,
  label,
  uploading,
  member = false,
  onImageChange,
  onRemove,
}: ImageUploaderProps) {
  const isUploading = uploading === field;

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        {image ? (
          <div className="relative">
            <Image
              src={image}
              alt={label}
              width={800}
              height={500}
              unoptimized
              className={
                member
                  ? "h-48 w-full object-cover"
                  : "h-56 w-full object-cover"
              }
            />

            <button
              type="button"
              onClick={() => onRemove(field)}
              className="btn btn-circle btn-sm btn-error absolute right-3 top-3"
              title="Remove image"
              disabled={isUploading}
            >
              <X size={15} />
            </button>

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                <div className="flex items-center gap-2 font-semibold">
                  <Loader2 className="animate-spin" size={22} />
                  Uploading...
                </div>
              </div>
            )}
          </div>
        ) : (
          <label className="flex h-48 cursor-pointer flex-col items-center justify-center gap-3 text-slate-500 transition hover:bg-slate-100">
            {isUploading ? (
              <Loader2 className="animate-spin" size={30} />
            ) : (
              <ImagePlus size={34} />
            )}

            <span className="text-sm font-medium">
              {isUploading ? "Uploading..." : "Choose Image"}
            </span>

            <span className="text-xs">
              PNG, JPG, WEBP · Max 5MB
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              disabled={uploading !== ""}
              onChange={(event) => onImageChange(event, field)}
            />
          </label>
        )}

        {image && (
          <label
            className={`flex cursor-pointer items-center justify-center gap-2 border-t border-slate-200 p-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 ${
              uploading !== "" ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <Upload size={16} />
            Change Image

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              disabled={uploading !== ""}
              onChange={(event) => onImageChange(event, field)}
            />
          </label>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN ADMIN ABOUT PAGE
========================================================= */

export default function AdminAboutPage() {
  /* -------------------------------------------------------
     STATES
  ------------------------------------------------------- */

  const [about, setAbout] = useState<AboutData>(emptyAbout);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [memberForm, setMemberForm] = useState<MemberForm>({
    ...emptyMember,
  });

  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [memberModal, setMemberModal] = useState(false);
  const [savingMember, setSavingMember] = useState(false);

  const [goalForm, setGoalForm] = useState<GoalForm>({
    ...emptyGoal,
  });

  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [goalModal, setGoalModal] = useState(false);
  const [savingGoal, setSavingGoal] = useState(false);

  const [deleting, setDeleting] = useState("");

  /* -------------------------------------------------------
     COMMON API REQUEST
  ------------------------------------------------------- */

  const request = useCallback(
    async <T = unknown,>(
      path: string,
      options: RequestInit = {},
    ): Promise<ApiResponse<T>> => {
      const headers = new Headers(options.headers);

      if (!(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
      }

      const response = await fetch(`${API_BASE}/about${path}`, {
        ...options,
        headers,
        credentials: "include",
      });

      return readResponse<T>(response);
    },
    [],
  );

  /* -------------------------------------------------------
     LOAD ABOUT DATA
  ------------------------------------------------------- */

  const loadAbout = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await request<Partial<AboutData>>("/admin");

      if (result.data) {
        setAbout({
          ...emptyAbout,
          ...result.data,
          teamMembers: Array.isArray(result.data.teamMembers)
            ? result.data.teamMembers
            : [],
          features: Array.isArray(result.data.features)
            ? result.data.features
            : [],
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load About page.",
      );
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    void loadAbout();
  }, [loadAbout]);

  /* -------------------------------------------------------
     CLOUDINARY IMAGE UPLOAD
     Uses existing Next.js /api/upload endpoint
  ------------------------------------------------------- */

  const uploadImage = async (file: File): Promise<string> => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image size must be below 5MB.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const result = await readResponse(response);

    if (!result.url || typeof result.url !== "string") {
      throw new Error("Cloudinary image URL was not returned.");
    }

    return result.url;
  };

  /* -------------------------------------------------------
     HANDLE IMAGE CHANGE
  ------------------------------------------------------- */

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
    field: AboutImageField,
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    setError("");
    setMessage("");
    setUploading(field);

    try {
      const url = await uploadImage(file);

      if (field === "memberImage") {
        setMemberForm((prev) => ({
          ...prev,
          imageUrl: url,
        }));
      } else {
        setAbout((prev) => ({
          ...prev,
          [field]: url,
        }));
      }

      setMessage("Image uploaded successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Image upload failed.",
      );
    } finally {
      setUploading("");
    }
  };

  /* -------------------------------------------------------
     REMOVE IMAGE
  ------------------------------------------------------- */

  const removeImage = (field: AboutImageField) => {
    if (field === "memberImage") {
      setMemberForm((prev) => ({
        ...prev,
        imageUrl: "",
      }));
      return;
    }

    setAbout((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  /* -------------------------------------------------------
     UPDATE ABOUT FIELD
  ------------------------------------------------------- */

  const updateAbout = (
    field: AboutEditableField,
    value: string | boolean,
  ) => {
    setAbout((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* -------------------------------------------------------
     SAVE COMPANY INFORMATION
  ------------------------------------------------------- */

  const saveAbout = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const result = await request<Partial<AboutData>>("/page", {
        method: "PATCH",
        body: JSON.stringify({
          companyTitle: about.companyTitle,
          companySubtitle: about.companySubtitle,
          heroImage: about.heroImage,
          companyDescription: about.companyDescription,

          storyTitle: about.storyTitle,
          storyDescription: about.storyDescription,

          missionTitle: about.missionTitle,
          missionDescription: about.missionDescription,
          missionImage: about.missionImage,

          visionTitle: about.visionTitle,
          visionDescription: about.visionDescription,
          visionImage: about.visionImage,

          isActive: about.isActive,
        }),
      });

      if (result.data) {
        setAbout((prev) => ({
          ...prev,
          ...result.data,
        }));
      }

      setMessage("Company information saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save information.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     TEAM MEMBER FUNCTIONS
  ======================================================= */

  const openNewMember = () => {
    setMemberForm({ ...emptyMember });
    setEditingMember(null);
    setMemberModal(true);
    setError("");
  };

  const openEditMember = (member: TeamMember) => {
    setMemberForm({
      name: member.name,
      designation: member.designation,
      roleType: member.roleType,
      imageUrl: member.imageUrl || "",
      bio: member.bio || "",
      email: member.email || "",
      facebookUrl: member.facebookUrl || "",
      linkedinUrl: member.linkedinUrl || "",
      instagramUrl: member.instagramUrl || "",
      displayOrder: member.displayOrder,
      isActive: member.isActive,
    });

    setEditingMember(member.id);
    setMemberModal(true);
    setError("");
  };

  /* -------------------------------------------------------
     SAVE TEAM MEMBER
  ------------------------------------------------------- */

  const saveMember = async () => {
    if (!memberForm.name.trim() || !memberForm.designation.trim()) {
      setError("Member name and designation are required.");
      return;
    }

    setSavingMember(true);
    setError("");
    setMessage("");

    try {
      const result = await request<TeamMember>(
        editingMember ? `/team/${editingMember}` : "/team",
        {
          method: editingMember ? "PATCH" : "POST",
          body: JSON.stringify(memberForm),
        },
      );

      if (!result.data) {
        throw new Error("Member data was not returned by the server.");
      }

      const member = result.data;

      setAbout((prev) => ({
        ...prev,
        teamMembers: editingMember
          ? prev.teamMembers.map((item) =>
              item.id === editingMember ? member : item,
            )
          : [...prev.teamMembers, member].sort(
              (a, b) => a.displayOrder - b.displayOrder,
            ),
      }));

      setMemberModal(false);
      setMemberForm({ ...emptyMember });
      setEditingMember(null);

      setMessage("Team member saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save team member.",
      );
    } finally {
      setSavingMember(false);
    }
  };

  /* -------------------------------------------------------
     DELETE TEAM MEMBER
  ------------------------------------------------------- */

  const deleteMember = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }

    setDeleting(id);
    setError("");
    setMessage("");

    try {
      await request(`/team/${id}`, {
        method: "DELETE",
      });

      setAbout((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.filter(
          (member) => member.id !== id,
        ),
      }));

      setMessage("Team member deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete member.",
      );
    } finally {
      setDeleting("");
    }
  };

  /* =======================================================
     GOAL FUNCTIONS
  ======================================================= */

  const openNewGoal = () => {
    setGoalForm({ ...emptyGoal });
    setEditingGoal(null);
    setGoalModal(true);
    setError("");
  };

  const openEditGoal = (goal: Goal) => {
    setGoalForm({
      title: goal.title,
      description: goal.description,
      icon: goal.icon,
      displayOrder: goal.displayOrder,
      isActive: goal.isActive,
    });

    setEditingGoal(goal.id);
    setGoalModal(true);
    setError("");
  };

  /* -------------------------------------------------------
     SAVE GOAL
  ------------------------------------------------------- */

  const saveGoal = async () => {
    if (!goalForm.title.trim()) {
      setError("Goal title is required.");
      return;
    }

    setSavingGoal(true);
    setError("");
    setMessage("");

    try {
      const result = await request<Goal>(
        editingGoal ? `/features/${editingGoal}` : "/features",
        {
          method: editingGoal ? "PATCH" : "POST",
          body: JSON.stringify(goalForm),
        },
      );

      if (!result.data) {
        throw new Error("Goal data was not returned by the server.");
      }

      const goal = result.data;

      setAbout((prev) => ({
        ...prev,
        features: editingGoal
          ? prev.features.map((item) =>
              item.id === editingGoal ? goal : item,
            )
          : [...prev.features, goal].sort(
              (a, b) => a.displayOrder - b.displayOrder,
            ),
      }));

      setGoalModal(false);
      setGoalForm({ ...emptyGoal });
      setEditingGoal(null);

      setMessage("Goal saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save goal.",
      );
    } finally {
      setSavingGoal(false);
    }
  };

  /* -------------------------------------------------------
     DELETE GOAL
  ------------------------------------------------------- */

  const deleteGoal = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) {
      return;
    }

    setDeleting(id);
    setError("");
    setMessage("");

    try {
      await request(`/features/${id}`, {
        method: "DELETE",
      });

      setAbout((prev) => ({
        ...prev,
        features: prev.features.filter((goal) => goal.id !== id),
      }));

      setMessage("Goal deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete goal.",
      );
    } finally {
      setDeleting("");
    }
  };

  /* =======================================================
     LOADING UI
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <Loader2
          className="animate-spin text-[#7f1d2d]"
          size={36}
        />
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-slate-800">
      <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">

        {/* HEADER */}

        <div className="relative overflow-hidden rounded-2xl border border-[#7f1d2d]/10 bg-gradient-to-r from-[#7f1d2d] via-[#92283a] to-[#641725] p-5 text-white shadow-lg shadow-[#7f1d2d]/10 sm:p-7">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 right-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-white/70">
                <Building2 size={16} />
                Admin / Content Management / About
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                About ROYS
              </h1>

              <p className="mt-2 text-sm text-white/80">
                Manage company information, team members and goals.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href="/about"
                target="_blank"
                rel="noreferrer"
                className="btn border-white/30 bg-white/10 text-white hover:border-white hover:bg-white hover:text-[#7f1d2d]"
              >
                <Eye size={17} />
                Preview Page
              </a>

              <button
                type="button"
                onClick={() => void loadAbout()}
                className="btn border-white/30 bg-white/10 text-white hover:border-white hover:bg-white hover:text-[#7f1d2d]"
              >
                <RefreshCw size={17} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}

        {error && (
          <div className="alert border border-red-200 bg-red-50 text-red-700 shadow-sm">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error"
              className="ml-auto"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {message && (
          <div className="alert border border-green-200 bg-green-50 text-green-700 shadow-sm">
            <span>{message}</span>

            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Close message"
              className="ml-auto"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* PUBLIC PAGE STATUS */}

        <div className={cardStyle}>
          <div className="card-body flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-800">
                Public About Page
              </h3>

              <p className="text-sm text-slate-500">
                Control whether visitors can see the About page.
              </p>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <span
                className={`text-sm font-semibold ${
                  about.isActive ? "text-green-700" : "text-slate-500"
                }`}
              >
                {about.isActive ? "Active" : "Inactive"}
              </span>

              <input
                type="checkbox"
                className="toggle [--tglbg:#cbd5e1] checked:[--tglbg:#7f1d2d]"
                checked={about.isActive}
                onChange={(event) =>
                  updateAbout("isActive", event.target.checked)
                }
              />
            </label>
          </div>
        </div>

        {/* COMPANY HERO */}

        <section className={cardStyle}>
          <div className="card-body space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="rounded-xl bg-[#7f1d2d]/10 p-3 text-[#7f1d2d]">
                <Building2 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Company Banner
                </h2>

                <p className="text-sm text-slate-500">
                  Main ROYS introduction and banner image.
                </p>
              </div>
            </div>

            <ImageUploader
              image={about.heroImage}
              field="heroImage"
              label="Company Banner Image"
              uploading={uploading}
              onImageChange={handleImageChange}
              onRemove={removeImage}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Company Heading"
                value={about.companyTitle}
                onChange={(value) => updateAbout("companyTitle", value)}
                placeholder="About ROYS"
              />

              <InputField
                label="Company Subtitle"
                value={about.companySubtitle}
                onChange={(value) => updateAbout("companySubtitle", value)}
                placeholder="A better shopping experience"
              />
            </div>

            <TextAreaField
              label="Company Description"
              value={about.companyDescription}
              onChange={(value) =>
                updateAbout("companyDescription", value)
              }
              placeholder="Write about ROYS..."
            />
          </div>
        </section>

        {/* OUR STORY */}

        <section className={cardStyle}>
          <div className="card-body space-y-5">
            <div className="flex items-center gap-3">
              <BookOpen className="text-[#7f1d2d]" size={22} />

              <h2 className="text-xl font-bold text-slate-800">
                Our Story
              </h2>
            </div>

            <InputField
              label="Story Heading"
              value={about.storyTitle}
              onChange={(value) => updateAbout("storyTitle", value)}
            />

            <TextAreaField
              label="Story Description"
              value={about.storyDescription}
              onChange={(value) =>
                updateAbout("storyDescription", value)
              }
            />
          </div>
        </section>

        {/* OUR MISSION */}

        <section className={cardStyle}>
          <div className="card-body space-y-5">
            <div className="flex items-center gap-3">
              <Target className="text-[#7f1d2d]" size={22} />

              <h2 className="text-xl font-bold text-slate-800">
                Our Mission
              </h2>
            </div>

            <ImageUploader
              image={about.missionImage}
              field="missionImage"
              label="Mission Image"
              uploading={uploading}
              onImageChange={handleImageChange}
              onRemove={removeImage}
            />

            <InputField
              label="Mission Heading"
              value={about.missionTitle}
              onChange={(value) => updateAbout("missionTitle", value)}
            />

            <TextAreaField
              label="Mission Description"
              value={about.missionDescription}
              onChange={(value) =>
                updateAbout("missionDescription", value)
              }
            />
          </div>
        </section>

        {/* OUR VISION */}

        <section className={cardStyle}>
          <div className="card-body space-y-5">
            <div className="flex items-center gap-3">
              <Eye className="text-[#7f1d2d]" size={22} />

              <h2 className="text-xl font-bold text-slate-800">
                Our Vision
              </h2>
            </div>

            <ImageUploader
              image={about.visionImage}
              field="visionImage"
              label="Vision Image"
              uploading={uploading}
              onImageChange={handleImageChange}
              onRemove={removeImage}
            />

            <InputField
              label="Vision Heading"
              value={about.visionTitle}
              onChange={(value) => updateAbout("visionTitle", value)}
            />

            <TextAreaField
              label="Vision Description"
              value={about.visionDescription}
              onChange={(value) =>
                updateAbout("visionDescription", value)
              }
            />
          </div>
        </section>

        {/* SAVE COMPANY INFORMATION */}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => void saveAbout()}
            disabled={saving || uploading !== ""}
            className={`${primaryButton} min-h-12 w-full sm:w-auto sm:min-w-56`}
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Save Company Information
          </button>
        </div>

        {/* ===================================================
            TEAM MEMBERS
        =================================================== */}

        <section className={cardStyle}>
          <div className="card-body space-y-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#7f1d2d]/10 p-3 text-[#7f1d2d]">
                  <Users size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Company Members
                  </h2>

                  <p className="text-sm text-slate-500">
                    Manage your company team.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openNewMember}
                className={`${primaryButton} btn-sm`}
              >
                <Plus size={17} />
                Add Member
              </button>
            </div>

            {about.teamMembers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
                <Users
                  className="mx-auto mb-3 text-slate-400"
                  size={35}
                />

                <p className="font-semibold text-slate-700">
                  No team members added yet.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Add your first company member.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {about.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#7f1d2d]/30 hover:shadow-lg"
                  >
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        width={600}
                        height={400}
                        unoptimized
                        className="h-52 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-52 items-center justify-center bg-slate-50">
                        <Users size={40} className="text-slate-300" />
                      </div>
                    )}

                    <div className="space-y-2 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-slate-800">
                          {member.name}
                        </h3>

                        <span
                          className={`badge ${
                            member.isActive
                              ? "badge-success"
                              : "badge-ghost"
                          }`}
                        >
                          {member.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-[#7f1d2d]">
                        {member.designation}
                      </p>

                      {member.email && (
                        <p className="flex items-center gap-2 break-all text-xs text-slate-500">
                          <Mail size={14} />
                          {member.email}
                        </p>
                      )}

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => openEditMember(member)}
                          className="btn btn-outline btn-sm flex-1 border-slate-300 text-slate-700 hover:border-[#7f1d2d] hover:bg-[#7f1d2d] hover:text-white"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={deleting === member.id}
                          onClick={() => void deleteMember(member.id)}
                          className="btn btn-error btn-outline btn-sm"
                        >
                          {deleting === member.id ? (
                            <Loader2 className="animate-spin" size={15} />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            GOALS
        =================================================== */}

        <section className={cardStyle}>
          <div className="card-body space-y-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#7f1d2d]/10 p-3 text-[#7f1d2d]">
                  <Sparkles size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Our Goals
                  </h2>

                  <p className="text-sm text-slate-500">
                    Manage company goals and descriptions.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openNewGoal}
                className={`${primaryButton} btn-sm`}
              >
                <Plus size={17} />
                Add Goal
              </button>
            </div>

            {about.features.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
                <Target
                  className="mx-auto mb-3 text-slate-400"
                  size={35}
                />

                <p className="font-semibold text-slate-700">
                  No goals added yet.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Add your first company goal.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {about.features.map((goal) => (
                  <div
                    key={goal.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-[#7f1d2d]/30 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-lg bg-[#7f1d2d]/10 p-2 text-[#7f1d2d]">
                        <Target size={20} />
                      </span>

                      <span
                        className={`badge ${
                          goal.isActive
                            ? "badge-success"
                            : "badge-ghost"
                        }`}
                      >
                        {goal.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-800">
                      {goal.title}
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                      {goal.description}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditGoal(goal)}
                        className="btn btn-outline btn-sm flex-1 border-slate-300 text-slate-700 hover:border-[#7f1d2d] hover:bg-[#7f1d2d] hover:text-white"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={deleting === goal.id}
                        onClick={() => void deleteGoal(goal.id)}
                        className="btn btn-error btn-outline btn-sm"
                      >
                        {deleting === goal.id ? (
                          <Loader2 className="animate-spin" size={15} />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            MEMBER MODAL
        =================================================== */}

        {memberModal && (
          <div className="modal modal-open bg-black/40 p-3">
            <div className="modal-box max-h-[90vh] max-w-2xl overflow-y-auto border border-slate-200 bg-white text-slate-800 shadow-2xl">
              <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {editingMember ? "Edit Member" : "Add Company Member"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Add or update company team information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMemberModal(false)}
                  className="btn btn-circle btn-ghost btn-sm text-slate-600 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <ImageUploader
                  image={memberForm.imageUrl}
                  field="memberImage"
                  label="Member Photo"
                  member
                  uploading={uploading}
                  onImageChange={handleImageChange}
                  onRemove={removeImage}
                />

                <InputField
                  label="Full Name"
                  value={memberForm.name}
                  onChange={(value) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      name: value,
                    }))
                  }
                  placeholder="Enter member name"
                />

                <InputField
                  label="Designation"
                  value={memberForm.designation}
                  onChange={(value) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      designation: value,
                    }))
                  }
                  placeholder="e.g. Chief Executive Officer"
                />

                <InputField
                  label="Email Address"
                  type="email"
                  value={memberForm.email}
                  onChange={(value) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      email: value,
                    }))
                  }
                  placeholder="member@example.com"
                />

                <div className="form-control gap-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Member Category
                  </label>

                  <select
                    className="select select-bordered w-full border-slate-300 bg-white text-slate-800 focus:border-[#7f1d2d] focus:outline-none"
                    value={memberForm.roleType}
                    onChange={(event) =>
                      setMemberForm((prev) => ({
                        ...prev,
                        roleType: event.target.value,
                      }))
                    }
                  >
                    <option value="LEADERSHIP">Leadership</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>

                <TextAreaField
                  label="Member Bio"
                  value={memberForm.bio}
                  onChange={(value) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      bio: value,
                    }))
                  }
                />

                <InputField
                  label="Facebook URL"
                  value={memberForm.facebookUrl}
                  onChange={(value) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      facebookUrl: value,
                    }))
                  }
                />

                <InputField
                  label="LinkedIn URL"
                  value={memberForm.linkedinUrl}
                  onChange={(value) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      linkedinUrl: value,
                    }))
                  }
                />

                <InputField
                  label="Instagram URL"
                  value={memberForm.instagramUrl}
                  onChange={(value) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      instagramUrl: value,
                    }))
                  }
                />

                <InputField
                  label="Display Order"
                  type="number"
                  value={String(memberForm.displayOrder)}
                  onChange={(value) =>
                    setMemberForm((prev) => ({
                      ...prev,
                      displayOrder: Number(value) || 0,
                    }))
                  }
                />

                <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <input
                    type="checkbox"
                    className="checkbox border-slate-300 checked:border-[#7f1d2d] checked:bg-[#7f1d2d]"
                    checked={memberForm.isActive}
                    onChange={(event) =>
                      setMemberForm((prev) => ({
                        ...prev,
                        isActive: event.target.checked,
                      }))
                    }
                  />

                  <span className="text-sm font-medium text-slate-700">
                    Show this member publicly
                  </span>
                </label>
              </div>

              <div className="modal-action border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setMemberModal(false)}
                  className="btn btn-ghost text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void saveMember()}
                  disabled={savingMember || uploading !== ""}
                  className={primaryButton}
                >
                  {savingMember ? (
                    <Loader2 className="animate-spin" size={17} />
                  ) : (
                    <Save size={17} />
                  )}
                  Save Member
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            GOAL MODAL
        =================================================== */}

        {goalModal && (
          <div className="modal modal-open bg-black/40 p-3">
            <div className="modal-box max-w-xl border border-slate-200 bg-white text-slate-800 shadow-2xl">
              <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {editingGoal ? "Edit Goal" : "Add New Goal"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage your company goal information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setGoalModal(false)}
                  className="btn btn-circle btn-ghost btn-sm text-slate-600 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <InputField
                  label="Goal Title"
                  value={goalForm.title}
                  onChange={(value) =>
                    setGoalForm((prev) => ({
                      ...prev,
                      title: value,
                    }))
                  }
                  placeholder="e.g. Customer Satisfaction"
                />

                <TextAreaField
                  label="Goal Description"
                  value={goalForm.description}
                  onChange={(value) =>
                    setGoalForm((prev) => ({
                      ...prev,
                      description: value,
                    }))
                  }
                  placeholder="Describe your company goal..."
                />

                <InputField
                  label="Icon Name"
                  value={goalForm.icon}
                  onChange={(value) =>
                    setGoalForm((prev) => ({
                      ...prev,
                      icon: value,
                    }))
                  }
                  placeholder="target"
                />

                <InputField
                  label="Display Order"
                  type="number"
                  value={String(goalForm.displayOrder)}
                  onChange={(value) =>
                    setGoalForm((prev) => ({
                      ...prev,
                      displayOrder: Number(value) || 0,
                    }))
                  }
                />

                <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <input
                    type="checkbox"
                    className="checkbox border-slate-300 checked:border-[#7f1d2d] checked:bg-[#7f1d2d]"
                    checked={goalForm.isActive}
                    onChange={(event) =>
                      setGoalForm((prev) => ({
                        ...prev,
                        isActive: event.target.checked,
                      }))
                    }
                  />

                  <span className="text-sm font-medium text-slate-700">
                    Show this goal publicly
                  </span>
                </label>
              </div>

              <div className="modal-action border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setGoalModal(false)}
                  className="btn btn-ghost text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void saveGoal()}
                  disabled={savingGoal}
                  className={primaryButton}
                >
                  {savingGoal ? (
                    <Loader2 className="animate-spin" size={17} />
                  ) : (
                    <Save size={17} />
                  )}
                  Save Goal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
