import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

// =============================================================
// Sipariş oluşturma (POST)
// =============================================================
// Beklenen istek gövdesinin tipini tanımlayalım

interface CreateOrderRequestBody {
  customerId: string;
  addressId: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  customizationImages?: string[];
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
    const body = (await request.json()) as CreateOrderRequestBody;
    const { customerId, addressId, products, customizationImages } = body;

    // 1. Temel Girdi Doğrulaması
    if (
      !customerId ||
      !addressId ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return NextResponse.json(
        { message: "Eksik veya hatalı bilgi gönderildi." },
        { status: 400 }
      );
    }
    // 2. Transaction başlatma: Tüm işlemler ya başarılı olacak ya da hiçbiri olmayacak.
    const newOrder = await prisma.$transaction(async (tx) => {
      // 3. Ürün ID'lerini ve veritabanındaki ürün bilgilerini al
      const productIds = products.map((p) => p.productId);
      const dbProducts = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      // Gönderilen tüm ürünlerin veritabanında olduğundan emin ol
      if (dbProducts.length !== productIds.length) {
        throw new Error("Geçersiz veya bulunamayan ürün(ler) mevcut.");
      }

      // 4. Stok kontrolü ve toplam fiyat hesaplama
      let totalPrice = 0;
      const orderItemsData = [];
      //! Burayı sorucam
      for (const productInCart of products) {
        const dbProduct = dbProducts.find(
          (p) => p.id === productInCart.productId
        );
        if (!dbProduct) {
          // Bu kontrol findMany sayesinde gereksiz ama ekstra güvenlik katmanı
          throw new Error(`Ürün bulunamadı: ${productInCart.productId}`);
        }

        // Stok yeterli mi?
        if (dbProduct.stockCount < productInCart.quantity) {
          throw new Error(
            `Stok yetersiz: ${dbProduct.name} (Stok: ${dbProduct.stockCount})`
          );
        }

        totalPrice += dbProduct.price * productInCart.quantity;

        // OrderItem verisini hazırla
        orderItemsData.push({
          productId: dbProduct.id,
          quantity: productInCart.quantity,
          price: dbProduct.price, // Fiyatı veritabanından, sipariş anındaki haliyle kaydet
        });
      }

      // 5. Sİparişi ve ona bağlı OrderItem'ları tek bir komutla oluşturma
      // (Nested Write) ile birlikte
      const createdOrder = await tx.order.create({
        data: {
          customerId,
          addressId,
          totalPrice,
          customizationImages: customizationImages || [],
          items: {
            create: orderItemsData, // orderItemsData'daki orderItem'ları oluştur
          },
        },
        include: {
          items: {
            // Oluşturulan order item'ları da geri döndür
            include: {
              product: true, // Her item'ın ürün bilgisini de ekle
            },
          },
        },
      });
      return createdOrder;
    });
    // Her şey başarılıysa, oluşturulan siparişi döndür
    return NextResponse.json(
      { newOrder, message: "Siparişiniz Başarıyla Oluşturuldu" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sipariş oluşturulurken hata:", error);
    return NextResponse.json(
      { message: "Sipariş oluşturulurken beklenmedik bir hata oluştu." },
      { status: 500 }
    );
  }
}
