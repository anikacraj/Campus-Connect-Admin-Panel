"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { RefreshCw, Save, ArrowLeft, X } from "lucide-react";
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
  email: string;
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
    email: "",
    type: "",
    regNumber: "",
  });

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
        const uni = result.data;
        setFormData({
          name: uni.name || "",
          logo: uni.logo || "",
          coverImage: uni.coverImage || "",
          location: uni.location || "",
          bio: uni.bio || "",
          website: uni.website || "",
          estd: uni.estd || "",
          email: uni.email || "",
          type: uni.type || "",
          regNumber: uni.regNumber || "",
        });
      } else {
        setError(result.error || "Failed to fetch university");
      }
    } catch (err) {
      setError("Failed to fetch university");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          router.push("/admin/allUniversity");
        }, 1500);
      } else {
        setError(result.error || "Failed to update university");
      }
    } catch {
      setError("Failed to update university");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="flex items-center gap-3 text-gray-700 text-lg font-semibold">
          <RefreshCw className="animate-spin" size={20} />
          Loading university data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-gray-200 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm text-black shadow-lg rounded-2xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <Link
            href="/admin/allUniversity"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-indigo-700 font-medium transition"
          >
            <ArrowLeft size={20} />
            Back to Universities
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Edit University
          </h1>
          <p className="text-gray-600">Update university details below</p>
        </div>

        <div className="p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-800 flex items-center gap-3 animate-fadeIn">
              ✅ University updated successfully! Redirecting...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-800 flex items-start gap-3 animate-fadeIn">
              <X size={20} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                  placeholder="Enter university name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all"
                  placeholder="university@example.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="regNumber"
                  value={formData.regNumber}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Select Type</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Established Year
                </label>
                <input
                  type="text"
                  name="estd"
                  value={formData.estd}
                  onChange={handleChange}
                  placeholder="e.g., 1921"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://university.edu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio / Description
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write a short description about the university..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none transition-all"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-gray-200">
              <Link
                href="/admin/allUniversity"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all text-center"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg disabled:opacity-70 transition-all"
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
