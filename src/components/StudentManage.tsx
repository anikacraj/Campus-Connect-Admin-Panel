'use client'
import React from 'react';
import { Users, Shield, GraduationCap, Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';

const studentsData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', university: 'MIT', status: 'Active', portfolio: 15 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', university: 'Stanford', status: 'Inactive', portfolio: 8 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', university: 'Harvard', status: 'Active', portfolio: 22 },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', university: 'Yale', status: 'Active', portfolio: 18 },
    { id: 5, name: 'David Brown', email: 'david@example.com', university: 'Princeton', status: 'Inactive', portfolio: 12 },
];

const TableHeader = ({ title, addButtonText }: { title: string, addButtonText: string }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search students..."
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

export default function StudentManage() {
    const handleView = (studentId: number) => {
        console.log('View student:', studentId);
    };

    const handleEdit = (studentId: number) => {
        console.log('Edit student:', studentId);
    };

    const handleDelete = (studentId: number) => {
        console.log('Delete student:', studentId);
    };

    const handleMore = (studentId: number) => {
        console.log('More actions for student:', studentId);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="space-y-6">
                    <TableHeader title="Manage Students" addButtonText="Add Student" />
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Student</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">University</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Portfolios</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsData.map((student) => (
                                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{student.name}</div>
                                                    <div className="text-gray-600 text-sm">{student.email}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-700">{student.university}</td>
                                            <td className="py-4 px-6">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                    {student.portfolio} projects
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${student.status === 'Active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-2">
                                                    <ActionButton
                                                        icon={Eye}
                                                        onClick={() => handleView(student.id)}
                                                        className="hover:bg-blue-50 text-blue-600"
                                                    />
                                                    <ActionButton
                                                        icon={Edit}
                                                        onClick={() => handleEdit(student.id)}
                                                        className="hover:bg-green-50 text-green-600"
                                                    />
                                                    <ActionButton
                                                        icon={Trash2}
                                                        onClick={() => handleDelete(student.id)}
                                                        className="text-red-600 hover:bg-red-50"
                                                    />
                                                    <ActionButton
                                                        icon={MoreHorizontal}
                                                        onClick={() => handleMore(student.id)}
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