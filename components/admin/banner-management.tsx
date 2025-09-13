"use client";

import { useState, ChangeEvent } from "react";
import { CldImage } from "next-cloudinary";
import {
  TrashIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

interface BannerImage {
  id: string;
  url: string;
  order: number;
}

interface BannerManagementProps {
  banners: BannerImage[];
  onBannersChange: (newBanners: BannerImage[]) => void;
  maxBanners?: number;
}

const BannerManagement = ({
  banners,
  onBannersChange,
  maxBanners = 10,
}: BannerManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (banners.length >= maxBanners) {
      toast.warning(`En fazla ${maxBanners} banner ekleyebilirsiniz.`);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload/upload-banner", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Banner yüklenemedi.");
      }

      // Yeni banner'ı listeye ekle
      const newBanner: BannerImage = {
        id: Date.now().toString(),
        url: data.url,
        order: banners.length,
      };

      onBannersChange([...banners, newBanner]);
      toast.success("Banner başarıyla yüklendi.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
  };

  const handleRemoveBanner = (bannerId: string) => {
    const newBanners = banners
      .filter((banner) => banner.id !== bannerId)
      .map((banner, index) => ({ ...banner, order: index }));

    onBannersChange(newBanners);
    toast.success("Banner başarıyla silindi.");
  };

  const handleMoveBanner = (bannerId: string, direction: "up" | "down") => {
    const currentIndex = banners.findIndex((banner) => banner.id === bannerId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= banners.length) return;

    const newBanners = [...banners];
    // Swap elements
    [newBanners[currentIndex], newBanners[newIndex]] = [
      newBanners[newIndex],
      newBanners[currentIndex],
    ];

    // Update order values
    newBanners.forEach((banner, index) => {
      banner.order = index;
    });

    onBannersChange(newBanners);
    toast.success("Banner sırası güncellendi.");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Ana Sayfa Banner'ları (En Fazla {maxBanners} Adet)
        </label>
        <span className="text-sm text-gray-500">
          {banners.length}/{maxBanners}
        </span>
      </div>

      {/* Yüklenmiş Banner'ları Gösterme */}
      <div className="space-y-4">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Banner Görseli */}
            <div className="w-24 h-16 rounded-lg overflow-hidden border flex-shrink-0">
              <CldImage
                src={banner.url}
                width="96"
                height="64"
                alt={`Banner ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Banner Bilgileri */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                Banner {index + 1}
              </p>
              <p className="text-xs text-gray-500">Sıra: {index + 1}</p>
            </div>

            {/* Kontrol Butonları */}
            <div className="flex items-center space-x-2">
              {/* Yukarı Taşı */}
              <button
                type="button"
                onClick={() => handleMoveBanner(banner.id, "up")}
                disabled={index === 0}
                className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Yukarı taşı"
              >
                <ArrowUpIcon className="w-4 h-4" />
              </button>

              {/* Aşağı Taşı */}
              <button
                type="button"
                onClick={() => handleMoveBanner(banner.id, "down")}
                disabled={index === banners.length - 1}
                className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Aşağı taşı"
              >
                <ArrowDownIcon className="w-4 h-4" />
              </button>

              {/* Sil */}
              <button
                type="button"
                onClick={() => handleRemoveBanner(banner.id)}
                className="p-2 text-red-400 hover:text-red-600"
                title="Banner'ı sil"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Yükleniyor durumu için yer tutucu */}
        {isLoading && (
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="w-24 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
              <ArrowPathIcon className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Banner yükleniyor...</p>
            </div>
          </div>
        )}
      </div>

      {/* Dosya Seçme Input'u */}
      {banners.length < maxBanners && (
        <div>
          <input
            id="banner-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 disabled:opacity-50"
          />
          <p className="mt-2 text-xs text-gray-500">
            Önerilen boyut: 1920x600 piksel (16:9 oranı)
          </p>
        </div>
      )}

      {banners.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Henüz banner eklenmemiş.</p>
          <p className="text-sm">
            Yukarıdaki butona tıklayarak banner ekleyebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;
