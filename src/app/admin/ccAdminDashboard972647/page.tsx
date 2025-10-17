'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Users,
  Shield,
  GraduationCap,
  Plus,
  Eye,
  Home,
  Menu,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/Sidebar';
import { div } from 'framer-motion/client';
import Header from '@/components/Header';

interface Students {}
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

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [students, setStudents] = useState<Students[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Students[]>([]);
  const [universitiesRequest, setUniversitiesRequest] = useState<[]>([]);
  const [filteredUniversitiesRequest, setFilteredUniversitiesRequest] = useState<[]>([]);
  const [universities, setUniversities] = useState<[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<[]>([]);
  const [requests, setRequests] = useState<ModRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Normalize Data
  const normalizeStudentData = (data: any[]): Students[] =>
    data.map((student) => ({
      ...student,
      isBanned: student.isBanned ?? student.banned ?? false
    }));

  const normalizeRequestData = useCallback((data: any[]): ModRequest[] => {
    return data.map((student) => ({
      ...student,
      hasRequestedForMod: student.hasRequestedForMod ?? false,
      isMod: student.isMod ?? false,
      isBanned: student.isBanned ?? false,
      motivationForMod: student.motivationForMod || ''
    }));
  }, []);

  // Fetch Data
  useEffect(() => {
    fetchStudents();
    fetchUniversitiesRequest();
    fetchUniversities();
    fetchRequests();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const result = await res.json();
      if (result.data) {
        const normalizedData = normalizeStudentData(result.data);
        setStudents(normalizedData);
        setFilteredStudents(normalizedData);
      } else {
        setError(result.error || 'Failed to fetch students');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversitiesRequest = async () => {
    try {
      const res = await fetch('/api/universities/uniRequest');
      const result = await res.json();
      if (res.ok) {
        setUniversitiesRequest(result.data);
        setFilteredUniversitiesRequest(result.data);
      }
    } catch (err) {
      setError('Failed to fetch universities');
    }
  };

  const fetchUniversities = async () => {
    try {
      const res = await fetch('/api/universities');
      const result = await res.json();
      if (res.ok) {
        setUniversities(result.data);
        setFilteredUniversities(result.data);
      }
    } catch (err) {
      setError('Failed to fetch universities');
    }
  };

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      const result = await res.json();
      if (result.data) {
        const normalizedData = normalizeRequestData(result.data);
        const modRelatedUsers = normalizedData.filter((user) => user.isMod === true);
        setRequests(modRelatedUsers);
      }
    } catch (err: any) {
      setError(err.message);
    }
  }, [normalizeRequestData]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-lg font-semibold text-gray-700 animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'students', label: 'Manage Students', icon: Users, color: 'text-blue-600', hover: 'hover:bg-blue-50' },
    { id: 'moderators', label: 'Manage Moderators', icon: Shield, color: 'text-green-600', hover: 'hover:bg-green-50' },
    { id: 'universities', label: 'Manage Universities', icon: GraduationCap, color: 'text-purple-600', hover: 'hover:bg-purple-50' },
    { id: 'uniRequests', label: 'University Requests', icon: Plus, color: 'text-orange-600', hover: 'hover:bg-orange-50' }
  ];

  const DashboardHome = () => (
   <div>
    <div>
    
    </div>
     <div className="space-y-10">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Manage your platform efficiently.</p>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: filteredStudents.length, icon: Users, gradient: 'from-blue-500 to-blue-600' },
          { label: 'Total Moderators', value: requests.length, icon: Shield, gradient: 'from-green-500 to-green-600' },
          { label: 'Universities', value: filteredUniversities.length, icon: GraduationCap, gradient: 'from-purple-500 to-purple-600' },
          { label: 'University Requests', value: filteredUniversitiesRequest.length, icon: Eye, gradient: 'from-orange-500 to-orange-600' }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.gradient} text-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">{stat.label}</p>
                  <p className="text-4xl font-extrabold">{stat.value}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`cursor-pointer bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 ${item.hover}`}
            >
              <div className={`w-14 h-14 flex items-center justify-center mb-4 rounded-xl bg-gray-50 ${item.color}`}>
                <Icon size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.label}</h3>
              <p className="text-gray-500 text-sm">
                {item.id === 'students' && 'Manage student accounts and activities'}
                {item.id === 'moderators' && 'Approve or remove moderator roles'}
                {item.id === 'universities' && 'Monitor partnered universities'}
                {item.id === 'uniRequests' && 'Review and approve new university requests'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
   </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'students':
        router.push('/admin/allStudents');
        break;
      case 'moderators':
        router.push('/admin/allMods');
        break;
      case 'universities':
        router.push('/admin/allUniversity');
        break;
      case 'uniRequests':
        router.push('/admin/allUniRequest');
        break;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="max-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
