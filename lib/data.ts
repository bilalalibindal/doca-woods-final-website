import {
  mockProducts,
  mockOrders,
  mockCategories,
  mockDashboardStats,
  mockRevenueData,
} from "./mockData";
import type { Product, Order, Category } from "@/types/admin";
import prisma from "@/lib/prisma";

// Dashboard data fetching
export async function getDashboardStats() {
  try {
    const response = await fetch("/api/admin/dashboard/stats");
    if (!response.ok) throw new Error("API endpoint not available");
    return await response.json();
  } catch (error) {
    return mockDashboardStats;
  }
}

export async function getRevenueData() {
  try {
    const response = await fetch("/api/admin/dashboard/revenue");
    if (!response.ok) throw new Error("API endpoint not available");
    return await response.json();
  } catch (error) {
    return mockRevenueData;
  }
}

export async function getRecentOrders() {
  try {
    const response = await fetch("/api/admin/orders/recent");
    if (!response.ok) throw new Error("API endpoint not available");
    return await response.json();
  } catch (error) {
    return mockOrders.slice(0, 5);
  }
}

// Products data fetching
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
    if (!products) {
      console.error("Ürünler alınamadı, mockProducts gösteriliyor");
      return mockProducts;
    }
    return products;
  } catch (error) {
    console.error("Ürünler alınamadı, mockProducts gösteriliyor:", error);
    return mockProducts;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/admin/products/${id}`);
    if (!response.ok) throw new Error("API endpoint not available");
    return await response.json();
  } catch (error) {
    return mockProducts.find((p) => p.id === id) || null;
  }
}

// Orders data fetching
export async function getOrders(): Promise<Order[]> {
  try {
    const response = await fetch("/api/admin/orders");
    if (!response.ok) throw new Error("API endpoint not available");
    return await response.json();
  } catch (error) {
    return mockOrders;
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const response = await fetch(`/api/admin/orders/${id}`);
    if (!response.ok) throw new Error("API endpoint not available");
    return await response.json();
  } catch (error) {
    return mockOrders.find((o) => o.id === id) || null;
  }
}

// Categories data fetching
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany();
    if (!categories) {
      console.error("Kategoriler alınamadı, mockCategories gösteriliyor");
      return mockCategories;
    }

    return categories;
  } catch (error) {
    return mockCategories;
  }
}
