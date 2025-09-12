"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { UserRole } from "@/Enum";

//! Dashboard actions

// Dashboard stats
export async function getDashboardStats() {
  try {
    // Ek admin authentication kontrolü (middleware'den sonra)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.ADMIN) {
      return {
        success: false,
        message: "Yetkilendirme hatası.",
      };
    }
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      todayOrders,
      todayRevenue,
    ] = await Promise.all([
      // totalOrders
      prisma.order.count(),
      // totalRevenue
      prisma.order.aggregate({
        _sum: { totalPrice: true },
      }),
      // totalProducts
      prisma.product.count(),
      // todayOrders
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Bugün başlangıcı
          },
        },
      }),
      // todayRevenue
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Bugün başlangıcı
          },
          status: {
            notIn: ["PENDING", "CANCELLED"],
          },
        },
      }),
    ]);

    const stats = [
      {
        title: "Toplam Sipariş",
        value: totalOrders.toString(),
        change: "Tüm zamanlar",
        icon: "ShoppingCartIcon",
      },
      {
        title: "Toplam Kazanç",
        value: `${(totalRevenue._sum.totalPrice || 0).toLocaleString("tr-TR")} ₺`,
        change: "Tüm zamanlar",
        icon: "CurrencyDollarIcon",
      },
      {
        title: "Toplam Ürün",
        value: totalProducts.toString(),
        change: "Aktif ürünler",
        icon: "CubeIcon",
      },
      {
        title: "Bugünkü Siparişler",
        value: todayOrders.toString(),
        change: "Bugün",
        icon: "CalendarDaysIcon",
      },
      {
        title: "Bugünkü Kazanç",
        value: `${(todayRevenue._sum.totalPrice || 0).toLocaleString("tr-TR")} ₺`,
        change: "Bugün",
        icon: "CurrencyDollarIcon",
      },
    ];
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    revalidatePath("/admin/");
    return {
      success: false,
      message: "Dashboard stats yüklenirken bir hata oluştu.",
    };
  }
}
// Tip tanımlamaları
type DailyData = { name: string; Gelir: number };
type MonthlyData = { name: string; Gelir: number };
type DbDailyResult = { createdAt: Date; _sum: { totalPrice: number | null } };
type DbMonthlyResult = { month: Date; total: number };

/**
 * Veritabanından gelen ham veriyi son X gün için formatlar.
 * @param dbData Prisma'dan gelen gruplanmış veri.
 * @param days Kaç günlük veri oluşturulacağı (örn: 7, 30).
 * @param useDateFormat 1 ay için tarih formatı kullanılsın mı?
 * @returns Grafik için formatlanmış günlük veri dizisi.
 */
function formatDailyData(
  dbData: DbDailyResult[],
  days: number,
  useDateFormat: boolean = false
): DailyData[] {
  const revenueMap = new Map<string, number>();
  dbData.forEach((item) => {
    const dateStr = item.createdAt.toISOString().split("T")[0];
    const dailyTotal =
      (revenueMap.get(dateStr) || 0) + (item._sum.totalPrice || 0);
    revenueMap.set(dateStr, dailyTotal);
  });

  const formattedData: DailyData[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    let name: string;
    if (useDateFormat) {
      // 1 ay için ay.gün formatı (07.22, 07.23...)
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      name = `${month}.${day}`;
    } else {
      // 7 gün için gün adı (Pzt, Sal, Çar...)
      name = date.toLocaleDateString("tr-TR", { weekday: "short" });
    }

    formattedData.push({
      name,
      Gelir: revenueMap.get(dateStr) || 0,
    });
  }

  return formattedData.reverse(); // Tarihleri eskiden yeniye sırala
}
/**
 * Veritabanından gelen ham veriyi son 12 ay için formatlar.
 * @param dbData Prisma $queryRaw'dan gelen veri.
 * @returns Grafik için formatlanmış aylık veri dizisi.
 */
function formatMonthlyData(dbData: DbMonthlyResult[]): MonthlyData[] {
  const revenueMap = new Map<number, number>();
  dbData.forEach((item) => {
    // Gelen tarih string'ini Date objesine çevirip ay'ı (0-11) alıyoruz.
    const month = new Date(item.month).getMonth();
    revenueMap.set(month, Number(item.total)); // Gelen değer BigInt olabilir, Number'a çeviriyoruz.
  });

  const formattedData: MonthlyData[] = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.getMonth();

    formattedData.push({
      name: date.toLocaleDateString("tr-TR", { month: "short" }),
      Gelir: revenueMap.get(month) || 0,
    });
  }

  return formattedData.reverse(); // Ayları eskiden yeniye sırala
}
/**
 * Belirtilen periyoda göre dashboard gelir verilerini çeker ve formatlar.
 * @param period "7days", "1month", veya "1year".
 * @returns Başarı durumu, mesaj ve formatlanmış veri.
 */
