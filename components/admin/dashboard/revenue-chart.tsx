"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";

export function RevenueChart() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/admin/dashboard/revenue");
        if (!response.ok) throw new Error("API endpoint not available");
        const data = await response.json();
        setRevenueData(data);
      } catch (error) {
        console.error("Revenue data yüklenirken hata:", error);
        // Fallback data
        setRevenueData([
          { day: "Pzt", revenue: 2400 },
          { day: "Sal", revenue: 1398 },
          { day: "Çar", revenue: 9800 },
          { day: "Per", revenue: 3908 },
          { day: "Cum", revenue: 4800 },
          { day: "Cmt", revenue: 3800 },
          { day: "Paz", revenue: 4300 },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Gelir Grafiği
        </CardTitle>
        <CardDescription className="text-gray-600">
          Son 7 gündeki günlük satış gelirleri
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={revenueData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="day"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toLocaleString("tr-TR")} ₺`}
            />
            <Tooltip
              formatter={(value) => [
                `${value.toLocaleString("tr-TR")} ₺`,
                "Gelir",
              ]}
              labelStyle={{ color: "#374151" }}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar
              dataKey="revenue"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
