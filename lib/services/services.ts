"use server";

import prisma from "@/lib/prisma";

import { Category, mockCategories, mockProducts, Product } from "../mockData";

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
