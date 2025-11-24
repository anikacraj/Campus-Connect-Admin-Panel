"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye } from "lucide-react";

interface University {
  _id: string;
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
  block: boolean;
  createdAt: string;
  updatedAt: string;
  totalStudent: string;
}

interface Students {
  _id: string;
  name: string;
  email: string;
  profileUrl: string;
  isBanned: boolean;
  banned?: boolean;
  isMod: boolean;
  university: string;
}

export default function Page() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/universities/uniRequest");
      const result = await res.json();

      if (res.ok) {
        setUniversities(result.data);
        setFilteredUniversities(result.data);
        setError(null);
      } else {
        setError(result.error || "Failed to fetch universities");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch universities");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            🎓 All Universities
            <span className="text-blue-600 ml-2">
              ({filteredUniversities.length})
            </span>
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode("card")}
              className={`px-3 py-2 rounded-lg font-semibold ${
                viewMode === "card"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-lg font-semibold ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20 text-lg">
            Loading universities...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-20 text-lg">{error}</div>
        ) : filteredUniversities.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            No universities found.
          </div>
        ) : viewMode === "card" ? (
          // 🧩 Card View
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredUniversities.map((university) => (
              <motion.div
                key={university._id}
                layout
                className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition duration-300"
              >
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {university.name}
                  </h2>

                  <div className="text-sm text-gray-600 space-y-1">
                 
                <p>
                      <span className="font-semibold">EIIN :</span>{" "}
             {university.regNumber}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-500">Website:</span>{" "}
                      <Link
                        className="text-blue-500 underline"
                        href={university.website}
                        target="_blank"
                      >
                        {university.website}
                      </Link>
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {university.email}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-center">
                               <Link
  href={{
    pathname: "/createUniPage",
    query: {
      name: university.name,
      regNumber: university.regNumber,
      website: university.website,
      email: university.email,
    },
  }}
  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
>
  Create University
</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // 📋 List View
          <div className="bg-white shadow rounded-xl overflow-hidden">
            <table className="min-w-full text-left border border-gray-200">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Website</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUniversities.map((university) => (
                  <tr
                    key={university._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {university.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {university.type}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {university.location}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={university.website}
                        className="text-blue-500 underline"
                        target="_blank"
                      >
                        Visit
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {university.email}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/university/${university._id}`}
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <Eye size={16} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
