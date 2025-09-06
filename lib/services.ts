"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Product, Category, User, AddressFormData } from "@/types";
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
