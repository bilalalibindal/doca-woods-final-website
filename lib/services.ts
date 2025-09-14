"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import {
  Product,
  Category,
  User,
  AddressFormData,
  CreateOrderData,
} from "@/types";
import { mockProducts, mockCategories } from "@/lib/mockData";

// =============================================================
// ÜRÜN SERVİSLERİ
// =============================================================

export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (products.length > 0) {
      return products as Product[];
    } else {
      return mockProducts;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return mockProducts;
  }
}

// =============================================================
// KATEGORİ SERVİSLERİ
// =============================================================

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany();

    if (categories.length > 0) {
      return categories as Category[];
    } else {
      return mockCategories;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return mockCategories;
  }
}

// =============================================================
// AYARLAR SERVİSLERİ
// =============================================================

export async function getSettings() {
  try {
    const settings = await prisma.settings.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (settings) {
      return settings;
    } else {
      // Varsayılan ayarları oluştur
      const defaultSettings = await prisma.settings.create({
        data: {},
      });
      return defaultSettings;
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Varsayılan ayarları döndür
    return {
      id: 1,
      siteTitle: "Doca Woods",
      contactPhone: "+90 555 123 4567",
      contactEmail: "info@docawoods.com",
      contactAddress: "İstanbul, Türkiye",
      facebookUrl: "",
      xUrl: "",
      instagramUrl: "",
      linkedinUrl: "",
      googleMapsUrl: "",
      orderContactInfoText:
        "Siparişinizin Onayı için Lütfen sipariş numaranızı kopyalayıp Whatsapp üzerinden +90 555 123 4567 numarasına gönderiniz",
      welcomeText:
        "Ahşap Mobilya, Ahşap İşleme ve Ahşap Dekorasyon - Özel Tasarımlar ve Kalite",
      footerText: "TELİF HAKKI © 2024 DOCA WOODS - TÜM HAKLARI SAKLIDIR.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

// =============================================================
// KULLANICI SERVİSLERİ
// =============================================================

export async function getUser(): Promise<User | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        addresses: true,
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
            address: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        lastLoginAt: new Date().toISOString(),
      },
    });
    return user as User | null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function addAddress(addressData: AddressFormData): Promise<any> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      // Bu hatayı API katmanında yakalayıp uygun HTTP yanıtı dönmek daha iyi olur.
      throw new Error("Kullanıcı girişi yapılmamış.");
    }
    const userId = session.user.id;

    // Transaction başlatmadan önce hızlı bir kontrol yapmak mantıklıdır.
    // Veritabanına boşuna yük bindirmemiş oluruz.
    const addressCount = await prisma.address.count({
      where: { userId },
    });

    if (addressCount >= 2) {
      throw new Error("En fazla 2 adres oluşturabilirsiniz.");
    }

    // Transaction ile atomik işlemler gerçekleştir
    const newAddress = await prisma.$transaction(async (tx) => {
      // Eğer yeni adres varsayılan olarak işaretlenmişse,
      // önce mevcut varsayılan adresi güncelle.
      if (addressData.varsayilan) {
        await tx.address.updateMany({
          where: {
            userId: userId,
            varsayilan: true,
          },
          data: {
            varsayilan: false,
          },
        });
      }

      // Ardından yeni adresi oluştur.
      // `tx` objesini `prisma` yerine kullanıyoruz.
      const createdAddress = await tx.address.create({
        data: {
          ...addressData,
          userId: userId,
        },
      });

      return createdAddress;
    });

    return newAddress;
  } catch (error) {
    console.error("Adres eklenirken hata oluştu:", error);
    // Hatanın türüne göre daha spesifik mesajlar döndürülebilir.
    // Örneğin, 'Error' nesnesi yerine özel bir hata sınıfı.
    throw new Error("Adres eklenirken bir sorun oluştu.");
  }
}

export async function updateAddress(
  addressId: string,
  addressData: AddressFormData
): Promise<any> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Kullanıcı girişi yapılmamış");
    }

    // Eğer varsayılan adres olarak işaretlenmişse, diğer adresleri varsayılan olmaktan çıkar
    if (addressData.varsayilan) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          id: { not: addressId }, // Güncellenen adres hariç
        },
        data: {
          varsayilan: false,
        },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: {
        id: addressId,
        userId: session.user.id, // Güvenlik için kullanıcı kontrolü
      },
      data: addressData,
    });

    return updatedAddress;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
}

