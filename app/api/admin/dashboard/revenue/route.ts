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

    return NextResponse.json(dailyRevenue);
  } catch (error) {
    console.error("Revenue API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
