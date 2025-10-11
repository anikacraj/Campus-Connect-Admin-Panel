"use client"
import { Users, Shield, GraduationCap, Plus, Eye, Bell, Settings, User, ChevronDown, Home, Menu, X } from 'lucide-react';
import React, { useState } from 'react';

export default function Header() {
       const [activeSection, setActiveSection] = useState('dashboard');
        const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div>   
         <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 h-22 pt-2.5 mt-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                        
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
</div>
  )
}
