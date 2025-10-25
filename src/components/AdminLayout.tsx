"use client";
import { usePathname } from "next/navigation";

import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  FilePlus2,
  Menu,
  X,
  Bell,
  LogOut,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
 
      {/* Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
        <AdminFooter />
      </div>
    </div>
  );
}

/* Sidebar */
function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  const pathname = usePathname(); // ✅ Current route
const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { name: "Students Manage", icon: Users, href: "/admin/allStudents" },
    { name: "Mod Manage", icon: ShieldCheck, href: "/admin/allMods" },
    { name: "University Manage", icon: Building2, href: "/admin/allUniversity" },
    { name: "University Request", icon: FilePlus2, href: "/admin/allUniRequest" },
  ];
  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gray-800 text-gray-100 h-screen flex flex-col transition-all duration-300 sticky rounded-md border-r border-gray-800`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className={`text-lg font-semibold ${isOpen ? "block" : "hidden"}`}>
          Admin Panel
        </h1>
        <button onClick={() => setIsOpen(!isOpen)} className="hover:text-white text-gray-400">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
                ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-md"
                    : "text-gray-300 hover:bg-gray-700"
                }
              `}
            >
              <item.icon size={20} />
              <span className={`${isOpen ? "block" : "hidden"}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer inside sidebar */}
      <div className="text-center pb-4 text-xs opacity-60">
        {isOpen && "© 2025 Admin Panel"}
      </div>
    </div>
  );
}

/* Header */
function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications] = useState(4);

  return (
    <header className="bg-gray-800 w-full text-gray-100 px-6  py-5 flex items-center justify-between shadow-sm sticky top-0 z-50 border-b
     border-gray-800 rounded-r-md ">
      {/* Left */}
      <div className="flex items-center gap-4 ">
        <button onClick={onMenuClick} className="text-gray-300 hover:text-white lg:hidden">
          <Menu size={26} />
        </button>
        <h1 className="text-2xl font-bold ml-[-6]">Campus Connect </h1>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-10">
        {/* Notification */}
        <button className="relative hover:text-white text-gray-300">
          <Bell size={28} />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex justify-center items-center">
              {notifications}
            </span>
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => setDropdownOpen((p) => !p)} className="flex items-center gap-2">
            <Image src="/admin-avatar.jpg" alt="" width={46} height={46} className="rounded-full" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-xl">
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs opacity-60">admin@example.com</p>
              </div>
             <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 text-sm"
    >
      <LogOut size={18} /> Logout
    </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* Footer */
function AdminFooter() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm border-t border-gray-800 bottom-30">
      © {new Date().getFullYear()} Admin Panel |{" "}
      <span className="text-gray-200">Developed by Team NEUB</span>
    </footer>
  );
}
