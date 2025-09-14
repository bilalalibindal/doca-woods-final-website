"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HiShoppingCart, HiUser, HiBars3 } from "react-icons/hi2";
import { useCartStore } from "@/stores/cartStore"; // DEĞİŞİKLİK 1: Eski context yerine yeni Zustand store'u import ediyoruz.
import SocialMedia from "@/components/social/SocialMedia";
import { getSettings } from "@/lib/services";

// URL'yi temizleme fonksiyonu
const cleanUrl = (url: string | null | undefined): string | null => {
  if (!url || typeof url !== "string") return null;

  let cleanedUrl = url.trim();

  // @ karakterini başından kaldır
  if (cleanedUrl.startsWith("@")) {
    cleanedUrl = cleanedUrl.substring(1);
  }

  // Instagram login URL'ini düzelt (next parametresini çıkar)
  if (cleanedUrl.includes("instagram.com/accounts/login")) {
    try {
      const urlObj = new URL(cleanedUrl);
      const nextParam = urlObj.searchParams.get("next");
      if (nextParam) {
        cleanedUrl = decodeURIComponent(nextParam);
      }
    } catch (e) {
      console.error("Instagram URL parsing error:", e);
    }
  }

  // Diğer sosyal medya login URL'lerini de handle et
  if (
    cleanedUrl.includes("facebook.com/login") ||
    cleanedUrl.includes("twitter.com/login") ||
    cleanedUrl.includes("linkedin.com/login")
  ) {
    try {
      const urlObj = new URL(cleanedUrl);
      const nextParam =
        urlObj.searchParams.get("next") ||
        urlObj.searchParams.get("redirect_uri") ||
        urlObj.searchParams.get("url");
      if (nextParam) {
        cleanedUrl = decodeURIComponent(nextParam);
      }
    } catch (e) {
      console.error("Social media URL parsing error:", e);
    }
  }

  // Eğer hala login URL'i ise, sadece domain kısmını al
  if (cleanedUrl.includes("/accounts/login") || cleanedUrl.includes("/login")) {
    try {
      const urlObj = new URL(cleanedUrl);
      cleanedUrl = `${urlObj.protocol}//${urlObj.hostname}`;
    } catch (e) {
      console.error("URL parsing error:", e);
    }
  }

  // Eğer URL http/https ile başlamıyorsa, https:// ekle
  if (!cleanedUrl.startsWith("http://") && !cleanedUrl.startsWith("https://")) {
    cleanedUrl = "https://" + cleanedUrl;
  }

  return cleanedUrl;
};

interface UserActionsProps {
  onMenuToggle: () => void;
}

interface Settings {
  facebookUrl?: string | null;
  xUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
}

const UserActions = ({ onMenuToggle }: UserActionsProps) => {
  // DEĞİŞİKLİK 2: useCart() yerine useCartStore() kullanıyoruz.
  // Sadece 'totalItems' state'ine abone oluyoruz. Bu, gereksiz render'ları önler.
  const totalItems = useCartStore((state) => state.totalItems);
  const pathname = usePathname();

  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Settings yüklenirken hata:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="flex items-center space-x-4">
      {/* Social Media - Desktop */}
      <div className="hidden lg:block">
        <SocialMedia
          facebookUrl={cleanUrl(settings?.facebookUrl)}
          xUrl={cleanUrl(settings?.xUrl)}
          instagramUrl={cleanUrl(settings?.instagramUrl)}
          linkedinUrl={cleanUrl(settings?.linkedinUrl)}
          variant="header"
          size="sm"
        />
      </div>

      {/* Cart */}
      <Link
        href="/sepet"
        className={`relative p-2 transition-colors group ${
          pathname === "/sepet"
            ? "text-blue-600 bg-blue-50 rounded-lg"
            : "text-gray-600 hover:text-blue-600"
        }`}
      >
        <HiShoppingCart
          className={`w-6 h-6 transition-transform ${
            pathname === "/sepet" ? "scale-110" : "group-hover:scale-110"
          }`}
        />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
            {totalItems}
          </span>
        )}
      </Link>

      {/* User Account */}
      <Link
        href="/profil"
        className={`p-2 transition-colors ${
          pathname.startsWith("/profil")
            ? "text-amber-600 bg-amber-50 rounded-lg"
            : "text-gray-600 hover:text-amber-600"
        }`}
      >
        <HiUser className="w-6 h-6" />
      </Link>

      {/* Mobile Menu Button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 text-gray-600 hover:text-amber-600 transition-colors"
      >
        <HiBars3 className="w-6 h-6" />
      </button>
    </div>
  );
};

export default UserActions;
