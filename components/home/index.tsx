"use client";

import React, { useEffect } from "react";
import MainHeader from "@/components/header/MainHeader";
import { getSettings } from "@/lib/services";
import { HomeSkeleton } from "@/components/ui/loading";
import { TreePine, ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import SocialMedia from "@/components/social/SocialMedia";
import Image from "next/image";

// Ana sayfa içeriğini getiren client component
function HomeContent() {
  const [settings, setSettings] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Settings yüklenirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Smooth scroll for contact section
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#contact") {
      const element = document.getElementById("contact");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [settings]);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Ayarlar yüklenemedi.</p>
      </div>
    );
  }

  return (
    <>
      <MainHeader />

      {/* Basit Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Logo/Icon */}
            <div className="mb-2 flex justify-center">
              <Image src="/logo.png" alt="Logo" width={200} height={200} />
            </div>

            {/* Başlık */}
            {settings.siteTitle && (
              <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
                {settings.siteTitle}
              </h1>
            )}

            {/* Kısa açıklama */}
            {settings.welcomeText && (
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {settings.welcomeText}
              </p>
            )}

            {/* Basit CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <a
                href="/urunler"
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-lg rounded-lg shadow-lg transition-all duration-300"
              >
                Ürünlerimizi İnceleyin
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* İletişim ve Sosyal Medya Section - Settings'e göre */}
      {(settings.contactPhone ||
        settings.contactEmail ||
        settings.contactAddress ||
        settings.facebookUrl ||
        settings.instagramUrl ||
        settings.xUrl ||
        settings.linkedinUrl) && (
        <section
          id="contact"
          className="py-20 bg-gradient-to-br from-gray-50 to-amber-50"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Bizimle İletişime Geçin
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Sorularınız için bize ulaşın, sosyal medya hesaplarımızda bizi
                takip edin
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* İletişim Bilgileri */}
              {(settings.contactPhone ||
                settings.contactEmail ||
                settings.contactAddress) && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center lg:text-left">
                    İletişim Bilgileri
                  </h3>
                  <div className="space-y-4">
                    {settings.contactPhone && (
                      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            Telefon
                          </div>
                          <div className="text-gray-600">
                            {settings.contactPhone}
                          </div>
                        </div>
                      </div>
                    )}

                    {settings.contactEmail && (
                      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            E-posta
                          </div>
                          <div className="text-gray-600">
                            {settings.contactEmail}
                          </div>
                        </div>
                      </div>
                    )}

                    {settings.contactAddress && (
                      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            Adres
                          </div>
                          <div className="text-gray-600">
                            {settings.contactAddress}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sosyal Medya */}
              {(settings.facebookUrl ||
                settings.instagramUrl ||
                settings.xUrl ||
                settings.linkedinUrl) && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center lg:text-left">
                    Sosyal Medya
                  </h3>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-gray-600 mb-6 text-center lg:text-left">
                      Bizi sosyal medya hesaplarımızda takip ederek yeni
                      ürünlerimizden haberdar olun
                    </p>
                    <SocialMedia
                      facebookUrl={settings.facebookUrl}
                      xUrl={settings.xUrl}
                      instagramUrl={settings.instagramUrl}
                      linkedinUrl={settings.linkedinUrl}
                      variant="inline"
                      size="lg"
                      className="justify-center lg:justify-start"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer - Settings'e göre */}
      {settings.footerText && (
        <section className="py-12 bg-black text-white">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <p className="text-lg font-medium">{settings.footerText}</p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

const Home = () => {
  return <HomeContent />;
};

export default Home;