export async function deleteAddress(addressId: string): Promise<void> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Kullanıcı girişi yapılmamış");
    }

    await prisma.address.delete({
      where: {
        id: addressId,
        userId: session.user.id, // Güvenlik için kullanıcı kontrolü
      },
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
}

export async function setDefaultAddress(addressId: string): Promise<void> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Kullanıcı girişi yapılmamış");
    }

    // Önce tüm adresleri varsayılan olmaktan çıkar
    await prisma.address.updateMany({
      where: {
        userId: session.user.id,
      },
      data: {
        varsayilan: false,
      },
    });

    // Seçilen adresi varsayılan yap
    await prisma.address.update({
      where: {
        id: addressId,
        userId: session.user.id,
      },
      data: {
        varsayilan: true,
      },
    });
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
}

// =============================================================
// SİPARİŞ SERVİSLERİ
// =============================================================

/* New Order Created: {
  id: 'cmfdyazg70004ere7a43savrk',
  totalPrice: 7656,
  status: 'PENDING',
  shippingTrackingUrl: null,
  customizationImages: [],
  customerId: 'cmezl75l6000074fkglo0q0ms',
  addressId: 'cmf8ear7b0003c6gxvavjbrkl',
  createdAt: 2025-09-10T12:23:44.887Z,
  updatedAt: 2025-09-10T12:23:44.887Z,
  items: [
    {
      id: 'cmfdyazg70005ere7ft1qc8fd',
      quantity: 1,
      price: 456,
      orderId: 'cmfdyazg70004ere7a43savrk',
      productId: 'cmez9mj1y0003bzgyzl4mad0u',
      product: [Object]
    },
    {
      id: 'cmfdyazg70006ere71s8i6wx9',
      quantity: 1,
      price: 7200,
      orderId: 'cmfdyazg70004ere7a43savrk',
      productId: 'cmf8e3n400001c6gxav8fx7em',
      product: [Object]
    }
  ],
  address: {
    id: 'cmf8ear7b0003c6gxvavjbrkl',
    addressTitle: 'Ev',
    ulke: 'Türkiye',
    sehir: 'Manisa',
    mahalle: 'Kuşlubahçe',
    sokak: '4207 Sok.',
    no: '5/8',
    postaKodu: '45200',
    tarif: 'Şehzadeler Apt',
    varsayilan: true,
    userId: 'cmezl75l6000074fkglo0q0ms',
    createdAt: 2025-09-06T15:04:50.999Z,
    updatedAt: 2025-09-09T13:03:42.861Z
  }
} */
export async function createOrder(orderData: CreateOrderData): Promise<any> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Kullanıcı girişi yapılmamış");
    }

    // Önce ürünlerin stok kontrolü yapalım
    const productIds = orderData.products.map((p) => p.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Stok kontrolü
    for (const cartItem of orderData.products) {
      const dbProduct = dbProducts.find((p) => p.id === cartItem.productId);
      if (!dbProduct) {
        throw new Error(`Ürün bulunamadı: ${cartItem.productId}`);
      }
      if (dbProduct.stockCount < cartItem.quantity) {
        throw new Error(`Stok yetersiz: ${dbProduct.name}`);
      }
    }

    // Toplam fiyat hesapla
    const totalPrice = orderData.products.reduce((acc, cartItem) => {
      const dbProduct = dbProducts.find((p) => p.id === cartItem.productId);
      return acc + (dbProduct?.price || 0) * cartItem.quantity;
    }, 0);

    // Transaction ile sipariş oluştur
    const result = await prisma.$transaction(async (tx) => {
      // Gerekli ürün bilgilerini (özellikle fiyat) önceden hazırlayalım
      const itemsToCreate = orderData.products.map((cartItem) => {
        const dbProduct = dbProducts.find((p) => p.id === cartItem.productId);
        // dbProduct'ın varlığını en başta kontrol ettiğimiz için burada güvenle kullanabiliriz.
        return {
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          price: dbProduct!.price, // Sipariş anındaki fiyat
        };
      });

      // Siparişi ve kalemlerini tek bir işlemde oluştur
      const newOrder = await tx.order.create({
        data: {
          customerId: session.user.id,
          addressId: orderData.addressId,
          totalPrice: totalPrice,
          customizationImages: orderData.customizationImages || [],
          // İlişkili kayıtları burada oluşturuyoruz
          items: {
            createMany: {
              data: itemsToCreate,
            },
          },
        },
        // Include artık doğru çalışacak çünkü kalemler aynı anda oluşturuluyor
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
        },
      });

      // Stok güncellemesi kaldırıldı - Admin onayladığında yapılacak
      console.log("New Order Created:", newOrder);
      // Fonksiyonun istediği formatta geri dönüş yap
      return {
        order: newOrder,
        customer: {
          email: session?.user?.email,
          name: session?.user?.name,
        },
      };
    });

    return result;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// =============================================================
