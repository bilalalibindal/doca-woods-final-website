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
    console.log("User:", user);
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
      throw new Error("Kullanıcı girişi yapılmamış");
    }

    // Eğer varsayılan adres olarak işaretlenmişse, diğer adresleri varsayılan olmaktan çıkar
    if (addressData.varsayilan) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
        },
        data: {
          varsayilan: false,
        },
      });
    }

    // Yeni adres oluştur
    const newAddress = await prisma.address.create({
      data: {
        ...addressData,
        userId: session.user.id,
      },
    });

    return newAddress;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
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

      // Stokları ayrıca güncellememiz gerekiyor
      for (const cartItem of orderData.products) {
        await tx.product.update({
          where: { id: cartItem.productId },
          data: {
            stockCount: {
              decrement: cartItem.quantity,
            },
          },
        });
      }

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
    console.log("Admin-Orders:", orders);
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
      },
    });

    return updatedOrder;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}
