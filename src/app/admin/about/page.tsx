
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  Users,
  Sparkles,
  Building2,
  BookOpen,
  Target,
  Eye,
  ImagePlus,
  X,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ==========================================
// TYPES
// ==========================================

type TeamMember = {
  id: string;
  name: string;
  designation: string;
  roleType: "LEADERSHIP" | "GENERAL";
  imageUrl: string;
  bio: string;
  email?: string | null;
  facebookUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
};

type Feature = {
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
  features: Feature[];
};

// ==========================================
// INITIAL DATA
// ==========================================

const initialData: AboutData = {
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

const inputClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#7f1d2d] focus:ring-2 focus:ring-[#7f1d2d]/10";

const labelClass =
  "block text-sm font-semibold text-gray-700";

// ==========================================
// IMAGE URL HELPER
// ==========================================

function getImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return "";

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("blob:")
  ) {
    return imageUrl;
  }

  return `${API_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutData>(initialData);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // TEAM FORM
  // ========================================

  const [teamForm, setTeamForm] = useState({
    name: "",
    designation: "",
    roleType: "LEADERSHIP",
    bio: "",
    email: "",
    facebookUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
    displayOrder: 0,
  });

  const [teamImageFile, setTeamImageFile] = useState<File | null>(null);
  const [teamImagePreview, setTeamImagePreview] = useState("");

  // ========================================
  // FEATURE FORM
  // ========================================

  const [featureForm, setFeatureForm] = useState({
    title: "",
    description: "",
    icon: "star",
    displayOrder: 0,
  });

  // ========================================
  // PREVIEW CLEANUP
  // ========================================

  useEffect(() => {
    return () => {
      if (teamImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(teamImagePreview);
      }
    };
  }, [teamImagePreview]);

  // ========================================
  // API HELPER
  // ========================================

  const request = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const isFormData = options.body instanceof FormData;

      const response = await fetch(
        `${API_URL}/api/about${path}`,
        {
          ...options,
          credentials: "include",
          headers: {
            ...(!isFormData && options.body
              ? { "Content-Type": "application/json" }
              : {}),
            ...options.headers,
          },
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Request failed.",
        );
      }

      return result.data;
    },
    [],
  );

  // ========================================
  // LOAD DATA
  // ========================================

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await request("/admin");

      setData({
        ...initialData,
        ...result,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load About page.",
      );
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // ========================================
  // UPDATE FIELD
  // ========================================

  const updateField = (
    field: keyof AboutData,
    value: string | boolean,
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSuccess("");
  };

  // ========================================
  // IMAGE SELECT
  // ========================================

  const handleTeamImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setTeamImageFile(file);
    setTeamImagePreview(URL.createObjectURL(file));
  };

  // ========================================
  // REMOVE SELECTED IMAGE
  // ========================================

  const removeTeamImage = () => {
    setTeamImageFile(null);
    setTeamImagePreview("");
  };

  // ========================================
  // SAVE ABOUT PAGE
  // ========================================

  const savePage = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        companyTitle: data.companyTitle,
        companySubtitle: data.companySubtitle,
        heroImage: data.heroImage,
        companyDescription: data.companyDescription,

        storyTitle: data.storyTitle,
        storyDescription: data.storyDescription,

        missionTitle: data.missionTitle,
        missionDescription: data.missionDescription,
        missionImage: data.missionImage,

        visionTitle: data.visionTitle,
        visionDescription: data.visionDescription,
        visionImage: data.visionImage,

        isActive: data.isActive,
      };

      const result = await request("/page", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setData((prev) => ({
        ...prev,
        ...result,
      }));

      setSuccess(
        "About page information saved successfully!",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save About page.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // ADD TEAM MEMBER WITH IMAGE UPLOAD
  // ========================================

  const addTeamMember = async () => {
    try {
      setError("");
      setSuccess("");

      if (!teamForm.name.trim()) {
        throw new Error("Please enter team member name.");
      }

      if (!teamForm.designation.trim()) {
        throw new Error("Please enter designation.");
      }

      if (!teamImageFile) {
        throw new Error("Please select a profile image.");
      }

      const formData = new FormData();

      Object.entries(teamForm).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      formData.append("image", teamImageFile);

      const created = await request("/team", {
        method: "POST",
        body: formData,
      });

      setData((prev) => ({
        ...prev,
        teamMembers: [
          ...prev.teamMembers,
          created,
        ],
      }));

      setTeamForm({
        name: "",
        designation: "",
        roleType: "LEADERSHIP",
        bio: "",
        email: "",
        facebookUrl: "",
        linkedinUrl: "",
        instagramUrl: "",
        displayOrder: 0,
      });

      setTeamImageFile(null);
      setTeamImagePreview("");

      setSuccess("Team member added successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to add team member.",
      );
    }
  };

  // ========================================
  // TOGGLE TEAM MEMBER
  // ========================================

  const toggleTeam = async (member: TeamMember) => {
    try {
      setError("");

      const updated = await request(
        `/team/${member.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isActive: !member.isActive,
          }),
        },
      );

      setData((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.map((item) =>
          item.id === member.id ? updated : item,
        ),
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update member.",
      );
    }
  };

  // ========================================
  // DELETE TEAM MEMBER
  // ========================================

  const deleteTeam = async (id: string) => {
    if (!window.confirm("Delete this team member?")) {
      return;
    }

    try {
      setError("");

      await request(`/team/${id}`, {
        method: "DELETE",
      });

      setData((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.filter(
          (item) => item.id !== id,
        ),
      }));

      setSuccess("Team member deleted.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete member.",
      );
    }
  };

  // ========================================
  // ADD FEATURE
  // ========================================

  const addFeature = async () => {
    try {
      setError("");
      setSuccess("");

      if (!featureForm.title.trim()) {
        throw new Error("Please enter feature title.");
      }

      const created = await request("/features", {
        method: "POST",
        body: JSON.stringify(featureForm),
      });

      setData((prev) => ({
        ...prev,
        features: [
          ...prev.features,
          created,
        ],
      }));

      setFeatureForm({
        title: "",
        description: "",
        icon: "star",
        displayOrder: 0,
      });

      setSuccess("Feature added successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to add feature.",
      );
    }
  };

  // ========================================
  // TOGGLE FEATURE
  // ========================================

  const toggleFeature = async (feature: Feature) => {
    try {
      setError("");

      const updated = await request(
        `/features/${feature.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isActive: !feature.isActive,
          }),
        },
      );

      setData((prev) => ({
        ...prev,
        features: prev.features.map((item) =>
          item.id === feature.id ? updated : item,
        ),
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update feature.",
      );
    }
  };

  // ========================================
  // DELETE FEATURE
  // ========================================

  const deleteFeature = async (id: string) => {
    if (!window.confirm("Delete this feature?")) {
      return;
    }

    try {
      setError("");

      await request(`/features/${id}`, {
        method: "DELETE",
      });

      setData((prev) => ({
        ...prev,
        features: prev.features.filter(
          (item) => item.id !== id,
        ),
      }));

      setSuccess("Feature deleted.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete feature.",
      );
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2
          className="animate-spin text-[#7f1d2d]"
          size={32}
        />
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-7">

        {/* HEADER */}

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              About Us Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your website About Us page.
            </p>
          </div>

          <button
            onClick={savePage}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#7f1d2d] px-5 py-3 text-sm font-semibold text-white hover:bg-[#681725] disabled:opacity-60"
          >
            {saving ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </header>

        {/* MESSAGES */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* COMPANY INFORMATION */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-7">
          <SectionTitle
            icon={<Building2 size={20} />}
            title="Company Information"
            subtitle="Main heading and introduction."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Company Title"
              value={data.companyTitle}
              onChange={(v) => updateField("companyTitle", v)}
              placeholder="About ROYS"
            />

            <Field
              label="Company Subtitle"
              value={data.companySubtitle}
              onChange={(v) => updateField("companySubtitle", v)}
              placeholder="A little story about who we are"
            />

            <Field
              label="Hero Image URL"
              value={data.heroImage}
              onChange={(v) => updateField("heroImage", v)}
              placeholder="https://example.com/about-banner.jpg"
            />

            <div className="md:col-span-2">
              <TextArea
                label="Company Description"
                value={data.companyDescription}
                onChange={(v) => updateField("companyDescription", v)}
                placeholder="Write about your company..."
              />
            </div>
          </div>

          {data.heroImage && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold text-gray-500">
                Hero Image Preview
              </p>

              <img
                src={data.heroImage}
                alt="About hero preview"
                className="h-48 w-full rounded-xl object-cover"
              />
            </div>
          )}

          <Toggle
            label="Show About page publicly"
            checked={data.isActive}
            onChange={(v) => updateField("isActive", v)}
          />
        </section>

        {/* OUR STORY */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-7">
          <SectionTitle
            icon={<BookOpen size={20} />}
            title="Our Story"
            subtitle="Tell customers how ROYS started."
          />

          <Field
            label="Story Heading"
            value={data.storyTitle}
            onChange={(v) => updateField("storyTitle", v)}
          />

          <div className="mt-5">
            <TextArea
              label="Story Description"
              value={data.storyDescription}
              onChange={(v) => updateField("storyDescription", v)}
              placeholder="Write your company story..."
              rows={6}
            />
          </div>
        </section>

        {/* OUR MISSION */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-7">
          <SectionTitle
            icon={<Target size={20} />}
            title="Our Mission"
            subtitle="Explain your company's mission."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Mission Heading"
              value={data.missionTitle}
              onChange={(v) => updateField("missionTitle", v)}
            />

            <Field
              label="Mission Image URL"
              value={data.missionImage}
              onChange={(v) => updateField("missionImage", v)}
              placeholder="https://example.com/mission.jpg"
            />

            <div className="md:col-span-2">
              <TextArea
                label="Mission Description"
                value={data.missionDescription}
                onChange={(v) => updateField("missionDescription", v)}
                rows={4}
              />
            </div>
          </div>
        </section>

        {/* OUR VISION */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-7">
          <SectionTitle
            icon={<Eye size={20} />}
            title="Our Vision"
            subtitle="Describe your future goals."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Vision Heading"
              value={data.visionTitle}
              onChange={(v) => updateField("visionTitle", v)}
            />

            <Field
              label="Vision Image URL"
              value={data.visionImage}
              onChange={(v) => updateField("visionImage", v)}
              placeholder="https://example.com/vision.jpg"
            />

            <div className="md:col-span-2">
              <TextArea
                label="Vision Description"
                value={data.visionDescription}
                onChange={(v) => updateField("visionDescription", v)}
                rows={4}
              />
            </div>
          </div>
        </section>

        {/* TEAM MEMBERS */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-7">
          <SectionTitle
            icon={<Users size={20} />}
            title="Team Members"
            subtitle="Add leadership and general team members."
          />

          <div className="grid gap-4 md:grid-cols-2">

            <Field
              label="Full Name"
              value={teamForm.name}
              onChange={(v) =>
                setTeamForm((p) => ({ ...p, name: v }))
              }
            />

            <Field
              label="Designation"
              value={teamForm.designation}
              onChange={(v) =>
                setTeamForm((p) => ({ ...p, designation: v }))
              }
            />

            <label className={labelClass}>
              Team Category

              <select
                className={inputClass}
                value={teamForm.roleType}
                onChange={(e) =>
                  setTeamForm((p) => ({
                    ...p,
                    roleType: e.target.value,
                  }))
                }
              >
                <option value="LEADERSHIP">
                  Leadership
                </option>

                <option value="GENERAL">
                  General Team
                </option>
              </select>
            </label>

            {/* PROFILE IMAGE UPLOAD */}

            <div>
              <label className={labelClass}>
                Profile Image

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleTeamImageChange}
                  className="hidden"
                  id="team-profile-image"
                />
              </label>

              <label
                htmlFor="team-profile-image"
                className="mt-2 flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 transition hover:border-[#7f1d2d] hover:bg-[#7f1d2d]/5"
              >
                <ImagePlus size={19} className="text-[#7f1d2d]" />

                {teamImageFile
                  ? "Change Selected Image"
                  : "Choose Image From Computer"}
              </label>

              <p className="mt-2 text-xs text-gray-400">
                JPG, PNG, WEBP or GIF. Maximum size 5 MB.
              </p>

              {teamImagePreview && (
                <div className="relative mt-4 inline-block">
                  <img
                    src={teamImagePreview}
                    alt="Team member preview"
                    className="h-28 w-28 rounded-xl border border-gray-200 object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeTeamImage}
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700"
                    aria-label="Remove selected image"
                  >
                    <X size={15} />
                  </button>

                  <p className="mt-2 max-w-40 truncate text-xs text-gray-500">
                    {teamImageFile?.name}
                  </p>
                </div>
              )}
            </div>

            <Field
              label="Email"
              value={teamForm.email}
              onChange={(v) =>
                setTeamForm((p) => ({ ...p, email: v }))
              }
            />

            <Field
              label="Display Order"
              type="number"
              value={String(teamForm.displayOrder)}
              onChange={(v) =>
                setTeamForm((p) => ({
                  ...p,
                  displayOrder: Number(v),
                }))
              }
            />

            <div className="md:col-span-2">
              <TextArea
                label="Short Bio"
                value={teamForm.bio}
                onChange={(v) =>
                  setTeamForm((p) => ({ ...p, bio: v }))
                }
              />
            </div>

            <Field
              label="Facebook URL"
              value={teamForm.facebookUrl}
              onChange={(v) =>
                setTeamForm((p) => ({ ...p, facebookUrl: v }))
              }
            />

            <Field
              label="LinkedIn URL"
              value={teamForm.linkedinUrl}
              onChange={(v) =>
                setTeamForm((p) => ({ ...p, linkedinUrl: v }))
              }
            />

            <Field
              label="Instagram URL"
              value={teamForm.instagramUrl}
              onChange={(v) =>
                setTeamForm((p) => ({ ...p, instagramUrl: v }))
              }
            />
          </div>

          <button
            type="button"
            onClick={addTeamMember}
            disabled={!teamImageFile}
            className="mt-5 flex items-center gap-2 rounded-xl bg-[#7f1d2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#681725] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={17} />
            Add Team Member
          </button>

          {/* TEAM LIST */}

          <div className="mt-7 space-y-3">
            {data.teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 p-4"
              >
                {member.imageUrl ? (
                  <img
                    src={getImageUrl(member.imageUrl)}
                    alt={member.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                    <Users size={20} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">
                    {member.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {member.designation} · {member.roleType}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleTeam(member)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                    member.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {member.isActive ? "Active" : "Inactive"}
                </button>

                <button
                  type="button"
                  onClick={() => deleteTeam(member.id)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  aria-label="Delete team member"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}

            {data.teamMembers.length === 0 && (
              <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                No team members added yet.
              </p>
            )}
          </div>
        </section>

        {/* WHY CHOOSE ROYS */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-7">
          <SectionTitle
            icon={<Sparkles size={20} />}
            title="Why Choose ROYS"
            subtitle="Add reasons why customers should choose your store."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Feature Title"
              value={featureForm.title}
              onChange={(v) =>
                setFeatureForm((p) => ({ ...p, title: v }))
              }
              placeholder="Quality Products"
            />

            <Field
              label="Icon Name"
              value={featureForm.icon}
              onChange={(v) =>
                setFeatureForm((p) => ({ ...p, icon: v }))
              }
              placeholder="star, truck, shield-check"
            />

            <Field
              label="Display Order"
              type="number"
              value={String(featureForm.displayOrder)}
              onChange={(v) =>
                setFeatureForm((p) => ({
                  ...p,
                  displayOrder: Number(v),
                }))
              }
            />

            <div className="md:col-span-2">
              <TextArea
                label="Feature Description"
                value={featureForm.description}
                onChange={(v) =>
                  setFeatureForm((p) => ({
                    ...p,
                    description: v,
                  }))
                }
              />
            </div>
          </div>

          <button
            type="button"
            onClick={addFeature}
            className="mt-5 flex items-center gap-2 rounded-xl bg-[#7f1d2d] px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus size={17} />
            Add Feature
          </button>

          {/* FEATURE LIST */}

          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {data.features.map((feature) => (
              <div
                key={feature.id}
                className="rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {feature.title}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {feature.description}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      Icon: {feature.icon}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteFeature(feature.id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className={`mt-3 rounded-lg px-3 py-2 text-xs font-semibold ${
                    feature.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {feature.isActive
                    ? "Active — click to hide"
                    : "Inactive — click to show"}
                </button>
              </div>
            ))}

            {data.features.length === 0 && (
              <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                No features added yet.
              </p>
            )}
          </div>
        </section>

        {/* BOTTOM SAVE */}

        <div className="flex justify-end pb-10">
          <button
            onClick={savePage}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#7f1d2d] px-6 py-3 font-semibold text-white hover:bg-[#681725] disabled:opacity-60"
          >
            {saving ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {saving ? "Saving..." : "Save Page Information"}
          </button>
        </div>
      </div>
    </main>
  );
}

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="rounded-xl bg-[#7f1d2d]/10 p-3 text-[#7f1d2d]">
        {icon}
      </div>

      <div>
        <h2 className="font-bold text-gray-900">
          {title}
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className={labelClass}>
      {label}

      <input
        type={type}
        min={type === "number" ? 0 : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className={labelClass}>
      {label}

      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} resize-y`}
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 p-4">
      <span className="text-sm font-semibold text-gray-700">
        {label}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-[#7f1d2d]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