export async function getDashboardRevenue(period: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.ADMIN) {
      return { success: false, message: "Yetkisiz erişim." };
    }

    let formattedData: DailyData[] | MonthlyData[] = [];

    switch (period) {
      case "7days": {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const dbData = await prisma.order.groupBy({
          by: ["createdAt"],
          where: {
            createdAt: { gte: startDate },
            status: {
              notIn: ["PENDING", "CANCELLED"],
            },
          },
          _sum: { totalPrice: true },
          orderBy: { createdAt: "asc" },
        });

        formattedData = formatDailyData(dbData, 7, false); // Gün adı formatı
        break;
      }
      case "1month": {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const dbData = await prisma.order.groupBy({
          by: ["createdAt"],
          where: {
            createdAt: { gte: startDate },
            status: {
              notIn: ["PENDING", "CANCELLED"],
            },
          },
          _sum: { totalPrice: true },
          orderBy: { createdAt: "asc" },
        });

        formattedData = formatDailyData(dbData, 30, true); // Ay.gün formatı
        break;
      }

      case "1year": {
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);

        // PostgreSQL için DATE_TRUNC fonksiyonunu kullanıyoruz.
        // Bu sorgu, createdAt alanını ay başına yuvarlar, bu aylara göre gruplar ve toplamı alır.
        const dbData = await prisma.$queryRaw<DbMonthlyResult[]>`
          SELECT DATE_TRUNC('month', "createdAt") as month, SUM("totalPrice") as total
          FROM "Order"
          WHERE "createdAt" >= ${startDate}
          AND "status" NOT IN ('PENDING', 'CANCELLED')
          GROUP BY month
          ORDER BY month ASC;
        `;

        formattedData = formatMonthlyData(dbData);
        break;
      }

      default:
        return { success: false, message: "Geçersiz periyot." };
    }

    return { success: true, data: formattedData };
  } catch (error) {
    console.error("Dashboard gelir verisi alınırken hata:", error);
    return { success: false, message: "Sunucu hatası oluştu." };
  }
}

// Recent orders
export async function getRecentOrders() {
  try {
    // Ek admin authentication kontrolü (middleware'den sonra)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.ADMIN) {
      return {
        success: false,
        message: "Yetkilendirme hatası.",
      };
    }

    const recentOrders = await prisma.order.findMany({
      take: 5,
      include: {
        customer: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedOrders = recentOrders.map((order) => ({
      id: order.id.slice(-8),
      customer: {
        name: order.customer?.name || "Bilinmiyor",
        email: order.customer?.email || "",
      },
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items,
    }));

    return {
      success: true,
      data: formattedOrders,
    };
  } catch (error) {
    console.error("Recent orders alınırken hata:", error);
    return {
      success: false,
      message: "Son siparişler yüklenirken bir hata oluştu.",
    };
  }
}
//! Product actions
export async function createProduct(formData: FormData) {
  try {
    // Ek admin authentication kontrolü (middleware'den sonra)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.ADMIN) {
      return {
        success: false,
        message: "Yetkilendirme hatası.",
      };
    }

    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      categoryId: formData.get("categoryId") as string,
      inStock: formData.get("inStock") === "on",
      stockCount: Number.parseInt(formData.get("stockCount") as string),
      material: formData.get("material") as string,
      color: formData.get("color") as string,
      sku: formData.get("sku") as string,
      sizeWidth: formData.get("sizeWidth")
        ? Number.parseFloat(formData.get("sizeWidth") as string)
        : null,
      sizeHeight: formData.get("sizeHeight")
        ? Number.parseFloat(formData.get("sizeHeight") as string)
        : null,
      sizeDepth: formData.get("sizeDepth")
        ? Number.parseFloat(formData.get("sizeDepth") as string)
        : null,
      images: formData.getAll("images") as string[],
    };
    // 2. İlişkisel Kontrol: Gönderilen categoryId geçerli mi?
    const categoryExists = await prisma.category.findUnique({
      where: { id: productData.categoryId },
    });
    if (!categoryExists) {
      return { success: false, message: "Geçersiz kategori ID'si." };
    }
    // 2.1 name unique kontrolü
    const productExists = await prisma.product.findUnique({
      where: { name: productData.name },
    });
    if (productExists) {
      return { success: false, message: "Bu ürün adı zaten kullanılıyor." };
    }
    // 3. Prisma ile yeni ürünü oluşturalım
    await prisma.product.create({
      data: productData,
    });
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Ürün başarıyla oluşturuldu.",
    };
  } catch (error) {
    console.log("Product would be created:", Object.fromEntries(formData));
    revalidatePath("/admin/products");
    return {
      success: false,
      message: "Ürün oluşturulurken bir hata oluştu.",
    };
  }
}

