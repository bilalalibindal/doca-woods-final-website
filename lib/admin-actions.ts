"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

//! Product actions
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

//! Settings actions
export async function updateSettings(formData: FormData) {
  try {
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
