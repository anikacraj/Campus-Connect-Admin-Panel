import React from 'react';
import { Users, Shield, GraduationCap, Eye } from 'lucide-react';
import StatCard from './StatCard';

interface DashboardHomeProps {
  stats: {
    students: number;
    moderators: number;
    universities: number;
    uniRequests: number;
  };
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ stats }) => {
  return (
    <div className="space-y-10">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Manage your student, moderator, and university data efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.students}
          icon={<Users className="w-8 h-8 text-white" />}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Moderators"
          value={stats.moderators}
          icon={<Shield className="w-8 h-8 text-white" />}
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Universities"
          value={stats.universities}
          icon={<GraduationCap className="w-8 h-8 text-white" />}
          gradient="from-purple-500 to-purple-600"
        />
        <StatCard
          title="University Requests"
          value={stats.uniRequests}
          icon={<Eye className="w-8 h-8 text-white" />}
          gradient="from-orange-500 to-orange-600"
        />
      </div>
    </div>
  );
};

export default DashboardHome;
