//src\app\admin\layout.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import AdminLayout from "@/components/AdminLayout";

import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AdminLayout>
            {children}
          </AdminLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
