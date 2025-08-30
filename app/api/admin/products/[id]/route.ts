import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Beklenen istek gövdesinin tiplerini tanımlayalım
// Güncelleme için tüm alanlar opsiyonel olabilir, bu yüzden Partial kullanıyoruz.
type UpdateProductRequestBody = Partial<{
  name: string;
  description: string;
  images: string[];
  price: number;
  stockCount: number;
  material: string;
  color: string;
  sku: string;
  categoryId: string;
  sizeWidth?: number;
  sizeHeight?: number;
  sizeDepth?: number;
  inStock: boolean;
}>;

// =============================================================
// Belirli bir ürünü ID ile güncelleme (PUT)
// =============================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = (await request.json()) as UpdateProductRequestBody;

    // 1. Ürün var mı kontrolü
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingProduct) {
      return NextResponse.json({ message: "Ürün bulunamadı" }, { status: 404 });
    }

    // 2. Eğer kategori değiştiriliyorsa yeni kategorinin varlığı kontrolü
    if (body.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: {
          id: body.categoryId,
        },
      });
      if (!categoryExists) {
        return NextResponse.json(
          { message: "Geçersiz kategori ID'si" },
          { status: 400 }
        );
      }
    }

    // 3. Güncelleme işlemi
    const updatedProduct = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        ...body,
      },
    });
    return NextResponse.json(
      {
        updatedProduct,
        message: "Ürün başarıyla güncellendi",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Ürün güncelleme hatası" },
      { status: 500 }
    );
  }
}

// =============================================================
// Belirli bir ürünü ID ile silme (DELETE)
// =============================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deletedProduct = await prisma.product.delete({
      where: {
        id: id,
      },
    });
    if (!deletedProduct) {
      return NextResponse.json({ message: "Ürün bulunamadı" }, { status: 404 });
    }
    // Başarılı silme işlemi
    return NextResponse.json(
      { message: "Ürün başarıyla silindi" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Ürün silme hatası" }, { status: 500 });
  }
}
