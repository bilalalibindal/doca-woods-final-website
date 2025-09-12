"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  ShoppingCartIcon,
  CurrencyDollarIcon,
  CubeIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

export function DashboardStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/dashboard/stats");
        if (!response.ok) throw new Error("API endpoint not available");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Dashboard stats yüklenirken hata:", error);
        // Fallback data
        setStats([
          {
            title: "Toplam Sipariş",
            value: "0",
            change: "Tüm zamanlar",
            icon: "ShoppingCartIcon",
          },
          {
            title: "Toplam Kazanç",
            value: "0 ₺",
            change: "Tüm zamanlar",
            icon: "CurrencyDollarIcon",
          },
          {
            title: "Toplam Ürün",
            value: "0",
            change: "Aktif ürünler",
            icon: "CubeIcon",
          },
          {
            title: "Bugünkü Siparişler",
            value: "0",
            change: "Bugün",
            icon: "CalendarDaysIcon",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      ShoppingCartIcon,
      CurrencyDollarIcon,
      CubeIcon,
      CalendarDaysIcon,
    };
    return iconMap[iconName] || ShoppingCartIcon;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat: any, index: number) => {
        const IconComponent = getIcon(stat.icon);
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                {stat.title}
              </CardTitle>
              <IconComponent className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
