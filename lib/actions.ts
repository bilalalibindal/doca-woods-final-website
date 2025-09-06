"use server";

import { revalidatePath } from "next/cache";
import {
  getUser,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/services";
import { AddressFormData, ApiResponse } from "@/types";

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
