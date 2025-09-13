"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { updateSettings } from "@/lib/admin-actions";
import { getSettings } from "@/lib/services";
import { toast } from "sonner";
import {
  Settings,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  MessageSquare,
  Home,
  FileText,
  Image,
} from "lucide-react";
import BannerManagement from "./banner-management";

// Zod validation schema
const settingsSchema = z.object({
  siteTitle: z.string().min(1, "Site başlığı zorunludur"),
  contactPhone: z.string().min(1, "Telefon numarası zorunludur"),
  contactEmail: z.string().email("Geçerli bir e-posta adresi giriniz"),
  contactAddress: z.string().min(1, "Adres zorunludur"),
  facebookUrl: z
    .string()
    .url("Geçerli bir URL giriniz")
    .optional()
    .or(z.literal("")),
  xUrl: z.string().url("Geçerli bir URL giriniz").optional().or(z.literal("")),
  instagramUrl: z
    .string()
    .url("Geçerli bir URL giriniz")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Geçerli bir URL giriniz")
    .optional()
    .or(z.literal("")),
  googleMapsUrl: z
    .string()
    .url("Geçerli bir Google Maps URL'si giriniz")
    .optional()
    .or(z.literal("")),
  orderContactInfoText: z.string().min(1, "Sipariş iletişim metni zorunludur"),
  welcomeText: z.string().min(1, "Hoşgeldiniz metni zorunludur"),
  footerText: z.string().min(1, "Footer metni zorunludur"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface BannerImage {
  id: string;
  url: string;
  order: number;
}

interface Settings {
  id: number;
  siteTitle: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  contactAddress: string | null;
  facebookUrl?: string | null;
  xUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  googleMapsUrl?: string | null;
  orderContactInfoText: string | null;
  welcomeText: string | null;
  footerText: string | null;
  bannerImages: string[];
}

interface SettingsFormProps {
  initialSettings: Settings;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>(initialSettings);

  // Banner'ları BannerImage formatına dönüştür
  const [banners, setBanners] = useState<BannerImage[]>(() => {
    const bannerImages = settings.bannerImages || [];

    // Eğer bannerImages string ise (eski yanlış format), parse et
    let processedImages = bannerImages;
    if (bannerImages.length === 1 && typeof bannerImages[0] === "string") {
      try {
        const parsed = JSON.parse(bannerImages[0]);
        if (Array.isArray(parsed)) {
          processedImages = parsed;
        }
      } catch (e) {
        // Parse edilemezse, tek string olarak kabul et
        processedImages = bannerImages;
      }
    }

    return processedImages.map((url, index) => ({
      id: `banner-${index}`,
      url,
      order: index,
    }));
  });

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteTitle: settings.siteTitle || "",
      contactPhone: settings.contactPhone || "",
      contactEmail: settings.contactEmail || "",
      contactAddress: settings.contactAddress || "",
      facebookUrl: settings.facebookUrl || "",
      xUrl: settings.xUrl || "",
      instagramUrl: settings.instagramUrl || "",
      linkedinUrl: settings.linkedinUrl || "",
      googleMapsUrl: settings.googleMapsUrl || "",
      orderContactInfoText: settings.orderContactInfoText || "",
      welcomeText: settings.welcomeText || "",
      footerText: settings.footerText || "",
    },
  });

  // Update form values when settings change
  useEffect(() => {
    form.reset({
      siteTitle: settings.siteTitle || "",
      contactPhone: settings.contactPhone || "",
      contactEmail: settings.contactEmail || "",
      contactAddress: settings.contactAddress || "",
      facebookUrl: settings.facebookUrl || "",
      xUrl: settings.xUrl || "",
      instagramUrl: settings.instagramUrl || "",
      linkedinUrl: settings.linkedinUrl || "",
      googleMapsUrl: settings.googleMapsUrl || "",
      orderContactInfoText: settings.orderContactInfoText || "",
      welcomeText: settings.welcomeText || "",
      footerText: settings.footerText || "",
    });
  }, [settings, form]);

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Banner'ları ekle - her banner URL'si ayrı bir formData entry olarak
      banners.forEach((banner) => {
        formData.append("bannerImages", banner.url);
      });

      const result = await updateSettings(formData);

      if (result.success) {
        toast.success(result.message);
        // Refresh settings
        const updatedSettings = await getSettings();
        setSettings(updatedSettings as Settings);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  // Banner değiştiğinde settings'i güncelle
  const handleBannersChange = (newBanners: BannerImage[]) => {
    setBanners(newBanners);
    setSettings((prev) => ({
      ...prev,
      bannerImages: newBanners.map((banner) => banner.url),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-amber-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Site Ayarları</h1>
          <p className="text-gray-600">
            Web sitenizin genel ayarlarını düzenleyin
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Genel Bilgiler */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Home className="w-5 h-5 text-amber-600" />
                Genel Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="siteTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Site Başlığı
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doca Woods"
                        {...field}
                        className="text-lg"
                      />
                    </FormControl>
                    <FormDescription>Web sitenizin ana başlığı</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Telefon
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+90 555 123 4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        E-posta
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="info@docawoods.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contactAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Adres
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="İstanbul, Türkiye"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="googleMapsUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Google Maps URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://maps.google.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Adresinizin Google Maps bağlantısı (isteğe bağlı)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Sosyal Medya */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                Sosyal Medya
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-blue-600" />
                        Facebook
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://facebook.com/sirketiniz"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Facebook sayfanızın URL'si (isteğe bağlı)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="xUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Twitter className="w-4 h-4 text-black" />X
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://x.com/sirketiniz"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        X hesabınızın URL'si (isteğe bağlı)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-pink-600" />
                        Instagram
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://instagram.com/sirketiniz"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Instagram hesabınızın URL'si (isteğe bağlı)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-blue-700" />
                        LinkedIn
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/company/sirketiniz"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        LinkedIn sayfanızın URL'si (isteğe bağlı)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Banner Yönetimi */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Image className="w-5 h-5 text-amber-600" />
                Ana Sayfa Banner'ları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BannerManagement
                banners={banners}
                onBannersChange={handleBannersChange}
                maxBanners={10}
              />
            </CardContent>
          </Card>

          {/* Metin İçerikler */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="w-5 h-5 text-amber-600" />
                Metin İçerikler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="welcomeText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hoşgeldiniz Metni</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Web sitenize hoşgeldiniz metni..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ana sayfada gösterilecek hoşgeldiniz metni
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderContactInfoText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sipariş İletişim Metni</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Sipariş onay metni..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Sipariş onayında gösterilecek iletişim metni
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="footerText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Footer Metni</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Footer'da gösterilecek metin..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Sayfanın alt kısmında gösterilecek metin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Kaydet Butonu */}
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? "Kaydediliyor..." : "Ayarları Kaydet"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
