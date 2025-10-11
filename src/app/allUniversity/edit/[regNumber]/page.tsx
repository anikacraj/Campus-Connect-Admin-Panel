// src/app/allUniversity/edit/[regNumber]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { RefreshCw, Save, ArrowLeft, Upload, X, Camera, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface UniversityFormData {
  name: string;
  logo: string;
  coverImage: string;
  location: string;
  bio: string;
  website: string;
  estd: string;
  varsityEmail: string;
  type: string;
  regNumber: string;
}

export default function EditUniversity() {
  const router = useRouter();
  const params = useParams();
  const regNumber = params.regNumber as string;

  const [formData, setFormData] = useState<UniversityFormData>({
    name: "",
    logo: "",
    coverImage: "",
    location: "",
    bio: "",
    website: "",
    estd: "",
    varsityEmail: "",
    type: "",
    regNumber: "",
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [coverPreview, setCoverPreview] = useState<string>("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchUniversity();
  }, [regNumber]);

  const fetchUniversity = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/universities/${regNumber}`);
      const result = await res.json();

      if (res.ok) {
        setFormData(result.data);
        setLogoPreview(result.data.logo);
        setCoverPreview(result.data.coverImage);
      } else {
        setError(result.error || "Failed to fetch university");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch university");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Convert image to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Logo must be less than 2MB");
        return;
      }
      try {
        const base64 = await convertToBase64(file);
        setLogoPreview(base64);
        setFormData((prev) => ({ ...prev, logo: base64 }));
      } catch (error) {
        console.error("Error converting logo:", error);
      }
    }
  };

  // Handle cover upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Cover image must be less than 5MB");
        return;
      }
      try {
        const base64 = await convertToBase64(file);
        setCoverPreview(base64);
        setFormData((prev) => ({ ...prev, coverImage: base64 }));
      } catch (error) {
        console.error("Error converting cover:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/universities/${regNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/allUniversity");
        }, 1500);
      } else {
        setError(result.error || "Failed to update university");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update university");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-700 text-lg font-semibold">
          <RefreshCw className="animate-spin" size={20} />
          Loading university data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/allUniversity"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition"
          >
            <ArrowLeft size={20} />
            Back to Universities
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit University</h1>
          <p className="text-gray-600 mt-1">Update university information</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-800 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            University updated successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-800 flex items-start gap-3">
            <X size={20} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Camera size={20} className="text-blue-600" />
                University Images
              </h2>
              <p className="text-sm text-gray-600 mt-1">Upload logo and cover image</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  University Logo
                </label>
                <div className="space-y-3">
                  <div className="relative group">
                    <div className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors overflow-hidden bg-gray-50 flex items-center justify-center">
                      {logoPreview ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={logoPreview}
                            alt="Logo preview"
                            fill
                            className="object-contain p-4"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setLogoPreview("");
                              setFormData((prev) => ({ ...prev, logo: "" }));
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition opacity-0 group-hover:opacity-100"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                          <p className="text-sm text-gray-600">Click to upload logo</p>
                          <p className="text-xs text-gray-400 mt-1">Max 2MB</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Upload size={16} />
                    {logoPreview ? "Change Logo" : "Upload Logo"}
                  </button>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Cover Image
                </label>
                <div className="space-y-3">
                  <div className="relative group">
                    <div className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors overflow-hidden bg-gray-50 flex items-center justify-center">
                      {coverPreview ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={coverPreview}
                            alt="Cover preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCoverPreview("");
                              setFormData((prev) => ({ ...prev, coverImage: "" }));
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition opacity-0 group-hover:opacity-100"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <ImageIcon className="mx-auto text-gray-400 mb-2" size={32} />
                          <p className="text-sm text-gray-600">Click to upload cover</p>
                          <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Upload size={16} />
                    {coverPreview ? "Change Cover" : "Upload Cover"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              <p className="text-sm text-gray-600 mt-1">Essential university details</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  University Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter university name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  University Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="varsityEmail"
                  value={formData.varsityEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="university@example.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="regNumber"
                  value={formData.regNumber}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select Type</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Established Year
                </label>
                <input
                  type="text"
                  name="estd"
                  value={formData.estd}
                  onChange={handleChange}
                  placeholder="e.g., 1921"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://university.edu"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio / Description
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write a brief description about the university..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 sticky bottom-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              {submitting ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Update University
                </>
              )}
            </button>

            <Link
              href="/allUniversity"
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}