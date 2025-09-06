import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// =============================================================
// Adres oluşturma (POST)
// =============================================================
interface createAddressRequestBody {
  id: string;
  addressTitle: string;
  ulke: string;
  sehir: string;
  mahalle: string;
  sokak: string;
  no: string;
  postaKodu: string;
  tarif: string;
  varsayilan: boolean;
}
export async function POST(request: NextRequest) {
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
    });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }
    const body = (await request.json()) as createAddressRequestBody;
    const {
      id,
      addressTitle,
      ulke,
      sehir,
      mahalle,
      sokak,
      no,
      postaKodu,
      tarif,
      varsayilan,
    } = body;
    // 1. Temel Girdi Doğrulaması
    if (
      !id ||
      !addressTitle ||
      !ulke ||
      !sehir ||
      !mahalle ||
      !sokak ||
      !no ||
      !postaKodu ||
      !tarif ||
      !varsayilan
    ) {
      return NextResponse.json(
        { message: "Eksik veya hatalı bilgi gönderildi." },
        { status: 400 }
      );
    }
    // 2. Adres oluşturma
    await prisma.address.create({
      data: {
        id,
        addressTitle,
        ulke,
        sehir,
        mahalle,
        sokak,
        no,
        postaKodu,
        tarif,
        varsayilan,
        userId: session.user.id,
      },
    });
    return NextResponse.json(
      { message: "Adres başarıyla oluşturuldu." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Adres oluşturma hatası." },
      { status: 500 }
    );
  }
}
