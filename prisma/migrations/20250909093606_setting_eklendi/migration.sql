-- CreateTable
CREATE TABLE "public"."Settings" (
    "id" SERIAL NOT NULL,
    "siteTitle" TEXT DEFAULT 'Websitem',
    "contactPhone" TEXT DEFAULT '+90 555 123 4567',
    "contactEmail" TEXT DEFAULT 'info@example.com',
    "contactAddress" TEXT DEFAULT 'Örnek Mah. Test Sk. No:1 D:2, İstanbul',
    "facebookUrl" TEXT,
    "xUrl" TEXT,
    "instagramUrl" TEXT,
    "linkedinUrl" TEXT,
    "googleMapsUrl" TEXT,
    "orderContactInfoText" TEXT DEFAULT 'Siparişinizin Onayı için Lütfen sipariş numaranızı kopyalayıp Whatsapp üzerinden +90 555 123 4567 numarasına gönderiniz',
    "welcomeText" TEXT DEFAULT 'Ahşap Mobilya, Ahşap İşleme ve Ahşap Dekorasyon - Özel Tasarımlar ve Kalite',
    "footerText" TEXT DEFAULT 'TELİF HAKKI © 2024 DOCA WOODS - TÜM HAKLARI SAKLIDIR.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
