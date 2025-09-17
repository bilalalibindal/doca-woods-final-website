import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz erişim" },
        { status: 401 }
      );
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Yetkisiz erişim" },
        { status: 401 }
      );
    }
    const formData = await request.formData();
    console.log("FormData keys:", Array.from(formData.keys()));
    const file = formData.get("image") as File;

    if (!file) {
      console.log("File not found in formData");
      return NextResponse.json(
        { success: false, message: "Resim dosyası bulunamadı." },
        { status: 400 }
      );
    }

    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Dosya tipini kontrol et
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Sadece resim dosyaları yüklenebilir." },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Dosya boyutu en fazla 5MB olabilir." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          upload_preset: "admin-product-uploads", // GÜVENLİ, SIGNED PRESET'İMİZ
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // @ts-expect-error Cloudinary result type mismatch
    const imageUrl = result.secure_url;
    console.log("IMAGE RESULT: ", result);
    return NextResponse.json({ success: true, url: imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Resim yükleme hatası:", error);
    return NextResponse.json(
      { success: false, message: "Resim yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
