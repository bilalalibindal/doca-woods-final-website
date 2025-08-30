import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type UpdateCategoryRequestBody = {
  name: string;
};

// =============================================================
// Kategori güncelleme (PUT)
// =============================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = (await request.json()) as UpdateCategoryRequestBody;
    const updatedCategory = await prisma.category.update({
      where: {
        id: id,
      },
      data: body,
    });
    return NextResponse.json(
      { updatedCategory, message: "Kategori başarıyla güncellendi" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Kategori güncelleme hatası" },
      { status: 500 }
    );
  }
}

// =============================================================
// Kategori silme (DELETE)
// =============================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deletedCategory = await prisma.category.delete({
      where: {
        id: id,
      },
    });
    if (!deletedCategory) {
      return NextResponse.json(
        {
          message: "Kategori bulunamadı",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Kategori başarıyla silindi",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Kategori silme hatası",
      },
      { status: 500 }
    );
  }
}
