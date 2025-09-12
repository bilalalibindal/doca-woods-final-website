import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { RecentOrders } from "@/components/admin/dashboard/recent-orders";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg opacity-90">
          E-ticaret mağazanızın performansını yönetin ve takip edin
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart />
        <RecentOrders />
      </div>
    </div>
  );
}
