'use client';

import React, { useRef, useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const logoFileRef = useRef<HTMLInputElement | null>(null);
  const coverFileRef = useRef<HTMLInputElement | null>(null);

  const universityTypes = ["Private", "Public"];

  // ✅ Fetch existing university data if regNumber exists (editing mode)
  useEffect(() => {
    const fetchUniversityData = async () => {
      if (!prefillData.regNumber) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/universities/${prefillData.regNumber}`);
        if (res.ok) {
          const { data } = await res.json();
          setFormData({
            name: data.name || "",
            estd: data.estd || "",
            location: data.location || "",
            type: data.type || "",
            website: data.website || "",
            bio: data.bio || "",
            email: data.email || "",
            regNumber: data.regNumber || "",
            logo: data.logo || null,
            logoPreview: data.logo || null,
            coverImage: data.coverImage || null,
            coverImagePreview: data.coverImage || null,
          });
        }
      } catch (error) {
        console.error("Failed to fetch university data:", error);
        alert("Failed to load university data for editing");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [prefillData.regNumber]);

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

  // ✅ Fixed: Better file handling with error checking
  const handleFileSelect = (file: File | undefined, type: "logo" | "coverImage") => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (type === "logo") {
        updateFormData("logoPreview", result);
        updateFormData("logo", result);
      } else {
        updateFormData("coverImagePreview", result);
        updateFormData("coverImage", result);
      }
    };
    reader.onerror = () => {
      console.error("Error reading file");
      alert("Error reading image file");
    };
    reader.readAsDataURL(file);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    const isEditing = !!prefillData.regNumber;
    const url = isEditing
      ? `/api/universities/${prefillData.regNumber}`
      : "/api/universities";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        estd: formData.estd,
        location: formData.location,
        type: formData.type,
        website: formData.website,
        bio: formData.bio,
        email: formData.email,
        regNumber: formData.regNumber,
        logo: formData.logo,
        coverImage: formData.coverImage,
        status: "pending", // ✅ Add status field
        reqBy: "admin", // ✅ Add reqBy field
      }),
    });

    if (res.ok) {
      alert(isEditing
        ? "✅ University updated successfully!"
        : "✅ University request submitted successfully! Waiting for approval."
      );
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

  // ✅ Fixed: Improved ImageUpload component with better image handling
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
        className={`border-2 border-dashed rounded-xl p-5 text-center transition-all hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer ${preview ? "bg-white/80 shadow-sm" : "bg-gray-50/70"
          }`}
        onClick={() => {
          if (type === "logo") {
            logoFileRef.current?.click();
          } else {
            coverFileRef.current?.click();
          }
        }}
      >
        {preview ? (
          <div className="flex flex-col items-center gap-2">
            <div className={`relative ${type === "coverImage" ? "w-full h-32" : "w-24 h-24"}`}>
              <Image
                src={preview}
                alt={`${title} preview`}
                fill
                className="rounded-lg object-cover"
                sizes={type === "coverImage" ? "100vw" : "96px"}
                onError={(e) => {
                  console.error(`Error loading ${title}:`, preview);
                  // Fallback to a placeholder or hide the image
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateFormData(type === "logo" ? "logoPreview" : "coverImagePreview", null);
                  updateFormData(type, null);
                }}
                className="px-3 py-1 border text-sm rounded-md hover:bg-red-50 text-red-500 flex items-center gap-1"
              >
                <X size={14} /> Remove
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (type === "logo") {
                    logoFileRef.current?.click();
                  } else {
                    coverFileRef.current?.click();
                  }
                }}
                className="px-3 py-1 border text-sm rounded-md hover:bg-blue-50 text-blue-600 flex items-center gap-1"
              >
                <Upload size={14} /> Change
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

  // ✅ Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          <p className="text-gray-600">Loading university data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-5 flex justify-center">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-5">
          <h2 className="text-2xl font-bold">
            {prefillData.regNumber ? "Update University" : "Add a New University"}
          </h2>
          <p className="text-sm text-blue-100 mt-1">
            {prefillData.regNumber
              ? "Modify the details below to update the institution."
              : "Fill out the details below to register your institution."
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload title="University Logo" preview={formData.logoPreview} type="logo" />
            <ImageUpload title="Cover Image" preview={formData.coverImagePreview} type="coverImage" />
          </div>

          {/* Hidden file inputs */}
          <input
            ref={logoFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleFileSelect(e.target.files?.[0], "logo");
              // Reset the input to allow selecting the same file again
              if (e.target) e.target.value = '';
            }}
          />
          <input
            ref={coverFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleFileSelect(e.target.files?.[0], "coverImage");
              // Reset the input to allow selecting the same file again
              if (e.target) e.target.value = '';
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                placeholder="University Name *"
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all ${showError("name") ? "border-red-400" : "border-gray-300"
                  }`}
              />
              {showError("name") && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                placeholder="Established Year *"
                type="number"
                value={formData.estd}
                onChange={(e) => updateFormData("estd", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, estd: true }))}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all ${showError("estd") ? "border-red-400" : "border-gray-300"
                  }`}
              />
              {showError("estd") && <p className="text-red-500 text-xs mt-1">{errors.estd}</p>}
            </div>
          </div>

          <div>
            <input
              placeholder="Location *"
              type="text"
              value={formData.location}
              onChange={(e) => updateFormData("location", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, location: true }))}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all ${showError("location") ? "border-red-400" : "border-gray-300"
                }`}
            />
            {showError("location") && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          <div className="relative">
            <div
              className={`flex items-center justify-between w-full border rounded-lg px-3 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-blue-400 ${showError("type") ? "border-red-400" : "border-gray-300"
                }`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className={!formData.type ? "text-gray-400" : ""}>
                {formData.type || "Select Type *"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </div>
            {showError("type") && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            {dropdownOpen && (
              <div className="absolute bg-white border rounded-md mt-1 shadow-md w-full z-10">
                {universityTypes.map((type) => (
                  <div
                    key={type}
                    onClick={() => {
                      updateFormData("type", type);
                      setDropdownOpen(false);
                      setTouched((t) => ({ ...t, type: true }));
                    }}
                    className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <input
              type="url"
              placeholder="Website URL (https://example.edu) *"
              value={formData.website}
              onChange={(e) => updateFormData("website", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, website: true }))}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none ${showError("website") ? "border-red-400" : "border-gray-300"
                }`}
            />
            {showError("website") && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
          </div>

          <div>
            <textarea
              placeholder="University Bio (min 20 characters) *"
              rows={4}
              value={formData.bio}
              onChange={(e) => updateFormData("bio", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, bio: true }))}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none ${showError("bio") ? "border-red-400" : "border-gray-300"
                }`}
            ></textarea>
            {showError("bio") && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="email"
                placeholder="Contact Email *"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none ${showError("email") ? "border-red-400" : "border-gray-300"
                  }`}
              />
              {showError("email") && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                placeholder="Registration / EIN Number *"
                value={formData.regNumber}
                onChange={(e) => updateFormData("regNumber", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, regNumber: true }))}
                disabled={!!prefillData.regNumber}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none ${showError("regNumber") ? "border-red-400" : "border-gray-300"
                  } ${prefillData.regNumber ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {showError("regNumber") && <p className="text-red-500 text-xs mt-1">{errors.regNumber}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || Object.keys(errors).length > 0}
            className={`w-full py-3 mt-10 rounded-lg text-white text-lg font-medium transition-all ${submitting || Object.keys(errors).length > 0
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
              }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" /> Submitting...
              </span>
            ) : prefillData.regNumber ? (
              "Update University Profile"
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