// ADMİN SERVİSLERİ
// =============================================================

export async function getOrdersForAdmin(
  page: number = 1,
  limit: number = 20,
  search?: string,
  status?: string,
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
): Promise<{
  orders: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> {
  try {
    const session = await getServerSession(authOptions);
    // TODO: Admin kontrolü aktifleştirilecek
    // if (!session?.user?.role || session.user.role !== "ADMIN") {
    //   throw new Error("Yetkisiz erişim");
    // }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Search by order ID or customer name
    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { customer: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Filter by status
    if (status && status !== "all") {
      where.status = status;
    }

    // Get total count for pagination
    const totalCount = await prisma.order.count({ where });

    // Get orders with relations
    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);
    return {
      orders,
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching orders for admin:", error);
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<any> {
  try {
    const session = await getServerSession(authOptions);
    // TODO: Admin kontrolü aktifleştirilecek
    // if (!session?.user?.role || session.user.role !== "ADMIN") {
    //   throw new Error("Yetkisiz erişim");
    // }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return updatedOrder;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

export async function updateOrderShippingTrackingUrl(
  orderId: string,
  shippingTrackingUrl: string
): Promise<any> {
  try {
    const session = await getServerSession(authOptions);
    // TODO: Admin kontrolü aktifleştirilecek
    // if (!session?.user?.role || session.user.role !== "ADMIN") {
    //   throw new Error("Yetkisiz erişim");
    // }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { shippingTrackingUrl: shippingTrackingUrl },
      select: {
        id: true,
        shippingTrackingUrl: true,
      },
    });

    return updatedOrder;
  } catch (error) {
    console.error("Error updating order shipping tracking url:", error);
    throw error;
  }
}

// =============================================================
// CUSTOMERS ADMIN FUNCTIONS
// =============================================================

export async function getUsersForAdmin(
  page: number = 1,
  limit: number = 20,
  search: string = "",
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) {
  const skip = (page - 1) * limit;

  // Build where condition for search
  const where: any = {
    role: "USER", // Sadece normal kullanıcıları getir
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  // Build orderBy
  const orderBy: any = {};
  orderBy[sortBy] = sortOrder;

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            addresses: true,
          },
        },
      },
    }),
    prisma.user.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    users,
    totalCount,
    totalPages,
    currentPage: page,
  };
}

export async function getCustomersStats() {
  const now = new Date();

  const [totalCustomers, dailyVisitors, monthlyVisitors] = await Promise.all([
    // Toplam müşteri sayısı
    prisma.user.count({
      where: { role: "USER" },
    }),
    // Günlük ziyaretçi sayısı (son 24 saatte giriş yapmış kullanıcılar)
    prisma.user.count({
      where: {
        role: "USER",
        lastLoginAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Son 24 saat
        },
      },
    }),
    // Aylık ziyaretçi sayısı (son 30 günde giriş yapmış kullanıcılar)
    prisma.user.count({
      where: {
        role: "USER",
        lastLoginAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Son 30 gün
        },
      },
    }),
  ]);

  return {
    totalCustomers,
    dailyVisitors,
    monthlyVisitors,
  };
}

// =============================================================
// USER UPDATE FUNCTIONS
// =============================================================

export async function updateUser(userData: { phone?: string; name?: string }) {
  // Get current session to identify user
  const { getServerSession } = await import("next-auth");
  const { authOptions } = await import(
    "@/app/api/auth/[...nextauth]/authOptions"
  );

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Kullanıcı oturumu bulunamadı");
  }

  // Update user data
  const updatedUser = await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: userData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          orders: true,
          addresses: true,
        },
      },
    },
  });

  return updatedUser;
}
