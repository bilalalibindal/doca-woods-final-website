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

// Beklenen istek gövdesinin tipini tanımlayalım

interface CreateProductRequestBody {
  name: string;
  description: string;
  images: string[];
  price: number;
  inStock: boolean;
  stockCount: number;
  material: string;
  color: string;
  sku: string;
  sizeWidth?: number;
  sizeHeight?: number;
  sizeDepth?: number;
  categoryId: string;
}

// =============================================================
// Ürün oluşturma (POST)
// =============================================================
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateProductRequestBody;
    const {
      name,
      description,
      images,
      price,
      inStock,
      stockCount,
      material,
      color,
      sku,
      sizeWidth,
      sizeHeight,
      sizeDepth,
      categoryId,
    } = body;

    // 1. Temel Girdi Doğrulaması
    if (
      !name ||
      !description ||
      !images ||
      !price ||
      !inStock ||
      !stockCount ||
      !material ||
      !color ||
      !sizeWidth ||
      !sizeHeight ||
      !sizeDepth ||
      !categoryId
    ) {
      return NextResponse.json(
        { message: "Lütfen zorunlu alanları doldurunuz." },
        { status: 400 }
      );
    }
    // 2. İlişkisel Kontrol: Gönderilen categoryId geçerli mi?
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      return NextResponse.json(
        { message: "Geçersiz kategori ID'si." },
        { status: 400 }
      );
    }

    // 3. Prisma ile yeni ürün oluşturma
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        images,
        price,
        inStock,
        stockCount,
        material,
        color,
        sku,
        categoryId,
        sizeWidth,
        sizeHeight,
        sizeDepth,
      },
    });
    return NextResponse.json(
      {
        newProduct,
        message: "Ürün başarıyla oluşturuldu.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ürün oluşturulurken hata:", error);
    return NextResponse.json(
      { message: "Ürün oluşturulurken beklenmedik bir hata oluştu." },
      { status: 500 }
    );
  }
}
