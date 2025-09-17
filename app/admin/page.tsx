import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { RecentOrders } from "@/components/admin/dashboard/recent-orders";
import {
  getDashboardStats,
  getDashboardRevenue,
  getRecentOrders,
} from "@/lib/admin-actions";

// Admin sayfası dinamik olmalı (headers, session bilgileri kullanıyor)
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Verileri server-side'da çek
  const [
    statsResult,
    revenue7DaysResult,
    revenue1MonthResult,
    revenue1YearResult,
    ordersResult,
  ] = await Promise.all([
    getDashboardStats(),
    getDashboardRevenue("7days"),
    getDashboardRevenue("1month"),
    getDashboardRevenue("1year"),
    getRecentOrders(),
  ]);

  return (
    <div className="space-y-8">
      <DashboardStats statsData={statsResult} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart
          revenue7Days={revenue7DaysResult}
          revenue1Month={revenue1MonthResult}
          revenue1Year={revenue1YearResult}
        />
        <RecentOrders ordersData={ordersResult} />
      </div>
    </div>
  );
}
