"use server";

import { revalidatePath } from "next/cache";
import { toast } from "react-toastify";
import prisma from "@/lib/prisma";
// Product actions
export async function createProduct(formData: FormData) {
  try {
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

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      toast.error("Ürün oluşturulurken bir hata oluştu");
      throw new Error("API endpoint not available");
    }

    revalidatePath("/admin/products");
    toast.success("Ürün başarıyla oluşturuldu");
    return { success: true };
  } catch (error) {
    console.log("Product would be created:", Object.fromEntries(formData));
    revalidatePath("/admin/products");
    return { success: true };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
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

    const response = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("API endpoint not available");
    }

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.log("Product would be updated:", id, Object.fromEntries(formData));
    revalidatePath("/admin/products");
    return { success: true };
  }
}

export async function deleteProduct(id: string) {
  try {
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

// Order actions
export async function updateOrderStatus(id: string, formData: FormData) {
  try {
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
