"use server";

import { userServices } from "./services/user-services";

// User actions
export async function getUserAction() {
  try {
    const { getUser } = await userServices();
    const user = await getUser();

    if (user) {
      return {
        success: true,
        user: user,
        message: "Kullanıcı bilgileri başarıyla alındı.",
      };
    } else {
      return {
        success: false,
        user: null,
        message: "Kullanıcı bulunamadı veya giriş yapılmamış.",
      };
    }
  } catch (error: any) {
    console.error("getUserAction error:", error);
    return {
      success: false,
      user: null,
      message: error.message || "Kullanıcı bilgileri alınırken hata oluştu.",
    };
  }
}
