'use client'
import React from 'react';
import { GraduationCap, Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, MapPin, Users } from 'lucide-react';

const universitiesData = [
    { id: 1, name: 'Massachusetts Institute of Technology', code: 'MIT', students: 1250, status: 'Active', location: 'Cambridge, MA', established: 1861, partnership: '2024-01-15' },
    { id: 2, name: 'Stanford University', code: 'STAN', students: 980, status: 'Active', location: 'Stanford, CA', established: 1885, partnership: '2024-02-20' },
    { id: 3, name: 'Harvard University', code: 'HARV', students: 1100, status: 'Active', location: 'Cambridge, MA', established: 1636, partnership: '2024-01-10' },
    { id: 4, name: 'California Institute of Technology', code: 'CALTECH', students: 420, status: 'Active', location: 'Pasadena, CA', established: 1891, partnership: '2024-03-05' },
    { id: 5, name: 'Princeton University', code: 'PRIN', students: 890, status: 'Pending', location: 'Princeton, NJ', established: 1746, partnership: '2024-02-28' },
];



const TableHeader = ({ title, addButtonText }: { title: string, addButtonText: string }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search universities..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
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

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Active':
            return 'bg-green-100 text-green-800';
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'Inactive':
            return 'bg-red-100 text-red-800';
        case 'Suspended':
            return 'bg-orange-100 text-orange-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function UniversityManage() {
    const handleView = (universityId: number) => {
        console.log('View university:', universityId);
    };

    const handleEdit = (universityId: number) => {
        console.log('Edit university:', universityId);
    };

    const handleDelete = (universityId: number) => {
        console.log('Delete university:', universityId);
    };

    const handleMore = (universityId: number) => {
        console.log('More actions for university:', universityId);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="space-y-6">
                    <TableHeader title="Manage Universities" addButtonText="Add University" />
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">University</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Code</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Students</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Location</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Partnership</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {universitiesData.map((university) => (
                                        <tr key={university.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                        <GraduationCap className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{university.name}</div>
                                                        <div className="text-gray-600 text-sm">Est. {university.established}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                                    {university.code}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-2">
                                                    <Users className="w-4 h-4 text-blue-600" />
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                        {university.students.toLocaleString()} students
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-700">{university.location}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-700">
                                                {new Date(university.partnership).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(university.status)}`}>
                                                    {university.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-2">
                                                    <ActionButton
                                                        icon={Eye}
                                                        onClick={() => handleView(university.id)}
                                                        className="hover:bg-blue-50 text-blue-600"
                                                    />
                                                    <ActionButton
                                                        icon={Edit}
                                                        onClick={() => handleEdit(university.id)}
                                                        className="hover:bg-green-50 text-green-600"
                                                    />
                                                    <ActionButton
                                                        icon={Trash2}
                                                        onClick={() => handleDelete(university.id)}
                                                        className="text-red-600 hover:bg-red-50"
                                                    />
                                                    <ActionButton
                                                        icon={MoreHorizontal}
                                                        onClick={() => handleMore(university.id)}
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