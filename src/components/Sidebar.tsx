"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  FilePlus2,
  Menu,
  X,
} from "lucide-react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/ccAdminDashboard972647" },
    { name: "Students Manage", icon: Users, href: "/allStudents" },
    { name: "Mod Manage", icon: ShieldCheck, href: "/allMods" },
    { name: "University Manage", icon: Building2, href: "/allUniversity" },
    { name: "University Request", icon: FilePlus2, href: "/allUniRequest" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64 rounded-md" : "w-26 rounded-md"
        } bg-gray-900 text-gray-100 h-screen p-4 flex flex-col transition-all duration-300 sticky top-2`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 mt-4">
          <h1
            className={`text-xl font-semibold transition-opacity duration-300 mt-4 ${
              isOpen ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            Admin Panel
          </h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} className="ml-2" />}
          </button>
        </div>

        {/* Menu Links */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 text-gray-300 hover:bg-gray-800 px-3 py-2 rounded-md transition-all"
            >
              <item.icon size={20} />
              <span
                className={`text-sm font-medium transition-opacity duration-200 ${
                  isOpen ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto">
          <p
            className={`text-xs text-gray-500 transition-opacity ${
              isOpen ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            © 2025 Admin
          </p>
        </div>
      </div>
    </div>
  );
}
