"use client";

import { Bell, LogOut, Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // example badge count

  return (
    <header className="bg-gray-900 text-gray-100 px-6 py-3 flex items-center justify-between shadow-md sticky top-0 z-50">
      {/* Left section (menu toggle for mobile) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-300 hover:text-white"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold tracking-wide">Admin Dashboard</h1>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6 relative">
        {/* Notification */}
        <button className="relative text-gray-300 hover:text-white transition">
          <Bell size={22} />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {notifications}
            </span>
          )}
        </button>

        {/* Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <Image
              src="/admin-avatar.png"
              alt="Admin"
              width={32}
              height={32}
              className="rounded-full border border-gray-600"
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-gray-400">admin@example.com</p>
              </div>
              <button
                onClick={() => alert("Logging out...")}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition"
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
