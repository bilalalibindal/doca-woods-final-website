import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
  Img,
  Link,
} from "@react-email/components";

// Ana email container bileşeni
interface EmailLayoutProps {
  children: React.ReactNode;
  title: string;
}

function EmailLayout({ children, title }: EmailLayoutProps) {
  return (
    <Html lang="tr">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f6f6f6",
          margin: 0,
          padding: "20px",
          color: "#333",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <Section
            style={{
              background: "linear-gradient(135deg, #8B4513, #D2691E)",
              padding: "30px 20px",
              textAlign: "center",
            }}
          >
            <Img
              src="https://res.cloudinary.com/dwahclxhr/image/upload/v1757245529/logo-2_ghgj0j.png"
              alt="Doca Woods Logo"
              style={{ margin: "0 auto", maxWidth: "150px" }}
            />
            <Heading
              style={{
                color: "#ffffff",
                fontSize: "24px",
                margin: "10px 0 0 0",
                fontWeight: "bold",
              }}
            >
              Doca Woods
            </Heading>
          </Section>

          {/* Content */}
          <Section style={{ padding: "30px 20px" }}>{children}</Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: "#f8f8f8",
              padding: "20px",
              textAlign: "center",
              borderTop: "1px solid #eee",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#666", margin: "0" }}>
              Bu e-posta Doca Woods tarafından gönderilmiştir.
            </Text>
            <Text
              style={{ fontSize: "12px", color: "#999", margin: "5px 0 0 0" }}
            >
              Sorularınız için{" "}
              <Link
                href="mailto:info@docawoods.com"
                style={{ color: "#8B4513" }}
              >
                info@docawoods.com
              </Link>{" "}
              adresinden bize ulaşabilirsiniz.
            </Text>
            <Text
              style={{ fontSize: "12px", color: "#999", margin: "5px 0 0 0" }}
            >
              © 2024 Doca Woods. Tüm hakları saklıdır.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Hoşgeldin Email Template
export function WelcomeEmail({ userName }: { userName: string }) {
  return (
    <EmailLayout title="Doca Woods'a Hoşgeldiniz">
      <Heading
        style={{ color: "#8B4513", fontSize: "28px", marginBottom: "20px" }}
      >
        Hoşgeldiniz, {userName}!
      </Heading>

      <Text
        style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}
      >
        Doca Woods'a hoşgeldiniz! Hesabınız başarıyla oluşturuldu ve artık
        platformumuzda alışveriş yapmaya başlayabilirsiniz.
      </Text>

      <Text
        style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "25px" }}
      >
        Kaliteli ahşap ürünlerimizi keşfetmek ve sipariş vermek için hemen
        mağazamıza göz atın.
      </Text>

      <Section style={{ textAlign: "center", margin: "30px 0" }}>
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL}/urunler`}
          style={{
            backgroundColor: "#8B4513",
            color: "#ffffff",
            padding: "12px 30px",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          Ürünlerimizi Keşfedin
        </Button>
      </Section>

      <Text style={{ fontSize: "14px", color: "#666", lineHeight: "1.5" }}>
        İlerleyen zamanlarda size özel indirimler ve yeni ürün duyuruları
        göndereceğiz. Keyifli alışverişler dileriz!
      </Text>
    </EmailLayout>
  );
}

// Sipariş Beklemede Email Template
export function OrderPendingEmail({
  userName,
  orderId,
  orderItems,
}: {
  userName: string;
  orderId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
    sku?: string;
  }>;
}) {
  const totalPrice = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <EmailLayout title="Siparişiniz Onay Sürecinde">
      <Heading
        style={{ color: "#8B4513", fontSize: "28px", marginBottom: "20px" }}
      >
        Siparişiniz Onay Sürecinde
      </Heading>

      <Text
        style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}
      >
        Merhaba {userName}, siparişiniz başarıyla alındı ve şu anda onay
        sürecinde.
      </Text>

      <OrderItemsTable orderId={orderId} orderItems={orderItems} />

      <Text
        style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}
      >
        Siparişiniz onaylandıktan sonra size bilgi vereceğiz. Sipariş durumunuzu
        hesabınızdan takip edebilirsiniz.
      </Text>

      <Section style={{ textAlign: "center", margin: "30px 0" }}>
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/profil`}
          style={{
            backgroundColor: "#8B4513",
            color: "#ffffff",
            padding: "12px 30px",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          Siparişimi Takip Et
        </Button>
      </Section>
    </EmailLayout>
  );
}