// lib/actions.ts

export async function updateProduct(id: string, formData: FormData) {
  try {
    // Ek admin authentication kontrolü (middleware'den sonra)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.ADMIN) {
      return {
        success: false,
        message: "Yetkilendirme hatası.",
      };
    }
    // 1. Ürünün mevcut halini veritabanından al
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return { success: false, message: "Güncellenecek ürün bulunamadı." };
    }

    // 2. Formdan gelen verileri yapılandır
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      categoryId: formData.get("categoryId") as string,
      inStock: formData.get("inStock") === "on",
      stockCount: Number.parseInt(formData.get("stockCount") as string),
      material: formData.get("material") as string,
      color: formData.get("color") as string,
      sku: formData.get("sku") as string,
      sizeWidth: formData.get("sizeWidth")
        ? Number.parseFloat(formData.get("sizeWidth") as string)
        : null,
      sizeHeight: formData.get("sizeHeight")
        ? Number.parseFloat(formData.get("sizeHeight") as string)
        : null,
      sizeDepth: formData.get("sizeDepth")
        ? Number.parseFloat(formData.get("sizeDepth") as string)
        : null,
      images: formData.getAll("images") as string[],
    };

    // 3. Değişen alanları tespit etmek için boş bir nesne oluştur
    const changedData: { [key: string]: any } = {};

    // 4. 'images' dizisini özel olarak karşılaştır
    // Sıralama, resimlerin sırası değişse bile içeriği aynıysa değişiklik olarak algılamamayı sağlar.
    const formImagesSorted = [...productData.images].sort().join(",");
    const dbImagesSorted = [...existingProduct.images].sort().join(",");
    if (formImagesSorted !== dbImagesSorted) {
      changedData.images = productData.images;
    }

    // 5. Diğer tüm alanları döngüyle karşılaştır
    type ProductDataWithoutImages = Omit<typeof productData, "images">;

    // 'images' haricindeki anahtarları alarak döngüye başlıyoruz
    const keysToCompare = Object.keys(productData).filter(
      (key) => key !== "images"
    ) as Array<keyof ProductDataWithoutImages>;

    keysToCompare.forEach((key) => {
      const formValue = productData[key];
      const dbValue = existingProduct[key];

      if (formValue !== dbValue) {
        changedData[key] = formValue;
      }
    });
    // name unique kontrolü
    if (changedData.name) {
      const productNameExists = await prisma.product.findUnique({
        where: { name: changedData.name },
      });
      if (productNameExists) {
        return { success: false, message: "Bu ürün adı zaten kullanılıyor." };
      }
    }
    // 6. Hiçbir değişiklik yoksa işlemi bitir
    if (Object.keys(changedData).length === 0) {
      return { success: true, message: "Herhangi bir değişiklik yapılmadı." };
    }

    // 7. Gerekli yan kontrolleri yap (sadece değişen alanlar için)
    if (changedData.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: changedData.categoryId },
      });
      if (!categoryExists) {
        return { success: false, message: "Seçilen yeni kategori bulunamadı." };
      }
    }

    // 8. Sadece değişen verilerle Prisma güncelleme işlemini yap
    await prisma.product.update({
      where: { id },
      data: changedData,
    });

    // 9. İlgili sayfanın önbelleğini temizle
    revalidatePath("/admin/products");

    // 10. Başarılı yanıtı döndür
    return { success: true, message: "Ürün başarıyla güncellendi." };
  } catch (error) {
    // 11. Hata yönetimi
    console.error("Ürün güncelleme sırasında hata oluştu:", error);
    return {
      success: false,
      message: "Ürün güncellenirken beklenmedik bir hata oluştu.",
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    // Ek admin authentication kontrolü (middleware'den sonra)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.ADMIN) {
      return {
        success: false,
        message: "Yetkilendirme hatası.",
      };
    }
    await prisma.product.delete({ where: { id } });

    revalidatePath("/admin/products");
    return { success: true, message: "Ürün başarıyla silindi." };
  } catch (error) {
    return {
      success: false,
      message: "Ürün silinemedi. Bir hata oluştu.",
    };
  }
}

//! Order actions
export async function updateOrderStatus(id: string, formData: FormData) {
  try {
    // Ek admin authentication kontrolü (middleware'den sonra)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.ADMIN) {
      return {
        success: false,
        message: "Yetkilendirme hatası.",
      };
    }
    const orderData = {
      status: formData.get("status") as string,
      shippingTrackingUrl: formData.get("shippingTrackingUrl") as string,
    };

    const response = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("API endpoint not available");
    }

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.log(
      "Order status would be updated:",
      id,
      Object.fromEntries(formData)
    );
    revalidatePath("/admin/orders");
    return { success: true };
  }
}

