"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, Trash, Pencil, UserLock, UserCheck, X, Eye, Shield } from "lucide-react";
import Link from "next/link";

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

export default function StudentList() {
  const [students, setStudents] = useState<Students[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Students[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    student: Students | null;
  }>({ isOpen: false, student: null });
  
  const [banDialog, setBanDialog] = useState<{
    isOpen: boolean;
    student: Students | null;
  }>({ isOpen: false, student: null });

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const normalizeStudentData = (data: any[]): Students[] => {
    return data.map(student => ({
      ...student,
      isBanned: student.isBanned ?? student.banned ?? false
    }));
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/users");
      
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }
      
      const result = await res.json();
      
      if (result.data) {
        const normalizedData = normalizeStudentData(result.data);
        setStudents(normalizedData);
        setFilteredStudents(normalizedData);
        console.log("Fetched students:", normalizedData);
      } else {
        setError(result.error || "Failed to fetch students");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(value) ||
        student.email.toLowerCase().includes(value) ||
        student.university.toLowerCase().includes(value)
    );
    setFilteredStudents(filtered);
  };



  const handleBanClick = (student: Students) => {
    setBanDialog({ isOpen: true, student });
  };

  const confirmBan = async () => {
    if (!banDialog.student) return;

    setActionLoading(banDialog.student._id);

    try {
      const res = await fetch(`/api/users/${banDialog.student._id}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", await res.text());
        throw new Error(`API route error: Expected JSON but got ${contentType}. Check if /api/users/[_id]/block/route.ts exists.`);
      }

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || `Failed to update ban status: ${res.status}`);
      }
      
      if (result.data) {
        const updatedBanStatus = result.data.isBanned ?? result.data.banned ?? false;
        
        setStudents((prev) =>
          prev.map((s) =>
            s._id === banDialog.student!._id
              ? { ...s, isBanned: updatedBanStatus }
              : s
          )
        );
        setFilteredStudents((prev) =>
          prev.map((s) =>
            s._id === banDialog.student!._id
              ? { ...s, isBanned: updatedBanStatus }
              : s
          )
        );
        
        // Clear any previous errors
        setError(null);
      }
    } catch (err: any) {
      console.error("Ban error:", err);
      setError(err.message || "Failed to update student status");
      alert(err.message); // Show immediate feedback
    } finally {
      setActionLoading(null);
      setBanDialog({ isOpen: false, student: null });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-700 text-lg font-semibold">
          <RefreshCw className="animate-spin" size={20} />
          Loading students...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
          <button
            onClick={fetchStudents}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            👨‍🎓 Manage Students
            <span className="text-blue-600 ml-2">({filteredStudents.length})</span>
          </h1>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <button
              onClick={fetchStudents}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            No students found.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      University
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student, index) => (
                    <motion.tr
                      key={student._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`hover:bg-gray-50 transition ${
                        student.isBanned ? "bg-red-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            {student.profileUrl ? (
                              <Image
                                src={student.profileUrl}
                                alt={student.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-lg font-bold text-gray-600">
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-500">ID: {student._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{student.email}</p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{student.university}</p>
                      </td>

                      <td className="px-6 py-4">
                        {student.isMod ? (
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold flex items-center w-fit gap-1">
                            <Shield size={12} />
                            Moderator
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            Student
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {student.isBanned ? (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                            Banned
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
                            href={`/students/${student._id}`}
                            className="p-2 hover:bg-blue-50 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="text-blue-500" size={18} />
                          </Link>
                          <Link
                            href={`/students/edit/${student._id}`}
                            className="p-2 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Pencil className="text-blue-500" size={18} />
                          </Link>
                          <button
                            onClick={() => handleBanClick(student)}
                            disabled={actionLoading === student._id}
                            className="p-2 hover:bg-yellow-50 rounded-lg transition disabled:opacity-50"
                            title={student.isBanned ? "Unban" : "Ban"}
                          >
                            {student.isBanned ? (
                              <UserCheck className="text-green-600" size={18} />
                            ) : (
                              <UserLock className="text-yellow-600" size={18} />
                            )}
                          </button>
                       
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
       
      </AnimatePresence>

      <AnimatePresence>
        {banDialog.isOpen && (
          <ConfirmDialog
            isOpen={banDialog.isOpen}
            title={
              banDialog.student?.isBanned ? "Unban Student" : "Ban Student"
            }
            message={
              banDialog.student?.isBanned
                ? `Unban "${banDialog.student?.name}"? They will regain access.`
                : `Ban "${banDialog.student?.name}"? They will lose access.`
            }
            confirmText={banDialog.student?.isBanned ? "Unban" : "Ban"}
            cancelText="Cancel"
            onConfirm={confirmBan}
            onCancel={() => setBanDialog({ isOpen: false, student: null })}
            type="warning"
          />
        )}
      </AnimatePresence>
    </div>
  );
}