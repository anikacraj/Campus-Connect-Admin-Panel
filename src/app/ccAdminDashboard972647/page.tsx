'use client'
import React, { useState } from 'react';
import { Users, Shield, GraduationCap, Plus, Eye, Bell, Settings, User, ChevronDown, Home, Menu, X } from 'lucide-react';
import StudentManage from '@/components/StudentManage';
import ModeratorManage from '@/components/modManage';
import UniversityManage from '@/components/uniManage';
import UniRequest from '@/components/uniRequest';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { 
            id: 'students', 
            label: 'Manage Students', 
            icon: Users, 
            color: 'text-blue-600', 
            bgColor: 'bg-blue-50',
            activeColor: 'bg-blue-100 border-blue-200',
            hoverColor: 'hover:bg-blue-50'
        },
        { 
            id: 'moderators', 
            label: 'Manage Moderators', 
            icon: Shield, 
            color: 'text-green-600', 
            bgColor: 'bg-green-50',
            activeColor: 'bg-green-100 border-green-200',
            hoverColor: 'hover:bg-green-50'
        },
        { 
            id: 'universities', 
            label: 'Manage Universities', 
            icon: GraduationCap, 
            color: 'text-purple-600', 
            bgColor: 'bg-purple-50',
            activeColor: 'bg-purple-100 border-purple-200',
            hoverColor: 'hover:bg-purple-50'
        },
        { 
            id: 'uniRequests', 
            label: 'University Requests', 
            icon: Plus, 
            color: 'text-green-600', 
            bgColor: 'bg-blue-300',
            activeColor: 'bg-green-100 border-green-200',
            hoverColor: 'hover:bg-green-50'
        },

    ];

    // Dashboard home content
    const DashboardHome = () => (
        <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back! Manage your student portfolio platform efficiently.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <div
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className="group cursor-pointer bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-gray-200"
                        >
                            <div className={`${item.bgColor} ${item.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                <IconComponent size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                                {item.label}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {item.id === 'students' && 'Manage student accounts, portfolios, and activities'}
                                {item.id === 'moderators' && 'Control moderator permissions and access levels'}
                                {item.id === 'universities' && 'Oversee university partnerships and integrations'}
                            </p>
                            <div className="mt-6 flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                                <span>Manage now</span>
                                <div className="ml-2 transform group-hover:translate-x-1 transition-transform">→</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Total Students</p>
                            <p className="text-3xl font-bold">2,458</p>
                        </div>
                        <div className="bg-blue-400 bg-opacity-30 rounded-lg p-3">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium mb-1">Total Moderators</p>
                            <p className="text-3xl font-bold">24</p>
                        </div>
                        <div className="bg-green-400 bg-opacity-30 rounded-lg p-3">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium mb-1">Universities</p>
                            <p className="text-3xl font-bold">156</p>
                        </div>
                        <div className="bg-purple-400 bg-opacity-30 rounded-lg p-3">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium mb-1">Total University Request </p>
                            <p className="text-3xl font-bold">1,892</p>
                        </div>
                        <div className="bg-orange-400 bg-opacity-30 rounded-lg p-3">
                            <Eye className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Section rendering
    const renderContent = () => {
        switch (activeSection) {
            case 'students':
                return <StudentManage />;
            case 'moderators':
                return <ModeratorManage />;
            case 'universities':
                return <UniversityManage />;
                case 'uniRequests':
                return <UniRequest />;
            default:
                return <DashboardHome />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div className="flex-shrink-0 ml-2 lg:ml-0">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h1 className="text-xl font-bold text-gray-900">Campus Connect</h1>
                                <p className="text-xs text-gray-500 hidden sm:block">Admin Panel</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                <Settings className="w-5 h-5" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin User</span>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg lg:shadow-none border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
                    <div className="flex flex-col h-full pt-6 pb-4">
                        <nav className="flex-1 px-4 space-y-2">
                            <button
                                onClick={() => {
                                    setActiveSection('dashboard');
                                    setSidebarOpen(false);
                                }}
                                className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    activeSection === 'dashboard'
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <Home className="mr-3 w-5 h-5" />
                                Dashboard
                            </button>
                            
                            {menuItems.map((item) => {
                                const IconComponent = item.icon;
                                const isActive = activeSection === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveSection(item.id);
                                            setSidebarOpen(false);
                                        }}
                                        className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? `${item.activeColor} ${item.color} border shadow-sm`
                                                : `text-gray-600 ${item.hoverColor} hover:text-gray-900`
                                        }`}
                                    >
                                        <div className={`mr-3 w-5 h-5 ${isActive ? '' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div 
                        className="lg:hidden fixed inset-0 z-30 bg-gray-600 bg-opacity-50"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
