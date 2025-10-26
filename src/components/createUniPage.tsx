'use client';

import React, { useRef, useState } from "react";
import { Camera, Upload, X, ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export const UniRequestScreen: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const prefillData = {
    name: searchParams.get("name") || "",
    regNumber: searchParams.get("regNumber") || "",
    website: searchParams.get("website") || "",
    email: searchParams.get("email") || "",
  };

  const [formData, setFormData] = useState({
    name: prefillData.name,
    estd: "",
    location: "",
    type: "",
    website: prefillData.website,
    bio: "",
    email: prefillData.email,
    regNumber: prefillData.regNumber,
    logo: null as string | null,
    logoPreview: null as string | null,
    coverImage: null as string | null,
    coverImagePreview: null as string | null,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const logoFileRef = useRef<HTMLInputElement | null>(null);
  const coverFileRef = useRef<HTMLInputElement | null>(null);

  const universityTypes = ["Private", "Public"];

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getErrors = () => {
    const e: Record<string, string> = {};
    if (!formData.name) e.name = "Name is required";
    if (!formData.estd) e.estd = "Established year is required";
    if (!formData.location) e.location = "Location is required";
    if (!formData.type) e.type = "Type is required";
    if (!formData.website) e.website = "Website is required";
    if (!formData.bio || formData.bio.length < 20)
      e.bio = "Bio must be at least 20 characters";
    if (!formData.email) e.email = "Email is required";
    if (!formData.regNumber) e.regNumber = "Registration number is required";
    return e;
  };
  const errors = getErrors();

  const showError = (f: string) => touched[f] && errors[f];

  const handleFileSelect = (file: File | undefined, type: "logo" | "coverImage") => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (type === "logo")
        updateFormData("logoPreview", result);
      else
        updateFormData("coverImagePreview", result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ University created successfully!");
        router.push("/admin/allUniversity");
      } else {
        const data = await res.json();
        alert(data.error || "Submission failed");
      }
    } catch {
      alert("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const ImageUpload = ({
    title,
    preview,
    type,
  }: {
    title: string;
    preview: string | null;
    type: "logo" | "coverImage";
  }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold">{title}</label>
      <div
        className={`border-2 border-dashed rounded-xl p-5 text-center transition-all hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer ${
          preview ? "bg-white/80 shadow-sm" : "bg-gray-50/70"
        }`}
        onClick={() =>
          (type === "logo"
            ? logoFileRef.current?.click()
            : coverFileRef.current?.click())
        }
      >
        {preview ? (
          <div className="flex flex-col items-center gap-2">
            <Image
              src={preview}
              alt={`${title} preview`}
              width={120}
              height={120}
              className={`rounded-lg object-cover ${
                type === "coverImage" ? "w-full h-32" : "w-24 h-24"
              }`}
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileSelect(undefined, type);
                  updateFormData(
                    type === "logo" ? "logoPreview" : "coverImagePreview",
                    null
                  );
                }}
                className="px-3 py-1 border text-sm rounded-md hover:bg-red-50 text-red-500 flex items-center gap-1"
              >
                <X size={14} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <Camera className="w-10 h-10 mb-1" />
            <p className="text-xs mb-2">Upload {title}</p>
            <Upload className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-5 flex justify-center">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-5">
          <h2 className="text-2xl font-bold">Add a New University</h2>
          <p className="text-sm text-blue-100 mt-1">
            Fill out the details below to register your institution.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload title="University Logo" preview={formData.logoPreview} type="logo" />
            <ImageUpload title="Cover Image" preview={formData.coverImagePreview} type="coverImage" />
          </div>

          <input
            ref={logoFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0], "logo")}
          />
          <input
            ref={coverFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0], "coverImage")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "estd", "location"].map((field) => (
              <input
                key={field}
                placeholder={
                  field === "name"
                    ? "University Name *"
                    : field === "estd"
                    ? "Established Year *"
                    : "Location *"
                }
                type={field === "estd" ? "number" : "text"}
                value={(formData as any)[field]}
                onChange={(e) => updateFormData(field, e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, [field]: true }))}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all ${
                  showError(field) ? "border-red-400" : "border-gray-300"
                }`}
              />
            ))}

            <div className="relative">
              <div
                className={`flex items-center justify-between w-full border rounded-lg px-3 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-blue-400 ${
                  showError("type") ? "border-red-400" : "border-gray-300"
                }`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className={!formData.type ? "text-gray-400" : ""}>
                  {formData.type || "Select Type *"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              {dropdownOpen && (
                <div className="absolute bg-white border rounded-md mt-1 shadow-md w-full z-10">
                  {universityTypes.map((type) => (
                    <div
                      key={type}
                      onClick={() => {
                        updateFormData("type", type);
                        setDropdownOpen(false);
                      }}
                      className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <input
            type="url"
            placeholder="Website URL (https://example.edu) *"
            value={formData.website}
            onChange={(e) => updateFormData("website", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, website: true }))}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${
              showError("website") ? "border-red-400" : "border-gray-300"
            }`}
          />

          <textarea
            placeholder="University Bio (min 20 characters) *"
            rows={4}
            value={formData.bio}
            onChange={(e) => updateFormData("bio", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, bio: true }))}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${
              showError("bio") ? "border-red-400" : "border-gray-300"
            }`}
          ></textarea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Contact Email *"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${
                showError("email") ? "border-red-400" : "border-gray-300"
              }`}
            />

            <input
              placeholder="Registration / EIN Number *"
              value={formData.regNumber}
              onChange={(e) => updateFormData("regNumber", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, regNumber: true }))}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 ${
                showError("regNumber") ? "border-red-400" : "border-gray-300"
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 mt-10 rounded-lg text-white text-lg font-medium transition-all ${
              submitting
                ? "bg-blue-400 cursor-wait"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" /> Submitting...
              </span>
            ) : (
              "Submit University Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UniRequestScreen;
