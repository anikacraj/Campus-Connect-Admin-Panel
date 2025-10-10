'use client';

import React, { useRef, FormEvent } from "react";
import { useState } from "react";
import { Camera, Upload, X, ChevronDown } from "lucide-react";
import Image from "next/image";

// ---- Local Types ----
export type UniRequestPayload = {
  name: string;
  estd: number | string;
  location: string;
  type: string;
  website: string;
  bio: string;
  email: string;
  regNumber: string;
  logoImg?: string | null;
  coverImage?: string | null;
};

// ---- FormData State ----
type FormData = UniRequestPayload & {
  logo: string | null;
  logoPreview: string | null;
  coverImage: string | null;
  coverImagePreview: string | null;
};

// ---- Simple Frontend Error Checker ----
const getErrors = (data: FormData) => {
  const errors: Record<string, string> = {};
  if (!data.name) errors.name = "University name is required.";
  if (!data.estd) errors.estd = "Established year is required.";
  if (!data.location) errors.location = "Location is required.";
  if (!data.type) errors.type = "Type is required.";
  if (!data.website) errors.website = "Website is required.";
  if (!data.bio || data.bio.length < 20)
    errors.bio = "Bio must be at least 20 characters.";
  if (!data.email) errors.email = "Email is required.";
  if (!data.regNumber) errors.regNumber = "Registration number is required.";
  return errors;
};

