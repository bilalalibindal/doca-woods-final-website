"use server";

import prisma from "@/lib/prisma";

import { Category, mockCategories, mockProducts, Product } from "../mockData";
import { User } from "@/app/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { toast } from "sonner";

//! Ürün Servisleri
export async function productServices() {
  async function getProducts(): Promise<Product[]> {
    // daha sonra veritabanından çekilecek prisma ile
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    console.log(products);
    if (products.length > 0) {
      return products as Product[];
    } else {
      return mockProducts;
    }
  }
  return { getProducts };
}

//! Kategori Servisleri
export async function categoryServices() {
  async function getCategories(): Promise<Category[]> {
    const categories = await prisma.category.findMany();
    console.log(categories);
    if (categories.length > 0) {
      return categories as Category[];
    } else {
      return mockCategories;
    }
  }
  return { getCategories };
}

//! Kullanıcı Servisleri
export async function userServices() {
  async function getUser(): Promise<User | null> {
    const session = await getServerSession(authOptions);
    if (!session) {
      toast.error("Kullanıcı girişi yapılmamış");
      return null;
    }
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
      include: {
        addresses: true,
        orders: true,
      },
    });
    return user as User;
  }
  return { getUser };
}
