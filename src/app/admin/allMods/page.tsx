"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RefreshCw,
  ShieldCheck,
  ShieldX,
  X,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Ban,
  Unlock,
  UserX,
} from "lucide-react";

interface ModRequest {
  _id: string;
  name: string;
  email: string;
  profileUrl: string;
  university: string;
  hasRequestedForMod: boolean;
  motivationForMod: string;
  isMod: boolean;
  isBanned?: boolean;
  requestedAt?: string;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  type: "success" | "danger" | "warning";
}

interface MotivationModalProps {
  isOpen: boolean;
  student: ModRequest | null;
  onClose: () => void;
}

// Custom Hooks
function useModRequests() {
  const [requests, setRequests] = useState<ModRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeRequestData = useCallback((data: any[]): ModRequest[] => {
    return data.map((student) => ({
      ...student,
      hasRequestedForMod: student.hasRequestedForMod ?? false,
      isMod: student.isMod ?? false,
      isBanned: student.isBanned ?? false,
      motivationForMod: student.motivationForMod || "",
    }));
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/users");

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }

      const result = await res.json();

      if (result.data) {
        const normalizedData = normalizeRequestData(result.data);
        const modRelatedUsers = normalizedData.filter(
          (user) => user.hasRequestedForMod || user.isMod
        );
        setRequests(modRelatedUsers);
      } else {
        setError(result.error || "Failed to fetch mod requests");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch mod requests");
    } finally {
      setLoading(false);
    }
  }, [normalizeRequestData]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, refetch: fetchRequests, setRequests };
}

