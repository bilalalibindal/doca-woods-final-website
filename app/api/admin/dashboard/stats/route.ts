import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { UserRole } from "@/Enum";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Session kontrolü
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const stats = [
      {
        title: "Toplam Sipariş",
        value: totalOrders.toString(),
        change: "Tüm zamanlar",
        icon: "ShoppingCartIcon",
      },
      {
        title: "Toplam Kazanç",
        value: `${(totalRevenue._sum.totalPrice || 0).toLocaleString("tr-TR")} ₺`,
        change: "Tüm zamanlar",
        icon: "CurrencyDollarIcon",
      },
      {
        title: "Toplam Ürün",
        value: totalProducts.toString(),
        change: "Aktif ürünler",
        icon: "CubeIcon",
      },
      {
        title: "Bugünkü Siparişler",
        value: todayOrders.toString(),
        change: "Bugün",
        icon: "CalendarDaysIcon",
      },
    ];

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
