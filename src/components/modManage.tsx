'use client'
import React from 'react';
import { Shield, Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, UserCheck } from 'lucide-react';

const moderatorsData = [
    { id: 1, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Senior Moderator', permissions: 'Full Access', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'David Brown', email: 'david@example.com', role: 'Junior Moderator', permissions: 'Limited Access', status: 'Active', joinDate: '2024-02-20' },
    { id: 3, name: 'Lisa Garcia', email: 'lisa@example.com', role: 'Content Moderator', permissions: 'Content Only', status: 'Inactive', joinDate: '2024-01-10' },
    { id: 4, name: 'Michael Chen', email: 'michael@example.com', role: 'Technical Moderator', permissions: 'Technical Access', status: 'Active', joinDate: '2024-03-05' },
    { id: 5, name: 'Emma Johnson', email: 'emma@example.com', role: 'Community Moderator', permissions: 'Community Access', status: 'Active', joinDate: '2024-02-28' },
];

const TableHeader = ({ title, addButtonText }: { title: string, addButtonText: string }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search moderators..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>{addButtonText}</span>
            </button>
        </div>
    </div>
);

const ActionButton = ({ icon: Icon, onClick, className = "" }: {
    icon: React.ElementType,
    onClick?: () => void,
    className?: string
}) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
    >
        <Icon className="w-4 h-4" />
    </button>
);

const getRoleColor = (role: string) => {
    switch (role) {
        case 'Senior Moderator':
            return 'bg-purple-100 text-purple-800';
        case 'Junior Moderator':
            return 'bg-blue-100 text-blue-800';
        case 'Content Moderator':
            return 'bg-orange-100 text-orange-800';
        case 'Technical Moderator':
            return 'bg-indigo-100 text-indigo-800';
        case 'Community Moderator':
            return 'bg-pink-100 text-pink-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getPermissionColor = (permission: string) => {
    switch (permission) {
        case 'Full Access':
            return 'bg-red-100 text-red-800';
        case 'Limited Access':
            return 'bg-yellow-100 text-yellow-800';
        case 'Content Only':
            return 'bg-blue-100 text-blue-800';
        case 'Technical Access':
            return 'bg-green-100 text-green-800';
        case 'Community Access':
            return 'bg-purple-100 text-purple-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function ModeratorManage() {
    const handleView = (moderatorId: number) => {
        console.log('View moderator:', moderatorId);
    };

    const handleEdit = (moderatorId: number) => {
        console.log('Edit moderator:', moderatorId);
    };

    const handleDelete = (moderatorId: number) => {
        console.log('Delete moderator:', moderatorId);
    };

    const handleMore = (moderatorId: number) => {
        console.log('More actions for moderator:', moderatorId);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="space-y-6">
                    <TableHeader title="Manage Moderators" addButtonText="Add Moderator" />
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Moderator</th>


                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Join Date</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {moderatorsData.map((moderator) => (
                                        <tr key={moderator.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                        <Shield className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{moderator.name}</div>
                                                        <div className="text-gray-600 text-sm">{moderator.email}</div>
                                                    </div>
                                                </div>
                                            </td>


                                            <td className="py-4 px-6 text-gray-700">
                                                {new Date(moderator.joinDate).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${moderator.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {moderator.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-2">
                                                    <ActionButton
                                                        icon={Eye}
                                                        onClick={() => handleView(moderator.id)}
                                                        className="hover:bg-blue-50 text-blue-600"
                                                    />
                                                    <ActionButton
                                                        icon={Edit}
                                                        onClick={() => handleEdit(moderator.id)}
                                                        className="hover:bg-green-50 text-green-600"
                                                    />
                                                    <ActionButton
                                                        icon={Trash2}
                                                        onClick={() => handleDelete(moderator.id)}
                                                        className="text-red-600 hover:bg-red-50"
                                                    />
                                                    <ActionButton
                                                        icon={MoreHorizontal}
                                                        onClick={() => handleMore(moderator.id)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}