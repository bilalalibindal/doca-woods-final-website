import type React from "react";
import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { Toaster } from "sonner";

// Admin layout'u dinamik olmalı
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Admin Panel - E-commerce",
  description:
    "E-commerce admin panel for managing products, orders, and categories",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
        <Toaster position="top-center" duration={1500} />
      </div>
    </div>
  );
}