export const UniRequestScreen: React.FC<{ prefill?: Partial<UniRequestPayload> }> = ({ prefill }) => {
  const [formData, setFormData] = useState<FormData>({
    name: prefill?.name || "",
    estd: prefill?.estd || "",
    location: prefill?.location || "",
    type: prefill?.type || "",
    website: prefill?.website || "",
    bio: prefill?.bio || "",
    email: prefill?.email || "",
    regNumber: prefill?.regNumber || "",
    logo: null,
    logoPreview: null,
    coverImage: null,
    coverImagePreview: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logoFileInputRef = useRef<HTMLInputElement | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);

  const universityTypes = ["Private", "Public"];

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if(file){
  //     const reader =new FileReader();
  //     reader.onloadend=()=>{
  //       const base64=reader.result as string;
  //       setPreview(base64);
  //       setFormData((prev) => ({ ...prev, logoImg: base64 }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };



  const handleFileSelect = (
    file: File | undefined,
    type: "logo" | "coverImage"
  ) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (type === "logo") {
        updateFormData("logo", result);
        updateFormData("logoPreview", result);
      } else {
        updateFormData("coverImage", result);
        updateFormData("coverImagePreview", result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChooseFile = (type: "logo" | "coverImage") => {
    if (type === "logo") logoFileInputRef.current?.click();
    else coverFileInputRef.current?.click();
  };

  const handleRemoveImage = (type: "logo" | "coverImage") => {
    if (type === "logo") {
      updateFormData("logo", null);
      updateFormData("logoPreview", null);
      if (logoFileInputRef.current) logoFileInputRef.current.value = "";
    } else {
      updateFormData("coverImage", null);
      updateFormData("coverImagePreview", null);
      if (coverFileInputRef.current) coverFileInputRef.current.value = "";
    }
  };

  const showError = (field: string) => submitAttempted || touched[field];
  const handleBlur = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const errors = getErrors(formData);
  const isFormValid = Object.keys(errors).length === 0 && !submitting;
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    const payload = {
      name: formData.name?.trim() || "",
      logo: formData.logo || "",
      coverImage: formData.coverImage || "",
      location: formData.location?.trim() || "",
      bio: formData.bio?.trim() || "",
      website: formData.website?.trim() || "",
      estd: Number(formData.estd) || 0,
      varsityEmail: formData.email?.trim() || "",
      type: formData.type?.trim() || "",
      regNumber: formData.regNumber?.trim() || "",
    };

    console.log("Submitting payload:", payload);

    const res = await fetch("/api/universities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Response:", data);

    if (res.ok) {
      alert("✅ University created successfully!");
      setFormData({
        name: "",
        estd: "",
        location: "",
        type: "",
        website: "",
        bio: "",
        email: "",
        regNumber: "",
        logo: null,
        logoPreview: null,
        coverImage: null,
        coverImagePreview: null,
      });
      setPreview(null);
    } else {
      alert(data.error || "Failed to create university");
    }
  } catch (err: any) {
    console.error("Error submitting form:", err);
    alert("Something went wrong while submitting the form.");
  } finally {
    setIsLoading(false);
  }
};



  const ImageUploadSection = ({
    title,
    type,
    preview,
    error,
    aspectRatio = "square",
  }: {
    title: string;
    type: "logo" | "coverImage";
    preview: string | null;
    error?: string;
    aspectRatio?: "square" | "wide";
  }) => (
    <div>
      <label className="text-sm font-medium mb-2 block">{title}</label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors hover:border-blue-500 cursor-pointer ${
          aspectRatio === "wide" ? "min-h-[200px]" : ""
        }`}
        onClick={() => (type)}
      >
        {preview ? (
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt={`${title} preview`}
              className={`mx-auto mb-2 object-contain rounded ${
                aspectRatio === "wide" ? "h-32 w-full max-w-md" : "h-24 w-24"
              }`}
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="px-3 py-1 border rounded-md text-sm flex items-center gap-1"
                onClick={(ev) => {
                  ev.stopPropagation();
                  handleChooseFile(type);
                }}
              >
                <Upload className="h-4 w-4" /> Replace
              </button>
              <button
                type="button"
                className="px-3 py-1 border rounded-md text-sm flex items-center gap-1"
                onClick={(ev) => {
                  ev.stopPropagation();
                  handleRemoveImage(type);
                }}
              >
                <X className="h-4 w-4" /> Remove
              </button>
            </div>
          </div>
        ) : (
          <>
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-2">
              Click to upload {title.toLowerCase()}
            </p>
            <button
              type="button"
              className="px-3 py-1 border rounded-md text-sm flex items-center gap-1"
              onClick={(ev) => {
                ev.stopPropagation();
                handleChooseFile(type);
              }}
            >
              <Upload className="h-4 w-4" /> Choose File
            </button>
          </>
        )}
      </div>
      {showError(type) && error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight mb-6">
          Request to Add Your University
        </h2>

        <div className="border rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-2">University Information</h3>
          <p className="text-sm text-gray-500 mb-6">
            Help us expand our network by adding your university.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploadSection
                title="University Logo"
                type="logo"
                preview={formData.logoPreview}
                error={errors.logo}
                aspectRatio="square"
              />

              <ImageUploadSection
                title="Cover Image"
                type="coverImage"
                preview={formData.coverImagePreview}
                error={errors.coverImage}
                aspectRatio="wide"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={logoFileInputRef}
              onChange={(ev) => {
                const file = ev.target.files?.[0];
                handleFileSelect(file, "logo");
                ev.currentTarget.value = "";
              }}
            />

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={coverFileInputRef}
              onChange={(ev) => {
                const file = ev.target.files?.[0];
                handleFileSelect(file, "coverImage");
                ev.currentTarget.value = "";
              }}
            />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="University Name *"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                />
                {showError("name") && errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Established Year *"
                  type="number"
                  value={formData.estd}
                  onChange={(e) => updateFormData("estd", e.target.value)}
                  onBlur={() => handleBlur("estd")}
                />
                {showError("estd") && errors.estd && (
                  <p className="text-sm text-red-500 mt-1">{errors.estd}</p>
                )}
              </div>

              <div>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Location *"
                  value={formData.location}
                  onChange={(e) => updateFormData("location", e.target.value)}
                  onBlur={() => handleBlur("location")}
                />
                {showError("location") && errors.location && (
                  <p className="text-sm text-red-500 mt-1">{errors.location}</p>
                )}
              </div>

              <div className="relative">
                <div
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => handleBlur("type")}
                >
                  <span
                    className={`flex-1 ${
                      !formData.type ? "text-gray-400" : ""
                    }`}
                  >
                    {formData.type || "University Type *"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border rounded-md shadow-lg">
                    {universityTypes.map((type) => (
                      <div
                        key={type}
                        className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          updateFormData("type", type);
                          setDropdownOpen(false);
                        }}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
                {showError("type") && errors.type && (
                  <p className="text-sm text-red-500 mt-1">{errors.type}</p>
                )}
              </div>
            </div>

            <div>
              <input
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Website URL (e.g., https://university.edu) *"
                type="url"
                value={formData.website}
                onChange={(e) => updateFormData("website", e.target.value)}
                onBlur={() => handleBlur("website")}
              />
              {showError("website") && errors.website && (
                <p className="text-sm text-red-500 mt-1">{errors.website}</p>
              )}
            </div>

            <div>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="University Bio/Description (min 20 characters) *"
                rows={4}
                value={formData.bio}
                onChange={(e) => updateFormData("bio", e.target.value)}
                onBlur={() => handleBlur("bio")}
              />
              <div className="flex justify-between items-center mt-1">
                {showError("bio") && errors.bio ? (
                  <p className="text-sm text-red-500">{errors.bio}</p>
                ) : (
                  <span></span>
                )}
                <span className="text-sm text-gray-500">
                  {formData.bio.length}/1000
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Contact Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                />
                {showError("email") && errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Registration / EIN Number *"
                  value={formData.regNumber}
                  onChange={(e) => updateFormData("regNumber", e.target.value)}
                  onBlur={() => handleBlur("regNumber")}
                />
                {showError("regNumber") && errors.regNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.regNumber}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full px-4 py-2 rounded-md bg-blue-600 text-white text-lg font-medium ${
                !isFormValid || submitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
              disabled={!isFormValid || submitting}
            >
              {submitting ? "Submitting..." : "Submit University Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UniRequestScreen;
