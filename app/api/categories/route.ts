import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// =============================================================
// Kategori listeleme (GET)
// =============================================================
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany();
    if (!categories) {
      return NextResponse.json(
        {
          message: "Kategori bulunamadı",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Kategori listeleme hatası",
      },
      { status: 500 }
    );
  }
}
