import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Lütfen Giriş yapınız.",
        },
        { status: 401 }
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        addresses: true,
        orders: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
