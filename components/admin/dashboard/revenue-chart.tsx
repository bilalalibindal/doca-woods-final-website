"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useState } from "react";

interface RevenueChartProps {
  revenue7Days?: {
    success: boolean;
    data?: Array<{ name: string; Gelir: number }>;
    message?: string;
  };
  revenue1Month?: {
    success: boolean;
    data?: Array<{ name: string; Gelir: number }>;
    message?: string;
  };
  revenue1Year?: {
    success: boolean;
    data?: Array<{ name: string; Gelir: number }>;
    message?: string;
  };
}

export function RevenueChart({
  revenue7Days,
  revenue1Month,
  revenue1Year,
}: RevenueChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");

  // Fallback data'lar
  const fallback7Days = [
    { name: "Pzt", Gelir: 2400 },
    { name: "Sal", Gelir: 1398 },
    { name: "Çar", Gelir: 9800 },
    { name: "Per", Gelir: 3908 },
    { name: "Cum", Gelir: 4800 },
    { name: "Cmt", Gelir: 3800 },
    { name: "Paz", Gelir: 4300 },
  ];

  const fallback1Month = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i)); // 30 gün geriye doğru
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return {
      name: `${month}.${day}`,
      Gelir: Math.floor(Math.random() * 10000) + 1000,
    };
  });

  const fallback1Year = [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ].map((month) => ({
    name: month,
    Gelir: Math.floor(Math.random() * 50000) + 10000,
  }));

  // Geçerli veriyi seç
  const getCurrentData = () => {
    switch (selectedPeriod) {
      case "7days":
        return revenue7Days?.success && revenue7Days?.data
          ? revenue7Days.data.map((item: any) => ({
              name: item.day || item.name,
              Gelir: item.revenue || item.Gelir,
            }))
          : fallback7Days;
      case "1month":
        return revenue1Month?.success && revenue1Month?.data
          ? revenue1Month.data.map((item: any) => ({
              name: item.day || item.name,
              Gelir: item.revenue || item.Gelir,
            }))
          : fallback1Month;
      case "1year":
        return revenue1Year?.success && revenue1Year?.data
          ? revenue1Year.data.map((item: any) => ({
              name: item.day || item.name,
              Gelir: item.revenue || item.Gelir,
            }))
          : fallback1Year;
      default:
        return fallback7Days;
    }
  };

  const chartData = getCurrentData();

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "7days":
        return "Son 7 gündeki günlük satış gelirleri";
      case "1month":
        return "Son 30 gündeki günlük satış gelirleri";
      case "1year":
        return "Son 12 aydaki aylık satış gelirleri";
      default:
        return "Satış gelirleri";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Gelir Grafiği
            </CardTitle>
            <CardDescription className="text-gray-600">
              {getPeriodLabel()}
            </CardDescription>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Dönem seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Son 7 Gün</SelectItem>
              <SelectItem value="1month">Son 1 Ay</SelectItem>
              <SelectItem value="1year">Son 1 Yıl</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="name"
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
              dataKey="Gelir"
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
