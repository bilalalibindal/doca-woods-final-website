import {
  mockProducts,
  mockOrders,
  mockCategories,
  mockDashboardStats,
  mockRevenueData,
} from "./mockData";
import type { Product, Order, Category } from "@/types/admin";
import prisma from "@/lib/prisma";

// Dashboard data fetching
export async function getDashboardStats() {
  try {
    // Gerçek veritabanı verilerini çek
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      todayOrders,
      todayRevenue,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalPrice: true },
      }),
      prisma.product.count(),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Bugün başlangıcı
          },
        },
      }),
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Bugün başlangıcı
          },
        },
      }),
    ]);

    return [
      {
        title: "Toplam Sipariş",
        value: totalOrders.toString(),
        change: "Tüm zamanlar",
        icon: () => null,
      },
      {
        title: "Toplam Kazanç",
        value: `${(totalRevenue._sum.totalPrice || 0).toLocaleString("tr-TR")} ₺`,
        change: "Tüm zamanlar",
        icon: () => null,
      },
      {
        title: "Toplam Ürün",
        value: totalProducts.toString(),
        change: "Aktif ürünler",
        icon: () => null,
      },
      {
        title: "Bugünkü Siparişler",
        value: todayOrders.toString(),
        change: "Bugün",
        icon: () => null,
      },
    ];
  } catch (error) {
    console.error("Dashboard stats alınırken hata:", error);
    const { mockDashboardStats } = await import("./mockData");
    return mockDashboardStats;
  }
}

export async function getRevenueData() {
  try {
    // Son 7 günün günlük gelir verilerini çek
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueData = await prisma.order.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      _sum: {
        totalPrice: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Günlük olarak grupla ve formatla
    const dailyRevenue = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayData = revenueData.find(
        (item) => item.createdAt.toISOString().split("T")[0] === dateStr
      );

      dailyRevenue.push({
        day: date.toLocaleDateString("tr-TR", { weekday: "short" }),
        revenue: dayData?._sum.totalPrice || 0,
      });
    }

    return dailyRevenue;
  } catch (error) {
    console.error("Revenue data alınırken hata:", error);
    const { mockRevenueData } = await import("./mockData");
    return mockRevenueData;
  }
}

export async function getRecentOrders() {
  try {
    const recentOrders = await prisma.order.findMany({
      take: 5,
      include: {
        customer: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return recentOrders.map((order) => ({
      id: order.id.slice(-10),
      customer: {
        name: order.customer?.name || "Bilinmiyor",
        email: order.customer?.email || "",
      },
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items,
    }));
  } catch (error) {
    console.error("Recent orders alınırken hata:", error);
    const { mockOrders } = await import("./mockData");
    return mockOrders.slice(0, 5).map((order) => ({
      id: order.id.slice(-10),
      customer: order.customer,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items || [],
    }));
  }
}

// Products data fetching
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!products) {
      console.error("Ürünler alınamadı, mockProducts gösteriliyor");
      return mockProducts;
    }
    return products;
  } catch (error) {
    console.error("Ürünler alınamadı, mockProducts gösteriliyor:", error);
    return mockProducts;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/admin/products/${id}`);
    if (!response.ok) throw new Error("API endpoint not available");
    return await response.json();
  } catch (error) {
    return mockProducts.find((p) => p.id === id) || null;
  }
}

// Orders data fetching
export async function getOrders(): Promise<Order[]> {
  try {
    const response = await fetch("/api/admin/orders");
    if (!response.ok) throw new Error("API endpoint not available");
    return await response.json();
  } catch (error) {
    return mockOrders;
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const response = await fetch(`/api/admin/orders/${id}`);
    if (!response.ok) throw new Error("API endpoint not available");
    return await response.json();
  } catch (error) {
    return mockOrders.find((o) => o.id === id) || null;
  }
}

// Categories data fetching
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany();
    if (!categories) {
      console.error("Kategoriler alınamadı, mockCategories gösteriliyor");
      return mockCategories;
    }

    return categories;
  } catch (error) {
    return mockCategories;
  }
}
