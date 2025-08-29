"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  ArchiveBoxIcon, // Envanter için
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Ahşap Atölyesi logosu için özel bir SVG component'i
const WorkshopLogo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

const AdminNavigationPane = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Mevcut AdminNavigation.tsx'den alınan ve ikonlarla zenginleştirilen linkler
  const navigationLinks = [
    { href: "/admin", label: "Dashboard", icon: HomeIcon },
    { href: "/admin/products", label: "Ürünler", icon: CubeIcon },
    { href: "/admin/orders", label: "Siparişler", icon: ShoppingCartIcon },
    { href: "/admin/customers", label: "Müşteriler", icon: UsersIcon },
    { href: "/admin/reports", label: "Raporlar", icon: ChartBarIcon },
    { href: "/admin/inventory", label: "Envanter", icon: ArchiveBoxIcon },
    { href: "/admin/settings", label: "Ayarlar", icon: CogIcon },
  ];

  // Çıkış yapma fonksiyonu
  const handleLogout = () => {
    // Gelecekte token'ı buradan temizleyebilirsiniz
    // localStorage.removeItem("adminToken");
    console.log("Çıkış yapıldı.");
    router.push("/admin/login"); // Login sayfasına yönlendir
  };

  return (
    <div
      className={`relative flex min-h-screen flex-col bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Alanı */}
      <div className="flex h-20 items-center border-b border-gray-200 px-4">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-orange-600">
            <WorkshopLogo className="h-6 w-6 text-white" />
          </div>
          <div
            className={`transition-opacity duration-200 ${
              isCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="whitespace-nowrap text-xl font-bold text-amber-900">
              Doca Woods
            </span>
          </div>
        </Link>
      </div>

      {/* Navigasyon Linkleri */}
      <nav className="flex-1 space-y-1 p-3">
        {navigationLinks.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              title={isCollapsed ? item.label : ""}
              className={`group relative flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-amber-100 text-amber-900"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`h-6 w-6 flex-shrink-0 ${
                  isActive
                    ? "text-amber-600"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
              />
              <span
                className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${
                  isCollapsed ? "opacity-0" : "opacity-100"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Alt Bölüm: Daralt/Genişlet ve Çıkış */}
      <div className="mt-auto border-t border-gray-200 p-3">
        {/* Daralt/Genişlet Butonu */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="group relative flex w-full items-center justify-center rounded-lg px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
          title={isCollapsed ? "Genişlet" : "Daralt"}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-6 w-6 flex-shrink-0" />
          ) : (
            <ChevronLeftIcon className="h-6 w-6 flex-shrink-0" />
          )}
        </button>
        {/* Çıkış Butonu */}
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Çıkış Yap" : ""}
          className="group relative mt-2 flex w-full items-center rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6 flex-shrink-0" />
          <span
            className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${
              isCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            Çıkış Yap
          </span>
        </button>
      </div>
    </div>
  );
};

export default AdminNavigationPane;
