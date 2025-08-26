'use client'
import React, { useState } from 'react';
import { Users, Shield, GraduationCap, Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye }
    from 'lucide-react';
import StudentManage from '@/components/StudentManage';
import UniversityManage from '@/components/uniManage';
import ModeratorManage from '@/components/modManage';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');

    const menuItems = [
        { id: 'students', label: 'Manage Students', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { id: 'moderators', label: 'Manage Moderators', icon: Shield, color: 'text-green-600', bgColor: 'bg-green-50' },
        { id: 'universities', label: 'Manage Universities', icon: GraduationCap, color: 'text-purple-600', bgColor: 'bg-purple-50' }
    ];

    // Sample data


    const moderatorsData = [
        { id: 1, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Senior Mod', permissions: 'Full Access', status: 'Active' },
        { id: 2, name: 'David Brown', email: 'david@example.com', role: 'Junior Mod', permissions: 'Limited', status: 'Active' },
        { id: 3, name: 'Lisa Garcia', email: 'lisa@example.com', role: 'Content Mod', permissions: 'Content Only', status: 'Inactive' },
    ];

    const universitiesData = [
        { id: 1, name: 'Massachusetts Institute of Technology', code: 'MIT', students: 1250, status: 'Active', location: 'Cambridge, MA' },
        { id: 2, name: 'Stanford University', code: 'STAN', students: 980, status: 'Active', location: 'Stanford, CA' },
        { id: 3, name: 'Harvard University', code: 'HARV', students: 1100, status: 'Active', location: 'Cambridge, MA' },
    ];

    const DashboardHome = () => (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back! Manage your student portfolio platform efficiently.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <div
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className="group cursor-pointer bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                        >
                            <div className={`${item.bgColor} ${item.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <IconComponent size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                                {item.label}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {item.id === 'students' && 'Manage student accounts, portfolios, and activities'}
                                {item.id === 'moderators' && 'Control moderator permissions and access levels'}
                                {item.id === 'universities' && 'Oversee university partnerships and integrations'}
                            </p>
                            <div className="mt-4 flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                                <span>Manage now</span>
                                <div className="ml-2 transform group-hover:translate-x-1 transition-transform">→</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Students</p>
                            <p className="text-3xl font-bold">2,458</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Active Moderators</p>
                            <p className="text-3xl font-bold">24</p>
                        </div>
                        <Shield className="w-8 h-8 text-green-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Universities</p>
                            <p className="text-3xl font-bold">156</p>
                        </div>
                        <GraduationCap className="w-8 h-8 text-purple-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Total Portfolios</p>
                            <p className="text-3xl font-bold">1,892</p>
                        </div>
                        <Eye className="w-8 h-8 text-orange-200" />
                    </div>
                </div>
            </div>
        </div>
    );

    const TableHeader = ({ title, addButtonText }) => (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>{addButtonText}</span>
                </button>
            </div>
        </div>
    );

    const ActionButton = ({ icon: Icon, onClick, className = "" }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
    <><StudentManage /><ModeratorManage /><UniversityManage /></>

    const renderContent = () => {
        switch (activeSection) {
            case 'students':
                return <StudentManage />;
            case 'moderators':
                return <ModeratorManage />;
            case 'universities':
                return <UniversityManage />;
            default:
                return <DashboardHome />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="ml-3">
                                <h1 className="text-xl font-bold text-gray-900">StudentPortfolio</h1>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <button
                                onClick={() => setActiveSection('dashboard')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'dashboard'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                Dashboard
                            </button>
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === item.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;