import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@/Enum";

// =============================================================
// Specific Order (GET)
// =============================================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        items: true,
      },
    });
    if (!order) {
      return NextResponse.json(
        { message: "Sipariş Bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { order, message: "Sipariş Başarıyla Getirildi" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Sipariş Getirme Hatası" },
      { status: 500 }
    );
  }
}

// =============================================================
// Sipariş durumu ve kargo takip url düzenleme (PUT)
// =============================================================
type UpdateOrderRequestBody = Partial<{
  status: OrderStatus;
  shippingTrackingUrl: string;
}>;
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = (await request.json()) as UpdateOrderRequestBody;
    // 1. Sipariş var mı kontrolü
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingOrder) {
      return NextResponse.json(
        { message: "Sipariş bulunamadı" },
        { status: 404 }
      );
    }
    // 3. Güncelleme işlemi
    const updatedOrder = await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        ...body,
      },
    });
    return NextResponse.json(
      { updatedOrder, message: "Sipariş Başarıyla Güncellendi" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Sipariş Güncelleme Hatası" },
      { status: 500 }
    );
  }
}
