import nodemailer from "nodemailer";
import * as React from "react";
import { render } from "@react-email/components";
import {
  WelcomeEmail,
  OrderPendingEmail,
  OrderApprovedEmail,
  OrderPreparingEmail,
  OrderShippedEmail,
  OrderDeliveredEmail,
  OrderCancelledEmail,
} from "./email-templates";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // Gmail için "Uygulama Şifresi" kullandığınızdan emin olun
  },
  tls: {
    ciphers: "TLSv1.2",
    rejectUnauthorized: true,
  },
});

// Template'lere göre email içeriğini oluştur
const getEmailTemplate = (
  template: string,
  receiverName: string,
  orderId?: string,
  orderItems?: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
    sku?: string;
  }>,
  shippingTrackingUrl?: string,
  reason?: string
): React.ReactElement => {
  switch (template) {
    case "welcome":
      return React.createElement(WelcomeEmail, { userName: receiverName });

    case "orderPending":
      if (!orderId || !orderItems) {
        throw new Error("orderId ve orderItems gerekli");
      }
      return React.createElement(OrderPendingEmail, {
        userName: receiverName,
        orderId,
        orderItems,
      });

    case "orderApproved":
      if (!orderId || !orderItems) {
        throw new Error("orderId gerekli");
      }
      return React.createElement(OrderApprovedEmail, {
        userName: receiverName,
        orderId,
        orderItems,
      });

    case "orderPreparing":
      if (!orderId || !orderItems) {
        throw new Error("orderId gerekli");
      }
      return React.createElement(OrderPreparingEmail, {
        userName: receiverName,
        orderId,
        orderItems,
      });

    case "orderShipped":
      if (!orderId || !orderItems) {
        throw new Error("orderId gerekli");
      }
      return React.createElement(OrderShippedEmail, {
        userName: receiverName,
        orderId,
        shippingTrackingUrl,
        orderItems,
      });

    case "orderDelivered":
      if (!orderId || !orderItems) {
        throw new Error("orderId gerekli");
      }
      return React.createElement(OrderDeliveredEmail, {
        userName: receiverName,
        orderId,
        orderItems,
      });

    case "orderCancelled":
      if (!orderId || !orderItems) {
        throw new Error("orderId gerekli");
      }
      return React.createElement(OrderCancelledEmail, {
        userName: receiverName,
        orderId,
        reason,
        orderItems,
      });

    default:
      throw new Error(`Geçersiz template: ${template}`);
  }
};

// Ana email gönderme fonksiyonu
export const sendMail = async (
  receiverEmail: string,
  receiverName: string,
  subject:
    | "Hoşgeldiniz"
    | "Siparişiniz Onay Sürecinde"
    | "Siparişiniz Onaylandı"
    | "Siparişiniz Hazırlanıyor"
    | "Siparişiniz Kargoda"
    | "Siparişiniz Teslim Edildi"
    | "Siparişiniz İptal Edildi",
  template:
    | "welcome"
    | "orderPending"
    | "orderApproved"
    | "orderPreparing"
    | "orderShipped"
    | "orderDelivered"
    | "orderCancelled",
  options?: {
    orderId?: string;
    orderItems?: Array<{
      name: string;
      quantity: number;
      price: number;
      image?: string;
      sku?: string;
    }>;
    shippingTrackingUrl?: string;
    reason?: string;
  }
): Promise<boolean> => {
  try {
    // Gerekli alanların kontrolü
    if (!receiverEmail || !subject || !template || !receiverName) {
      throw new Error(
        "Alıcı email, konu, template ve alıcı adı alanları zorunludur"
      );
    }

    // Template'e göre email içeriğini oluştur
    const emailComponent = getEmailTemplate(
      template,
      receiverName,
      options?.orderId,
      options?.orderItems,
      options?.shippingTrackingUrl,
      options?.reason
    );

    // React component'ini HTML'e dönüştür
    const emailHtml = await render(emailComponent);

    // Email gönderme ayarları
    const mailOptions = {
      from: `"Doca Woods" <${process.env.EMAIL}>`,
      to: receiverEmail,
      subject: `Doca Woods - ${subject}`,
      html: emailHtml,
      // Text versiyonu da ekleyebiliriz
      text: getPlainTextVersion(subject, receiverName, template, options),
    };

    // Email'i gönder
    const info = await transporter.sendMail(mailOptions);

    console.log("Email gönderildi:", {
      to: receiverEmail,
      subject: mailOptions.subject,
      messageId: (info as any).messageId,
    });

    return true;
  } catch (error) {
    console.error("Email gönderme hatası:", error);
    throw new Error(
      `Email gönderilemedi: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`
    );
  }
};

