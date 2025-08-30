import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json(
      { success: false, message: "Resim dosyası bulunamadı." },
      { status: 400 }
    );
  }
  try {
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

    // @ts-ignore
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
