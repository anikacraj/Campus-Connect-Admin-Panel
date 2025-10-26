"use client";

import AdminLayoutComponent from "@/components/AdminLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutComponent>{children}</AdminLayoutComponent>;
}