// Sipariş Onaylandı Email Template
export function OrderApprovedEmail({
  userName,
  orderId,
  orderItems,
}: {
  userName: string;
  orderId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
    sku?: string;
  }>;
}) {
  return (
    <EmailLayout title="Siparişiniz Onaylandı">
      <Heading
        style={{ color: "#8B4513", fontSize: "28px", marginBottom: "20px" }}
      >
        ✅ Siparişiniz Onaylandı!
      </Heading>

      <Text
        style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}
      >
        Merhaba {userName}, siparişiniz başarıyla onaylandı!
      </Text>

      <Section
        style={{
          backgroundColor: "#e8f5e8",
          padding: "20px",
          borderRadius: "6px",
          margin: "20px 0",
          border: "1px solid #4caf50",
        }}
      >
        <Text style={{ fontSize: "14px", color: "#2e7d32" }}>
          Siparişiniz en kısa sürede hazırlanmaya başlayacak.
        </Text>
        <OrderItemsTable orderId={orderId} orderItems={orderItems} />
      </Section>

      <Text
        style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}
      >
        Siparişinizin hazırlanması ve kargoya verilmesi için çalışmalarımıza
        başladık. Her aşamada sizi bilgilendireceğiz.
      </Text>

      <Section style={{ textAlign: "center", margin: "30px 0" }}>
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/profil`}
          style={{
            backgroundColor: "#4caf50",
            color: "#ffffff",
            padding: "12px 30px",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          Sipariş Durumunu Görüntüle
        </Button>
      </Section>
    </EmailLayout>
  );
}

// Sipariş Hazırlanıyor Email Template
export function OrderPreparingEmail({
  userName,
  orderId,
  orderItems,
}: {
  userName: string;
  orderId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
    sku?: string;
  }>;
}) {
  return (
    <EmailLayout title="Siparişiniz Hazırlanıyor">
      <Heading
        style={{
          // Changed from brown to a dark green
          color: "#2E7D32",
          fontSize: "28px",
          marginBottom: "20px",
        }}
      >
        📦 Siparişiniz Hazırlanıyor
      </Heading>

      <Text
        style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}
      >
        Merhaba {userName}, siparişiniz şu anda hazırlanıyor.
      </Text>

      <Section
        style={{
          // Changed from light orange to a light green
          backgroundColor: "#E8F5E9",
          padding: "20px",
          borderRadius: "6px",
          margin: "20px 0",
          // Corrected and updated the border color to a complementary green
          border: "1px solid #66BB6A",
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            // Changed from orange text to a deep green for better contrast
            color: "#1B5E20",
          }}
        >
          Ürünleriniz özenle hazırlanıyor ve en kısa sürede kargoya verilecek.
        </Text>
      </Section>
      <OrderItemsTable orderId={orderId} orderItems={orderItems} />
      <Text
        style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}
      >
        Siparişiniz hazırlandıktan sonra kargoya verildiğinde sizi
        bilgilendireceğiz.
      </Text>

      <Section style={{ textAlign: "center", margin: "30px 0" }}>
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/profil`}
          style={{
            // Changed the button color from orange to a vibrant green
            backgroundColor: "#4CAF50",
            color: "#ffffff",
            padding: "12px 30px",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          Hazırlık Durumunu Takip Et
        </Button>
      </Section>
    </EmailLayout>
  );
}

// Sipariş Kargoda Email Template
export function OrderShippedEmail({
  userName,
  orderId,
  shippingTrackingUrl,
  orderItems,
}: {
  userName: string;
  orderId: string;
  shippingTrackingUrl?: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
    sku?: string;
  }>;
}) {
  return (
    <EmailLayout title="Siparişiniz Kargoda">
      <Heading
        style={{ color: "#8B4513", fontSize: "28px", marginBottom: "20px" }}
      >
        🚚 Siparişiniz Kargoya Verildi!
      </Heading>

      <Text
        style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}
      >
        Merhaba {userName}, siparişiniz başarıyla kargoya verildi.
      </Text>

      <Section
        style={{
          backgroundColor: "#e3f2fd",
          padding: "20px",
          borderRadius: "6px",
          margin: "20px 0",
          border: "1px solid #2196f3",
        }}
      >
        {shippingTrackingUrl && (
          <Text
            style={{ fontSize: "14px", color: "#0d47a1", marginBottom: "10px" }}
          >
            Kargo Takip Url'si: {shippingTrackingUrl}
          </Text>
        )}
        <Text style={{ fontSize: "14px", color: "#0d47a1" }}>
          Siparişiniz kargo firması tarafından teslim alınmıştır.
        </Text>
      </Section>

      <Text
        style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}
      >
        Kargonuzun hareketlerini takip etmek için aşağıdaki butona
        tıklayabilirsiniz.
      </Text>

      <Section style={{ textAlign: "center", margin: "30px 0" }}>
        <Button
          href={`${shippingTrackingUrl}`}
          style={{
            backgroundColor: "#2196f3",
            color: "#ffffff",
            padding: "12px 30px",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          Kargo Durumunu Takip Et
        </Button>
      </Section>
      <OrderItemsTable orderId={orderId} orderItems={orderItems} />
    </EmailLayout>
  );
}

