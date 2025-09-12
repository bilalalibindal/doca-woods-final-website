import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/admin-actions";
import {
  ShoppingCartIcon,
  CurrencyDollarIcon,
  CubeIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

interface DashboardStatsProps {
  statsData?: {
    success: boolean;
    data?: Array<{
      title: string;
      value: string;
      change: string;
      icon: string;
    }>;
    message?: string;
  };
}

export function DashboardStats({ statsData }: DashboardStatsProps) {
  const result = statsData || { success: false, message: "Veri bulunamadı" };

  if (!result.success || !result.data) {
    // Fallback data
    const fallbackStats = [
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
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {fallbackStats.map(
          (
            stat: {
              title: string;
              value: string;
              change: string;
              icon: string;
            },
            index: number
          ) => {
            const IconComponent = getIcon(stat.icon);
            return (
              <Card
                key={stat.title}
                className="hover:shadow-lg transition-shadow"
              >
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
          }
        )}
      </div>
    );
  }

  const stats = result.data;

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      ShoppingCartIcon,
      CurrencyDollarIcon,
      CubeIcon,
      CalendarDaysIcon,
    };
    return iconMap[iconName] || ShoppingCartIcon;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map(
        (
          stat: { title: string; value: string; change: string; icon: string },
          index: number
        ) => {
          const IconComponent = getIcon(stat.icon);
          return (
            <Card
              key={stat.title}
              className="hover:shadow-lg transition-shadow"
            >
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
        }
      )}
    </div>
  );
}