// Plain text versiyonu (HTML desteklemeyen email client'lar için)
const getPlainTextVersion = (
  subject: string,
  receiverName: string,
  template: string,
  options?: any
): string => {
  const baseText = `Merhaba ${receiverName},\n\n`;

  switch (template) {
    case "welcome":
      return `${baseText}Doca Woods ailesine katıldığınız için teşekkür ederiz! Hesabınız başarıyla oluşturuldu ve artık platformumuzda alışveriş yapmaya başlayabilirsiniz.\n\nÜrünlerimizi keşfetmek için: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/urunler\n\nKeyifli alışverişler dileriz!`;

    case "orderPending":
      return `${baseText}Siparişiniz başarıyla alındı ve onay sürecinde.\n\nSipariş Numaranız: #${options?.orderId?.slice(-10)}\n\nSipariş durumunuzu takip etmek için: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/profil`;

    case "orderApproved":
      return `${baseText}Siparişiniz başarıyla onaylandı!\n\nSipariş Numaranız: #${options?.orderId?.slice(-10)}\n\nSiparişiniz en kısa sürede hazırlanmaya başlayacak.`;

    case "orderPreparing":
      return `${baseText}Siparişiniz hazırlanıyor.\n\nSipariş Numaranız: #${options?.orderId?.slice(-10)}\n\nÜrünleriniz dikkatlice paketleniyor.`;

    case "orderShipped":
      const trackingText = options?.trackingNumber
        ? `\nTakip Numarası: ${options.trackingNumber}`
        : "";
      return `${baseText}Siparişiniz kargoya verildi!${trackingText}\n\nSipariş Numaranız: #${options?.orderId?.slice(-10)}`;

    case "orderDelivered":
      return `${baseText}Siparişiniz başarıyla teslim edildi!\n\nSipariş Numaranız: #${options?.orderId?.slice(-10)}\n\nBize güvendiğiniz için teşekkür ederiz!`;

    case "orderCancelled":
      const reasonText = options?.reason
        ? `\nİptal Nedeni: ${options.reason}`
        : "";
      return `${baseText}Siparişiniz iptal edilmiştir.${reasonText}\n\nSipariş Numaranız: #${options?.orderId?.slice(-10)}\n\nÖdeme yapıldıysa tutar en kısa sürede iade edilecektir.`;

    default:
      return `${baseText}${subject}`;
  }
};

// Toplu email gönderme fonksiyonu (gelecekte kullanılabilir)
export const sendBulkEmails = async (
  emails: Array<{
    receiverEmail: string;
    receiverName: string;
    subject: string;
    template: string;
    options?: {
      orderId?: string;
      orderItems?: Array<{
        name: string;
        quantity: number;
        price: number;
        image?: string;
        sku?: string;
      }>;
      trackingNumber?: string;
      reason?: string;
    };
  }>
): Promise<{ success: number; failed: number; errors: string[] }> => {
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const email of emails) {
    try {
      await sendMail(
        email.receiverEmail,
        email.receiverName,
        email.subject as any,
        email.template as any,
        email.options
      );
      success++;
    } catch (error) {
      failed++;
      errors.push(
        `${email.receiverEmail}: ${error instanceof Error ? error.message : "Hata"}`
      );
    }
  }

  return { success, failed, errors };
};