function useFilteredRequests(requests: ModRequest[], search: string, filter: string) {
  return useMemo(() => {
    let filtered = [...requests];

    // Apply status filter
    if (filter === "pending") {
      filtered = filtered.filter((r) => r.hasRequestedForMod && !r.isMod);
    } else if (filter === "approved") {
      filtered = filtered.filter((r) => r.isMod);
    } else if (filter === "banned") {
      filtered = filtered.filter((r) => r.isBanned);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.email.toLowerCase().includes(searchLower) ||
          r.university.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [requests, search, filter]);
}

// Components
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

  const iconConfig = {
    success: { icon: ShieldCheck, color: "green" },
    danger: { icon: ShieldX, color: "red" },
    warning: { icon: Ban, color: "yellow" },
  };

  const { icon: Icon, color } = iconConfig[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <Icon className={`text-${color}-600`} size={24} />
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
            className={`flex-1 px-4 py-2 font-semibold rounded-xl transition bg-${color}-600 hover:bg-${color}-700 text-white`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function MotivationModal({ isOpen, student, onClose }: MotivationModalProps) {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
              {student.profileUrl ? (
                <Image
                  src={student.profileUrl}
                  alt={student.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-2xl font-bold text-gray-600">
                  {student.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {student.name}
              </h3>
              <p className="text-sm text-gray-500">{student.email}</p>
              <p className="text-xs text-gray-400">{student.university}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="text-blue-600" size={20} />
            <h4 className="text-lg font-semibold text-gray-900">
              Motivation for Moderator Role
            </h4>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {student.motivationForMod || "No motivation provided."}
            </p>
          </div>
        </div>

        {student.requestedAt && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>
              Requested on: {new Date(student.requestedAt).toLocaleString()}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatusBadge({ request }: { request: ModRequest }) {
  if (request.isBanned) {
    return (
      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center w-fit gap-1">
        <Ban size={12} />
        Banned
      </span>
    );
  }

  if (request.isMod) {
    return (
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center w-fit gap-1">
        <CheckCircle size={12} />
        Approved
      </span>
    );
  }

  if (request.hasRequestedForMod) {
    return (
      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold flex items-center w-fit gap-1">
        <Clock size={12} />
        Pending
      </span>
    );
  }

  return (
    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
      No Request
    </span>
  );
}

function ActionButtons({ 
  request, 
  onViewMotivation, 
  onApprove, 
  onReject, 
  onRevoke, 
  onBan, 
  onUnban,
  actionLoading 
}: {
  request: ModRequest;
  onViewMotivation: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRevoke: () => void;
  onBan: () => void;
  onUnban: () => void;
  actionLoading: string | null;
}) {
  const isLoading = actionLoading === request._id;

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={onViewMotivation}
        className="p-2 hover:bg-blue-50 rounded-lg transition"
        title="View Motivation"
      >
        <Eye className="text-blue-500" size={18} />
      </button>

      {request.hasRequestedForMod && !request.isMod && !request.isBanned && (
        <>
          <button
            onClick={onApprove}
            disabled={isLoading}
            className="p-2 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
            title="Approve Request"
          >
            <CheckCircle className="text-green-600" size={18} />
          </button>
          <button
            onClick={onReject}
            disabled={isLoading}
            className="p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
            title="Reject Request"
          >
            <XCircle className="text-red-600" size={18} />
          </button>
        </>
      )}

      {request.isMod && !request.isBanned && (
        <button
          onClick={onRevoke}
          disabled={isLoading}
          className="p-2 hover:bg-orange-50 rounded-lg transition disabled:opacity-50"
          title="Revoke Mod"
        >
          <UserX className="text-orange-600" size={18} />
        </button>
      )}

      {!request.isBanned ? (
        <button
          onClick={onBan}
          disabled={isLoading}
          className="p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
          title="Ban User"
        >
          <Ban className="text-red-600" size={18} />
        </button>
      ) : (
        <button
          onClick={onUnban}
          disabled={isLoading}
          className="p-2 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
          title="Unban User"
        >
          <Unlock className="text-green-600" size={18} />
        </button>
      )}
    </div>
  );
}

export default function ModRequestList() {
  const { requests, loading, error, refetch, setRequests } = useModRequests();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "banned">("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [dialogs, setDialogs] = useState({
    approve: { isOpen: false, student: null as ModRequest | null },
    reject: { isOpen: false, student: null as ModRequest | null },
    revoke: { isOpen: false, student: null as ModRequest | null },
    ban: { isOpen: false, student: null as ModRequest | null },
    unban: { isOpen: false, student: null as ModRequest | null },
  });

  const [motivationModal, setMotivationModal] = useState<{
    isOpen: boolean;
    student: ModRequest | null;
  }>({ isOpen: false, student: null });

  const filteredRequests = useFilteredRequests(requests, search, filter);

  // Stats
  const stats = useMemo(() => ({
    pending: requests.filter((r) => r.hasRequestedForMod && !r.isMod && !r.isBanned).length,
    approved: requests.filter((r) => r.isMod && !r.isBanned).length,
    banned: requests.filter((r) => r.isBanned).length,
    total: requests.length,
  }), [requests]);

  // Action handlers
  const handleAction = async (url: string, method: string, successUpdate: (student: ModRequest) => Partial<ModRequest>) => {
    const student = Object.values(dialogs).find(d => d.isOpen)?.student;
    if (!student) return;

    setActionLoading(student._id);

    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" } });
      
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || `Action failed: ${res.status}`);
      }

      setRequests(prev => prev.map(r => 
        r._id === student._id ? { ...r, ...successUpdate(student) } : r
      ));
    } catch (err: any) {
      console.error("Action error:", err);
      alert(err.message);
    } finally {
      setActionLoading(null);
      setDialogs({ approve: { isOpen: false, student: null }, reject: { isOpen: false, student: null }, revoke: { isOpen: false, student: null }, ban: { isOpen: false, student: null }, unban: { isOpen: false, student: null } });
    }
  };

  const handleApprove = () => handleAction(
    `/api/users/${dialogs.approve.student?._id}/mod`,
    "PATCH",
    () => ({ isMod: true, hasRequestedForMod: false })
  );

  const handleReject = () => handleAction(
    `/api/users/${dialogs.reject.student?._id}/reject-mod`,
    "PATCH",
    () => ({ hasRequestedForMod: false })
  );

  const handleRevoke = () => handleAction(
    `/api/users/${dialogs.revoke.student?._id}/revoke-mod`,
    "PATCH",
    () => ({ isMod: false })
  );

  const handleBan = () => handleAction(
    `/api/users/${dialogs.ban.student?._id}/ban`,
    "PATCH",
    () => ({ isBanned: true })
  );

  const handleUnban = () => handleAction(
    `/api/users/${dialogs.unban.student?._id}/unban`,
    "PATCH",
    () => ({ isBanned: false })
  );

  // Dialog handlers
  const openDialog = (type: keyof typeof dialogs, student: ModRequest) => {
    setDialogs(prev => ({ ...prev, [type]: { isOpen: true, student } }));
  };

  const closeDialogs = () => {
    setDialogs({ approve: { isOpen: false, student: null }, reject: { isOpen: false, student: null }, revoke: { isOpen: false, student: null }, ban: { isOpen: false, student: null }, unban: { isOpen: false, student: null } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-700 text-lg font-semibold">
          <RefreshCw className="animate-spin" size={20} />
          Loading mod requests...
        </div>
      </div>
    );
  }

  if (error && requests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              🛡️ Moderator Management
            </h1>
            <p className="text-gray-600 mt-1">
              Review and manage moderator applications and permissions
            </p>
          </div>

          <button
            onClick={refetch}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending Requests", value: stats.pending, color: "yellow", icon: Clock },
            { label: "Approved Moderators", value: stats.approved, color: "green", icon: CheckCircle },
            { label: "Banned Users", value: stats.banned, color: "red", icon: Ban },
            { label: "Total", value: stats.total, color: "blue", icon: ShieldCheck },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className={`bg-white rounded-xl shadow-md p-6 border-l-4 border-${color}-500`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <Icon className={`text-${color}-500`} size={32} />
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "All", count: stats.total },
              { key: "pending", label: "Pending", count: stats.pending },
              { key: "approved", label: "Approved", count: stats.approved },
              { key: "banned", label: "Banned", count: stats.banned },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === key
                    ? `bg-${key === 'banned' ? 'red' : key === 'approved' ? 'green' : key === 'pending' ? 'yellow' : 'blue'}-600 text-white`
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, email, or university..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
          </div>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <ShieldX className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-500 text-lg">No requests found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Applicant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">University</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequests.map((request, index) => (
                    <motion.tr
                      key={request._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            {request.profileUrl ? (
                              <Image
                                src={request.profileUrl}
                                alt={request.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-lg font-bold text-gray-600">
                                {request.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{request.name}</p>
                            <p className="text-xs text-gray-500">ID: {request._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{request.email}</p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{request.university}</p>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge request={request} />
                      </td>

                      <td className="px-6 py-4">
                        <ActionButtons
                          request={request}
                          onViewMotivation={() => setMotivationModal({ isOpen: true, student: request })}
                          onApprove={() => openDialog("approve", request)}
                          onReject={() => openDialog("reject", request)}
                          onRevoke={() => openDialog("revoke", request)}
                          onBan={() => openDialog("ban", request)}
                          onUnban={() => openDialog("unban", request)}
                          actionLoading={actionLoading}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AnimatePresence>
        {dialogs.approve.isOpen && (
          <ConfirmDialog
            isOpen={dialogs.approve.isOpen}
            title="Approve Moderator"
            message={`Are you sure you want to approve "${dialogs.approve.student?.name}" as a moderator? They will gain moderator privileges.`}
            confirmText="Approve"
            cancelText="Cancel"
            onConfirm={handleApprove}
            onCancel={closeDialogs}
            type="success"
          />
        )}

        {dialogs.reject.isOpen && (
          <ConfirmDialog
            isOpen={dialogs.reject.isOpen}
            title="Reject Request"
            message={`Are you sure you want to reject "${dialogs.reject.student?.name}"'s moderator request? This action cannot be undone.`}
            confirmText="Reject"
            cancelText="Cancel"
            onConfirm={handleReject}
            onCancel={closeDialogs}
            type="danger"
          />
        )}

        {dialogs.revoke.isOpen && (
          <ConfirmDialog
            isOpen={dialogs.revoke.isOpen}
            title="Revoke Moderator"
            message={`Are you sure you want to revoke "${dialogs.revoke.student?.name}"'s moderator privileges? They will lose all moderator access.`}
            confirmText="Revoke"
            cancelText="Cancel"
            onConfirm={handleRevoke}
            onCancel={closeDialogs}
            type="warning"
          />
        )}

        {dialogs.ban.isOpen && (
          <ConfirmDialog
            isOpen={dialogs.ban.isOpen}
            title="Ban User"
            message={`Are you sure you want to ban "${dialogs.ban.student?.name}"? They will lose access to all platform features.`}
            confirmText="Ban"
            cancelText="Cancel"
            onConfirm={handleBan}
            onCancel={closeDialogs}
            type="danger"
          />
        )}

        {dialogs.unban.isOpen && (
          <ConfirmDialog
            isOpen={dialogs.unban.isOpen}
            title="Unban User"
            message={`Are you sure you want to unban "${dialogs.unban.student?.name}"? They will regain access to platform features.`}
            confirmText="Unban"
            cancelText="Cancel"
            onConfirm={handleUnban}
            onCancel={closeDialogs}
            type="success"
          />
        )}
      </AnimatePresence>

      {/* Motivation Modal */}
      <AnimatePresence>
        {motivationModal.isOpen && (
          <MotivationModal
            isOpen={motivationModal.isOpen}
            student={motivationModal.student}
            onClose={() => setMotivationModal({ isOpen: false, student: null })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}