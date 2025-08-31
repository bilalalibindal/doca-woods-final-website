import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// =============================================================
// Ürün listeleme (GET)
// =============================================================
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      // Her ürünün, ilişkili kategorisinin adını da göster
      include: {
        category: true,
      },
      // En yeni ürünler en üstte gösterilsin
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(
      {
        products,
        message: "Ürünler başarıyla listelendi.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ürünler listelenirken bir hata oluştu:", error);
    return NextResponse.json(
      { message: "Ürünler listelenirken beklenmedik bir hata oluştu." },
      { status: 500 }
    );
  }
}
