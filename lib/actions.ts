"use server";

import { revalidatePath } from "next/cache";
import {
  getUser,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  createOrder,
} from "@/lib/services";
import { AddressFormData, CreateOrderData, ApiResponse } from "@/types";

// =============================================================
// KULLANICI AKSİYONLARI
// =============================================================

export async function getUserAction(): Promise<ApiResponse<any>> {
  try {
    const user = await getUser();

    if (user) {
      return {
        success: true,
        data: user,
        message: "Kullanıcı bilgileri başarıyla alındı.",
      };
    } else {
      return {
        success: false,
        message: "Kullanıcı bulunamadı veya giriş yapılmamış.",
      };
    }
  } catch (error: any) {
    console.error("getUserAction error:", error);
    return {
      success: false,
      message: error.message || "Kullanıcı bilgileri alınırken hata oluştu.",
    };
  }
}

// =============================================================
// ADRES AKSİYONLARI
// =============================================================

export async function addAddressAction(
  addressData: AddressFormData
): Promise<ApiResponse<any>> {
  try {
    const result = await addAddress(addressData);
    revalidatePath("/profil");

    return {
      success: true,
      data: result,
      message: "Adres başarıyla eklendi.",
    };
  } catch (error: any) {
    console.error("addAddressAction error:", error);
    return {
      success: false,
      message: error.message || "Adres eklenirken hata oluştu.",
    };
  }
}

export async function updateAddressAction(
  addressId: string,
  addressData: AddressFormData
): Promise<ApiResponse<any>> {
  try {
    const result = await updateAddress(addressId, addressData);
    revalidatePath("/profil");

    return {
      success: true,
      data: result,
      message: "Adres başarıyla güncellendi.",
    };
  } catch (error: any) {
    console.error("updateAddressAction error:", error);
    return {
      success: false,
      message: error.message || "Adres güncellenirken hata oluştu.",
    };
  }
}

export async function deleteAddressAction(
  addressId: string
): Promise<ApiResponse<void>> {
  try {
    await deleteAddress(addressId);
    revalidatePath("/profil");

    return {
      success: true,
      message: "Adres başarıyla silindi.",
    };
  } catch (error: any) {
    console.error("deleteAddressAction error:", error);
    return {
      success: false,
      message: error.message || "Adres silinirken hata oluştu.",
    };
  }
}

export async function setDefaultAddressAction(
  addressId: string
): Promise<ApiResponse<void>> {
  try {
    await setDefaultAddress(addressId);
    revalidatePath("/profil");

    return {
      success: true,
      message: "Varsayılan adres başarıyla güncellendi.",
    };
  } catch (error: any) {
    console.error("setDefaultAddressAction error:", error);
    return {
      success: false,
      message: error.message || "Varsayılan adres güncellenirken hata oluştu.",
    };
  }
}

// =============================================================
// SİPARİŞ AKSİYONLARI
// =============================================================

export async function createOrderAction(
  orderData: CreateOrderData
): Promise<ApiResponse<any>> {
  try {
    const order = await createOrder(orderData);
    revalidatePath("/profil"); // Siparişler sayfasını güncelle
    revalidatePath("/urunler"); // Stok güncellemelerini yansıt

    return {
      success: true,
      data: order,
      message: "Siparişiniz başarıyla oluşturuldu.",
    };
  } catch (error: any) {
    console.error("createOrderAction error:", error);
    return {
      success: false,
      message: error.message || "Sipariş oluşturulurken hata oluştu.",
    };
  }
}

// =============================================================
// ADMİN AKSİYONLARI
// =============================================================

export async function updateOrderStatusAction(
  orderId: string,
  status: string
): Promise<ApiResponse<any>> {
  try {
    const { updateOrderStatus } = await import("@/lib/services");
    const updatedOrder = await updateOrderStatus(orderId, status);
    revalidatePath("/admin/orders");

    return {
      success: true,
      data: updatedOrder,
      message: "Sipariş durumu başarıyla güncellendi.",
    };
  } catch (error: any) {
    console.error("updateOrderStatusAction error:", error);
    return {
      success: false,
      message: error.message || "Sipariş durumu güncellenirken hata oluştu.",
    };
  }
}

// =============================================================
// SİPARİŞ AKSİYONLARI
// =============================================================
