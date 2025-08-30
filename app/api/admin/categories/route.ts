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

// =============================================================
// Kategori ekleme (POST)
// =============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        {
          message: "Kategori adı gereklidir",
        },
        { status: 400 }
      );
    }
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: body.name,
      },
    });
    if (existingCategory) {
      return NextResponse.json(
        {
          message: "Bu kategori zaten mevcut",
        },
        { status: 400 }
      );
    }
    const category = await prisma.category.create({
      data: {
        name: body.name,
      },
    });
    return NextResponse.json(
      { category, message: "Kategori başarıyla oluşturuldu" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Kategori oluşturma hatası" },
      { status: 500 }
    );
  }
}
