//src/app/allUniversity/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, Trash, Pencil, UserLock, UserCheck, X, Users, LayoutGrid, List, Eye } from "lucide-react";
import Link from "next/link";

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

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  type: "danger" | "warning";
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type,
}: ConfirmDialogProps) {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-full ${
              type === "danger" ? "bg-red-100" : "bg-yellow-100"
            }`}
          >
            {type === "danger" ? (
              <Trash className="text-red-600" size={24} />
            ) : (
              <UserLock className="text-yellow-600" size={24} />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 font-semibold rounded-xl transition ${
              type === "danger"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-yellow-600 hover:bg-yellow-700 text-white"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function UniversityList() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    university: University | null;
  }>({ isOpen: false, university: null });
  
  const [blockDialog, setBlockDialog] = useState<{
    isOpen: boolean;
    university: University | null;
  }>({ isOpen: false, university: null });

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

 const fetchUniversities = async () => {
  try {
    setLoading(true);
    const res = await fetch("/api/universities?page=1&limit=50"); // Add pagination
    const result = await res.json();
    if (res.ok) {
      setUniversities(result.data);
      setFilteredUniversities(result.data);
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
  const getWebsiteUrl = (url: string) => {
  if (!url) return '#';
  // Check if URL already has protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Add https:// if missing
  return `https://${url}`;
};

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = universities.filter((uni) =>
      uni.name.toLowerCase().includes(value)
    );
    setFilteredUniversities(filtered);
  };

  const handleDeleteClick = (university: University) => {
    setDeleteDialog({ isOpen: true, university });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.university) return;
    
    setActionLoading(deleteDialog.university._id);
    try {
      const res = await fetch(
        `/api/universities/${deleteDialog.university.regNumber}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setUniversities((prev) =>
          prev.filter((u) => u._id !== deleteDialog.university!._id)
        );
        setFilteredUniversities((prev) =>
          prev.filter((u) => u._id !== deleteDialog.university!._id)
        );
      } else {
        const result = await res.json();
        alert(result.error || "Failed to delete university");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete university");
    } finally {
      setActionLoading(null);
      setDeleteDialog({ isOpen: false, university: null });
    }
  };

  const handleBlockClick = (university: University) => {
    setBlockDialog({ isOpen: true, university });
  };

  const confirmBlock = async () => {
    if (!blockDialog.university) return;
    
    setActionLoading(blockDialog.university._id);
    
    try {
      const res = await fetch(
        `/api/universities/${blockDialog.university.regNumber}/block`,
        { method: "PATCH" }
      );

      if (res.ok) {
        const result = await res.json();
        setUniversities((prev) =>
          prev.map((u) =>
            u._id === blockDialog.university!._id
              ? { ...u, block: result.data.block }
              : u
          )
        );
        setFilteredUniversities((prev) =>
          prev.map((u) =>
            u._id === blockDialog.university!._id
              ? { ...u, block: result.data.block }
              : u
          )
        );
      } else {
        const result = await res.json();
        alert(result.error || "Failed to update university status");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update university status");
    } finally {
      setActionLoading(null);
      setBlockDialog({ isOpen: false, university: null });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-700 text-lg font-semibold">
          <RefreshCw className="animate-spin" size={20} />
          Loading universities...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 font-medium text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            🎓 All Universities
            <span className="text-blue-600 ml-2">({filteredUniversities.length})</span>
          </h1>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search university..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-white border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 transition ${
                  viewMode === "card"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title="Card View"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 transition ${
                  viewMode === "table"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title="Table View"
              >
                <List size={20} />
              </button>
            </div>

            <button
              onClick={fetchUniversities}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {filteredUniversities.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            No universities found.
          </div>
        ) : viewMode === "card" ? (
          // Card View (Vertical)
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredUniversities.map((university, index) => (
              <motion.div
                key={university._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border ${
                  university.block
                    ? "border-red-300 opacity-75"
                    : "border-gray-100"
                }`}
              >
                {university.block && (
                  <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 text-center">
                    🚫 BLOCKED
                  </div>
                )}

                <div className="relative h-40 w-full bg-gray-100">
                  {university.coverImage ? (
                    <Image
                      src={university.coverImage}
                      alt={`${university.name} cover`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No Cover Image
                    </div>
                  )}
                </div>

                <div className="relative flex justify-center -mt-16 px-4">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                    {university.logo ? (
                      <Image
                        src={university.logo}
                        alt={`${university.name} logo`}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-3xl font-bold text-gray-600">
                        {university.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 text-center">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {university.name}
                  </h2>

                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-center gap-5">
                      <p>
                        <span className="font-semibold">Estd:</span> {university.estd}
                      </p>
                      <p>
                        <span className="text-blue-700">{university.type}</span>
                      </p>
                    </div>
                    <p>
                      <span className="font-semibold">Location:</span> {university.location}
                    </p>
                 <p>
  <span className="font-semibold text-blue-500">Website:</span>{' '}
  <Link 
    className="text-blue-500 hover:underline" 
    href={getWebsiteUrl(university.website)}
    target="_blank"
    rel="noopener noreferrer"
  >
    {university.website}
  </Link>
</p>
                    <p>
                      <span className="font-semibold">Email:</span> {university.email}
                    </p>
                    <div className="flex justify-center items-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center">
                        <Users className="mr-2" size={16} />
                        <span>{university.totalStudent || 0}</span>
                      </span>
                    </div>
                  </div>

                  {university.bio && (
                    <p className="mt-3 text-gray-700 text-sm line-clamp-2">
                      {university.bio}
                    </p>
                  )}

                  <div className="flex justify-end gap-3 mt-4">
                    <Link
                      href={`/admin/allUniversity/edit/${university.regNumber}`}
                      className="p-2 hover:bg-blue-50 rounded-lg transition"
                      title="Edit University"
                    >
                      <Pencil className="text-blue-500" size={20} />
                    </Link>

                    <button
                      onClick={() => handleBlockClick(university)}
                      disabled={actionLoading === university._id}
                      className="p-2 hover:bg-yellow-50 rounded-lg transition disabled:opacity-50"
                      title={university.block ? "Unblock University" : "Block University"}
                    >
                      {university.block ? (
                        <UserCheck className="text-green-600" size={20} />
                      ) : (
                        <UserLock className="text-yellow-600" size={20} />
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteClick(university)}
                      disabled={actionLoading === university._id}
                      className="p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      title="Delete University"
                    >
                      <Trash className="text-red-500" size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Table View (Horizontal)
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">University</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Code</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Students</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUniversities.map((university) => (
                    <tr
                      key={university._id}
                      className={`hover:bg-gray-50 transition ${
                        university.block ? "bg-red-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            {university.logo ? (
                              <Image
                                src={university.logo}
                                alt={university.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-lg font-bold text-gray-600">
                                {university.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{university.name}</p>
                            <p className="text-xs text-gray-500">Est. {university.estd}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {university.regNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center w-fit">
                          <Users className="mr-2" size={14} />
                          {university.totalStudent || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{university.location}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-blue-700 font-medium">{university.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        {university.block ? (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                            Blocked
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/allUniversity/edit/${university.regNumber}`}
                            className="p-2 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Pencil className="text-blue-500" size={18} />
                          </Link>
                          <button
                            onClick={() => handleBlockClick(university)}
                            disabled={actionLoading === university._id}
                            className="p-2 hover:bg-yellow-50 rounded-lg transition disabled:opacity-50"
                            title={university.block ? "Unblock" : "Block"}
                          >
                            {university.block ? (
                              <UserCheck className="text-green-600" size={18} />
                            ) : (
                              <UserLock className="text-yellow-600" size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(university)}
                            disabled={actionLoading === university._id}
                            className="p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash className="text-red-500" size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {deleteDialog.isOpen && (
          <ConfirmDialog
            isOpen={deleteDialog.isOpen}
            title="Delete University"
            message={`Are you sure you want to delete "${deleteDialog.university?.name}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={confirmDelete}
            onCancel={() => setDeleteDialog({ isOpen: false, university: null })}
            type="danger"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {blockDialog.isOpen && (
          <ConfirmDialog
            isOpen={blockDialog.isOpen}
            title={
              blockDialog.university?.block
                ? "Unblock University"
                : "Block University"
            }
            message={
              blockDialog.university?.block
                ? `Unblock "${blockDialog.university?.name}"?`
                : `Block "${blockDialog.university?.name}"?`
            }
            confirmText={blockDialog.university?.block ? "Unblock" : "Block"}
            cancelText="Cancel"
            onConfirm={confirmBlock}
            onCancel={() => setBlockDialog({ isOpen: false, university: null })}
            type="warning"
          />
        )}
      </AnimatePresence>
    </div>
  );
}