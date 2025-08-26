"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export default function Home() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Dummy admin credentials
  const adminEmail = "rezax@example.com";
  const hashedPassword = bcrypt.hashSync("admin123", 10); // Pre-hashed password

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Check credentials
    if (email !== adminEmail) {
      setError("Invalid Email Address");
      return;
    }

    if (!bcrypt.compareSync(password, hashedPassword)) {
      setError("Invalid Password");
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ email: adminEmail }, "your_jwt_secret", {
      expiresIn: "3d",
    });

    // Save token in localStorage
    localStorage.setItem("adminToken", token);

    // Redirect to dashboard
    router.replace("/ccAdminDashboard972647");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-700">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/admin-icon.png"
            alt="Admin"
            width={80}
            height={80}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold text-white mt-4">Admin Login</h1>
        </div>

        {error && (
          <p className="text-red-400 text-center mb-4 text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
