
"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Store,
  Truck,
  Megaphone,
  Globe,
  Settings as SettingsIcon,
  Loader2,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  logoUrl: string;

  deliveryCharge: number;
  freeShippingThreshold: number;

  maintenanceMode: boolean;
  announcementEnabled: boolean;
  announcementText: string;

  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
}

const initialSettings: StoreSettings = {
  storeName: "ROYS",
  storeEmail: "",
  storePhone: "",
  storeAddress: "",
  logoUrl: "",

  deliveryCharge: 110,
  freeShippingThreshold: 2000,

  maintenanceMode: false,
  announcementEnabled: true,
  announcementText: "Free Shipping on Orders Over ৳2000",

  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  tiktokUrl: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] =
    useState<StoreSettings>(initialSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch Settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/settings`, {
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load settings");
        }

        setSettings({
          ...initialSettings,
          ...result.data,
          deliveryCharge: Number(result.data.deliveryCharge ?? 110),
          freeShippingThreshold: Number(
            result.data.freeShippingThreshold ?? 2000,
          ),
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load settings",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // Input Handler
  function handleChange(
    field: keyof StoreSettings,
    value: string | number | boolean,
  ) {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSuccess("");
  }

  // Save Settings
  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (settings.deliveryCharge < 0) {
        throw new Error("Delivery charge cannot be negative.");
      }

      if (settings.freeShippingThreshold < 0) {
        throw new Error("Free shipping threshold cannot be negative.");
      }

      const response = await fetch(`${API_URL}/api/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save settings");
      }

      setSettings({
        ...initialSettings,
        ...result.data,
        deliveryCharge: Number(result.data.deliveryCharge),
        freeShippingThreshold: Number(
          result.data.freeShippingThreshold,
        ),
      });

      setSuccess("Settings saved successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#7f1d2d]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <SettingsIcon className="text-[#7f1d2d]" size={25} />
              <h1 className="text-2xl font-bold text-gray-900">
                Store Settings
              </h1>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Manage your store information and configurations.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex h-11 items-center gap-2 rounded-xl bg-[#7f1d2d] px-6 text-sm font-semibold text-white transition hover:bg-[#681725] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="space-y-6">

          {/* GENERAL SETTINGS */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-gray-100 p-3">
                <Store size={21} className="text-[#7f1d2d]" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  General Settings
                </h2>
                <p className="text-xs text-gray-500">
                  Basic information about your store.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Store Name"
                value={settings.storeName}
                onChange={(value) => handleChange("storeName", value)}
              />

              <InputField
                label="Store Email"
                type="email"
                value={settings.storeEmail}
                onChange={(value) => handleChange("storeEmail", value)}
              />

              <InputField
                label="Store Phone"
                value={settings.storePhone}
                onChange={(value) => handleChange("storePhone", value)}
              />

              <InputField
                label="Logo URL"
                value={settings.logoUrl}
                onChange={(value) => handleChange("logoUrl", value)}
                placeholder="https://example.com/logo.png"
              />

              <div className="md:col-span-2">
                <InputField
                  label="Store Address"
                  value={settings.storeAddress}
                  onChange={(value) => handleChange("storeAddress", value)}
                />
              </div>
            </div>
          </section>

          {/* DELIVERY SETTINGS */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-gray-100 p-3">
                <Truck size={21} className="text-[#7f1d2d]" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Delivery Settings
                </h2>
                <p className="text-xs text-gray-500">
                  Control delivery charges and free shipping.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Delivery Charge (৳)"
                type="number"
                value={String(settings.deliveryCharge)}
                onChange={(value) =>
                  handleChange("deliveryCharge", Number(value))
                }
              />

              <InputField
                label="Free Shipping Threshold (৳)"
                type="number"
                value={String(settings.freeShippingThreshold)}
                onChange={(value) =>
                  handleChange("freeShippingThreshold", Number(value))
                }
              />
            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-800">
                Delivery Preview
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Order below ৳
                {settings.freeShippingThreshold.toLocaleString("en-BD")}
                {" "} → Delivery Charge ৳
                {settings.deliveryCharge.toLocaleString("en-BD")}
              </p>

              <p className="mt-1 text-sm text-green-600">
                Order of ৳
                {settings.freeShippingThreshold.toLocaleString("en-BD")}
                {" "}or more → Free Delivery
              </p>
            </div>
          </section>

          {/* ANNOUNCEMENT SETTINGS */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-gray-100 p-3">
                <Megaphone size={21} className="text-[#7f1d2d]" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Announcement Bar
                </h2>
                <p className="text-xs text-gray-500">
                  Manage your website top announcement.
                </p>
              </div>
            </div>

            <ToggleField
              label="Enable Announcement"
              description="Show announcement on the customer website."
              checked={settings.announcementEnabled}
              onChange={(value) =>
                handleChange("announcementEnabled", value)
              }
            />

            <div className="mt-5">
              <InputField
                label="Announcement Text"
                value={settings.announcementText}
                onChange={(value) =>
                  handleChange("announcementText", value)
                }
                placeholder="Free Shipping on Orders Over ৳2000"
              />
            </div>
          </section>

          {/* STORE STATUS */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-gray-100 p-3">
                <SettingsIcon size={21} className="text-[#7f1d2d]" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Store Status
                </h2>
                <p className="text-xs text-gray-500">
                  Control customer access to your store.
                </p>
              </div>
            </div>

            <ToggleField
              label="Maintenance Mode"
              description="Temporarily prevent customers from placing new orders."
              checked={settings.maintenanceMode}
              onChange={(value) =>
                handleChange("maintenanceMode", value)
              }
            />

            {settings.maintenanceMode && (
              <div className="mt-4 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
                Maintenance mode is enabled. New orders will be blocked by
                the backend.
              </div>
            )}
          </section>

          {/* SOCIAL MEDIA */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-gray-100 p-3">
                <Globe size={21} className="text-[#7f1d2d]" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Social Media Links
                </h2>
                <p className="text-xs text-gray-500">
                  Add your official social media pages.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Facebook URL"
                value={settings.facebookUrl}
                onChange={(value) => handleChange("facebookUrl", value)}
                placeholder="https://facebook.com/..."
              />

              <InputField
                label="Instagram URL"
                value={settings.instagramUrl}
                onChange={(value) => handleChange("instagramUrl", value)}
                placeholder="https://instagram.com/..."
              />

              <InputField
                label="YouTube URL"
                value={settings.youtubeUrl}
                onChange={(value) => handleChange("youtubeUrl", value)}
                placeholder="https://youtube.com/..."
              />

              <InputField
                label="TikTok URL"
                value={settings.tiktokUrl}
                onChange={(value) => handleChange("tiktokUrl", value)}
                placeholder="https://tiktok.com/..."
              />
            </div>
          </section>

          {/* BOTTOM SAVE */}
          <div className="flex justify-end pb-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex h-12 items-center gap-2 rounded-xl bg-[#7f1d2d] px-7 text-sm font-semibold text-white transition hover:bg-[#681725] disabled:opacity-60"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save All Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Input
function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={type === "number" ? 0 : undefined}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-[#7f1d2d] focus:ring-2 focus:ring-[#7f1d2d]/10"
      />
    </div>
  );
}

// Reusable Toggle
function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
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