// Sipariş Teslim Edildi Email Template
export function OrderDeliveredEmail({
  userName,
  orderId,
  orderItems,
}: {
  userName: string;
  orderId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
    sku?: string;
  }>;
}) {
  return (
    <EmailLayout title="Siparişiniz Teslim Edildi">
      <Heading
        style={{ color: "#8B4513", fontSize: "28px", marginBottom: "20px" }}
      >
        🎉 Siparişiniz Başarıyla Teslim Edildi!
      </Heading>

      <Text
        style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}
      >
        Merhaba {userName}, siparişiniz başarıyla teslim edildi.
      </Text>

      <Section
        style={{
          backgroundColor: "#e8f5e8",
          padding: "20px",
          borderRadius: "6px",
          margin: "20px 0",
          border: "1px solid #4caf50",
        }}
      >
        <Text style={{ fontSize: "14px", color: "#2e7d32" }}>
          ✅ Siparişiniz başarıyla teslim edilmiştir.
        </Text>
      </Section>

      <Text
        style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}
      >
        Siparişinizle ilgili memnuniyetiniz bizim için çok önemlidir. Herhangi
        bir sorunuz olursa lütfen bizimle iletişime geçin.
      </Text>

      <Section style={{ textAlign: "center", margin: "30px 0" }}>
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/urunler`}
          style={{
            backgroundColor: "#4caf50",
            color: "#ffffff",
            padding: "12px 30px",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          Yeni Ürünleri Keşfedin
        </Button>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          color: "#666",
          lineHeight: "1.5",
          textAlign: "center",
        }}
      >
        Bize güvendiğiniz için teşekkür ederiz! ✨
      </Text>
      <OrderItemsTable orderId={orderId} orderItems={orderItems} />
    </EmailLayout>
  );
}

// Sipariş İptal Edildi Email Template
export function OrderCancelledEmail({
  userName,
  orderId,
  reason,
  orderItems,
}: {
  userName: string;
  orderId: string;
  reason?: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
    sku?: string;
  }>;
}) {
  return (
    <EmailLayout title="Siparişiniz İptal Edildi">
      <Heading
        style={{ color: "#8B4513", fontSize: "28px", marginBottom: "20px" }}
      >
        ❌ Siparişiniz İptal Edildi
      </Heading>

      <Text
        style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}
      >
        Merhaba {userName}, siparişiniz iptal edilmiştir.
      </Text>

      <Section
        style={{
          backgroundColor: "#ffebee",
          padding: "20px",
          borderRadius: "6px",
          margin: "20px 0",
          border: "1px solid #f44336",
        }}
      >
        {reason && (
          <Text
            style={{ fontSize: "14px", color: "#c62828", marginBottom: "10px" }}
          >
            İptal Nedeni: {reason}
          </Text>
        )}
        <Text style={{ fontSize: "14px", color: "#c62828" }}>
          Siparişiniz iptal edilmiştir. Eğer bir yanlışlık olduğunu
          düşünüyorsanız lütfen bizimle iletişime geçin.
        </Text>
      </Section>

      <Text
        style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}
      >
        Başka bir sipariş vermek isterseniz mağazamıza göz atabilirsiniz.
      </Text>

      <Section style={{ textAlign: "center", margin: "30px 0" }}>
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/urunler`}
          style={{
            backgroundColor: "#8B4513",
            color: "#ffffff",
            padding: "12px 30px",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          Ürünlerimizi İnceleyin
        </Button>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          color: "#666",
          lineHeight: "1.5",
          textAlign: "center",
        }}
      >
        Herhangi bir sorunuz için bizimle iletişime geçebilirsiniz.
      </Text>
      <OrderItemsTable orderId={orderId} orderItems={orderItems} />
    </EmailLayout>
  );
}

function OrderItemsTable({
  orderId,
  orderItems,
}: {
  orderId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
    sku?: string;
  }>;
}) {
  const totalPrice = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return (
    <>
      <Section
        style={{
          backgroundColor: "#f8f8f8",
          padding: "20px",
          borderRadius: "6px",
          margin: "20px 0",
        }}
      >
        <Text
          style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}
        >
          Sipariş Numarası: #{orderId.slice(-8)}
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "15px" }}>
          Sipariş Özeti:
        </Text>
        {orderItems.map((item, index) => (
          <Section
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px 0",
              padding: "10px",
              backgroundColor: "#f9f9f9",
              borderRadius: "4px",
              border: "1px solid #e0e0e0",
            }}
          >
            {item.image && (
              <Img
                src={item.image}
                alt={item.name}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginRight: "15px",
                  border: "1px solid #ddd",
                }}
                onError={(e: any) => {
                  // Fallback to a placeholder if image fails to load
                  e.target.src =
                    "https://via.placeholder.com/50x50/8B4513/FFFFFF?text=Ürün";
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  margin: "0 0 5px 0",
                  color: "#333",
                }}
              >
                {item.name}
              </Text>
              {item.sku && (
                <Text
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    margin: "0 0 5px 0",
                  }}
                >
                  SKU: {item.sku}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "12px",
                  color: "#666",
                  margin: "0",
                }}
              >
                Adet: {item.quantity} | Birim Fiyat:{" "}
                {item.price.toLocaleString("tr-TR")} ₺
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#8B4513",
                  margin: "5px 0 0 0",
                }}
              >
                Toplam: {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
              </Text>
            </div>
            <Hr style={{ margin: "15px 0", borderColor: "#ddd" }} />
          </Section>
        ))}
        <Text style={{ fontSize: "16px", fontWeight: "bold" }}>
          Toplam: {totalPrice.toLocaleString("tr-TR")} ₺
        </Text>
      </Section>
    </>
  );
}
