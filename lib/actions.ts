"use server";

import { revalidatePath } from "next/cache";
import {
  getUser,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  createOrder,
  updateOrderShippingTrackingUrl,
} from "@/lib/services";
import { sendMail } from "@/lib/email-sender";
import { AddressFormData, CreateOrderData, ApiResponse } from "@/types";
import { signOut } from "next-auth/react";

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
      signOut({ callbackUrl: "/profil" });
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
    const result = await createOrder(orderData);

    revalidatePath("/profil"); // Siparişler sayfasını güncelle
    revalidatePath("/urunler"); // Stok güncellemelerini yansıt

    // Sipariş onay bekliyor email'i gönder (background'da)
    try {
      // Ürün bilgilerini email için hazırla
      const orderItemsForEmail = result.order.items.map((item: any) => ({
        name: item.product?.name || "Ürün Adı Yok",
        quantity: item.quantity,
        price: item.price,
        image: item.product?.images?.[0], // İlk resmi al
        sku: item.product?.sku || "N/A",
      }));
      // Email'i gönder (background'da çalıştır)
      setImmediate(async () => {
        try {
          await sendMail(
            result.customer.email,
            result.customer.name,
            "Siparişiniz Onay Sürecinde",
            "orderPending",
            {
              orderId: result.order.id,
              orderItems: orderItemsForEmail,
            }
          );
        } catch (emailError) {
          console.error("Sipariş email gönderme hatası:", emailError);
          // Email hatası ana işlemi etkilemesin
        }
      });
    } catch (emailError) {
      console.error("Email hazırlama hatası:", emailError);
      // Email hatası ana işlemi etkilemesin
    }

    return {
      success: true,
      data: result.order,
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
/* UPDATED ORDER:: {
  id: 'cmfdxspcp0001ere7aj0yft6z',
  totalPrice: 7200,
  status: 'APPROVED',
  shippingTrackingUrl: null,
  customizationImages: [],
  customerId: 'cmezl75l6000074fkglo0q0ms',
  addressId: 'cmf8ear7b0003c6gxvavjbrkl',
  createdAt: 2025-09-10T12:09:31.993Z,
  updatedAt: 2025-09-10T12:28:54.707Z,
  customer: {
    id: 'cmezl75l6000074fkglo0q0ms',
    name: 'bilalali bindal',
    email: 'bilalalibindal@gmail.com'
  },
  items: [
    {
      id: 'cmfdxspcp0002ere71rbmub6o',
      quantity: 1,
      price: 7200,
      orderId: 'cmfdxspcp0001ere7aj0yft6z',
      productId: 'cmf8e3n400001c6gxav8fx7em',
      product: [Object]
    }
  ]
}
Email gönderme  */

/* ORDER ITEMS FOR EMAIL(UPDATE):  [
  {
    name: 'Resimli Tabela',
    quantity: 1,
    price: 7200,
    image: 'https://res.cloudinary.com/dwahclxhr/image/upload/v1757170710/arljinnfncqok8x7ef9o.jpg',
    sku: 'asas'
  }
] */
export async function updateOrderStatusAction(
  orderId: string,
  status: string
): Promise<ApiResponse<any>> {
  try {
    const { updateOrderStatus } = await import("@/lib/services");
    const updatedOrder = await updateOrderStatus(orderId, status);
    // revalidatePath kaldırıldı - modal içinde local güncelleme yapılacak

    // Sipariş durumu değiştiğinde otomatik email gönder
    try {
      let emailSubject:
        | "Siparişiniz Onaylandı"
        | "Siparişiniz Hazırlanıyor"
        | "Siparişiniz Kargoda"
        | "Siparişiniz Teslim Edildi"
        | "Siparişiniz İptal Edildi" = "Siparişiniz Onaylandı";
      let emailTemplate = "";

      switch (status) {
        case "APPROVED":
          emailSubject = "Siparişiniz Onaylandı";
          emailTemplate = "orderApproved";
          break;
        case "PREPARING":
          emailSubject = "Siparişiniz Hazırlanıyor";
          emailTemplate = "orderPreparing";
          break;
        case "SHIPPED":
          emailSubject = "Siparişiniz Kargoda";
          emailTemplate = "orderShipped";
          break;
        case "DELIVERED":
          emailSubject = "Siparişiniz Teslim Edildi";
          emailTemplate = "orderDelivered";
          break;
        case "CANCELLED":
          emailSubject = "Siparişiniz İptal Edildi";
          emailTemplate = "orderCancelled";
          break;
        default:
          return {
            success: true,
            data: updatedOrder,
            message: "Sipariş durumu başarıyla güncellendi.",
          };
      }
      const orderItemsForEmail = updatedOrder.items.map((item: any) => ({
        name: item.product?.name || "Ürün Adı Yok",
        quantity: item.quantity,
        price: item.price,
        image: item.product?.images?.[0], // İlk resmi al
        sku: item.product?.sku || "N/A",
      }));
      console.log("UPDATED ORDER:: ", updatedOrder);
      console.log("STATUS:: ", status);
      console.log("ORDER ITEMS FOR EMAIL(UPDATE): ", orderItemsForEmail);
      // Email'i background'da gönder
      setImmediate(async () => {
        try {
          await sendMail(
            updatedOrder.customer.email,
            updatedOrder.customer.name,
            emailSubject,
            emailTemplate as any,
            {
              orderId: updatedOrder.id,
              orderItems: orderItemsForEmail,
              ...(status === "SHIPPED" && {
                shippingTrackingUrl: updatedOrder.shippingTrackingUrl,
              }),
              // İptal için neden eklenebilir
              ...(status === "CANCELLED" && { reason: "Admin kararı" }),
            }
          );
        } catch (emailError) {
          console.error("Durum güncelleme email hatası:", emailError);
        }
      });
    } catch (emailError) {
      console.error("Email hazırlama hatası:", emailError);
    }

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

export async function updateOrderShippingTrackingUrlAction(
  orderId: string,
  shippingTrackingUrl: string
): Promise<ApiResponse<any>> {
  try {
    const updatedOrder = await updateOrderShippingTrackingUrl(
      orderId,
      shippingTrackingUrl
    );
    // revalidatePath kaldırıldı - modal içinde local güncelleme yapılacak
    return {
      success: true,
      data: updatedOrder,
      message: "Kargo takip URL'si başarıyla güncellendi.",
    };
  } catch (error: any) {
    console.error("updateOrderShippingTrackingUrlAction error:", error);
    return {
      success: false,
      message:
        error.message || "Kargo takip URL'si güncellenirken hata oluştu.",
    };
  }
}

// =============================================================
// SİPARİŞ AKSİYONLARI
// =============================================================