// Kategori Oluşturma
export async function createCategory(formData: FormData) {
  try {
    // Ek admin authentication kontrolü (middleware'den sonra)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.ADMIN) {
      return {
        success: false,
        message: "Yetkilendirme hatası.",
      };
    }
    const name = formData.get("name") as string;
    if (!name) {
      return { success: false, message: "Kategori adı boş olamaz." };
    }

    await prisma.category.create({ data: { name } });

    revalidatePath("/admin/products");
    return { success: true, message: "Kategori başarıyla oluşturuldu." };
  } catch (error: any) {
    if (error.code === "P2002") {
      // Prisma unique constraint error code
      return {
        success: false,
        message: "Bu isimde bir kategori zaten mevcut.",
      };
    }
    return {
      success: false,
      message: "Kategori oluşturulurken bir hata oluştu.",
    };
  }
}

// Kategori Güncelleme
export async function updateCategory(id: string, formData: FormData) {
  try {
    // Ek admin authentication kontrolü (middleware'den sonra)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.ADMIN) {
      return {
        success: false,
        message: "Yetkilendirme hatası.",
      };
    }
    const name = formData.get("name") as string;
    if (!name) {
      return { success: false, message: "Kategori adı boş olamaz." };
    }

    await prisma.category.update({ where: { id }, data: { name } });

    revalidatePath("/admin/products");
    return { success: true, message: "Kategori başarıyla güncellendi." };
  } catch (error) {
    return {
      success: false,
      message: "Kategori güncellenirken bir hata oluştu.",
    };
  }
}

// Kategori Silme
export async function deleteCategory(id: string) {
  try {
    // Ek admin authentication kontrolü (middleware'den sonra)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.ADMIN) {
      return {
        success: false,
        message: "Yetkilendirme hatası.",
      };
    }
    await prisma.category.delete({ where: { id } });

    revalidatePath("/admin/products");
    return { success: true, message: "Kategori başarıyla silindi." };
  } catch (error) {
    return {
      success: false,
      message: "Kategori silinemedi. Bu kategoriye bağlı ürünler olabilir.",
    };
  }
}

//! Settings actions
export async function updateSettings(formData: FormData) {
  try {
    // Ek admin authentication kontrolü (middleware'den sonra)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.ADMIN) {
      return {
        success: false,
        message: "Yetkilendirme hatası.",
      };
    }
    // 1. Mevcut ayarları al
    const existingSettings = await prisma.settings.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!existingSettings) {
      return {
        success: false,
        message: "Ayarlar bulunamadı. Lütfen önce ayarları oluşturun.",
      };
    }

    // 2. Formdan gelen verileri yapılandır
    const settingsData = {
      siteTitle: formData.get("siteTitle") as string,
      contactPhone: formData.get("contactPhone") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactAddress: formData.get("contactAddress") as string,
      facebookUrl: formData.get("facebookUrl") as string,
      xUrl: formData.get("xUrl") as string,
      instagramUrl: formData.get("instagramUrl") as string,
      linkedinUrl: formData.get("linkedinUrl") as string,
      googleMapsUrl: formData.get("googleMapsUrl") as string,
      orderContactInfoText: formData.get("orderContactInfoText") as string,
      welcomeText: formData.get("welcomeText") as string,
      footerText: formData.get("footerText") as string,
    };

    // 3. Değişen alanları tespit etmek için boş bir nesne oluştur
    const changedData: { [key: string]: any } = {};

    // 4. Tüm alanları karşılaştır
    Object.keys(settingsData).forEach((key) => {
      const formValue = settingsData[key as keyof typeof settingsData];
      const dbValue = existingSettings[key as keyof typeof existingSettings];

      if (formValue !== dbValue) {
        changedData[key] = formValue;
      }
    });

    // 5. Hiçbir değişiklik yoksa işlemi bitir
    if (Object.keys(changedData).length === 0) {
      return {
        success: true,
        message: "Herhangi bir değişiklik yapılmadı.",
      };
    }

    // 6. Sadece değişen verilerle güncelleme işlemini yap
    await prisma.settings.update({
      where: { id: existingSettings.id },
      data: changedData,
    });

    // 7. İlgili sayfanın önbelleğini temizle
    revalidatePath("/admin/settings");
    revalidatePath("/"); // Ana sayfayı da yenile (welcome text vb. için)

    return {
      success: true,
      message: "Ayarlar başarıyla güncellendi.",
    };
  } catch (error) {
    console.error("Ayarlar güncelleme sırasında hata oluştu:", error);
    return {
      success: false,
      message: "Ayarlar güncellenirken beklenmedik bir hata oluştu.",
    };
  }
}
