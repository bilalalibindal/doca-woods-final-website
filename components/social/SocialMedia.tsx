import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
} from "lucide-react";
import { BsTwitterX } from "react-icons/bs";

// X icon'u Twitter yerine kullan
const XIcon = Twitter;

// URL'yi temizleme fonksiyonu
const cleanUrl = (url: string | null | undefined): string | null => {
  if (!url || typeof url !== "string") return null;

  let cleanedUrl = url.trim();

  // Debug log
  console.log("Original URL:", cleanedUrl);

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

  console.log("Cleaned URL:", cleanedUrl);
  return cleanedUrl;
};

interface SocialMediaProps {
  facebookUrl?: string | null;
  xUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  githubUrl?: string | null;
  className?: string;
  variant?: "default" | "header" | "footer" | "inline";
  size?: "sm" | "md" | "lg";
}

const SocialMedia = ({
  facebookUrl,
  xUrl,
  instagramUrl,
  linkedinUrl,
  youtubeUrl,
  githubUrl,
  className = "",
  variant = "default",
  size = "md",
}: SocialMediaProps) => {
  // Size'lara göre icon ve spacing ayarları
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const spacingClasses = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
  };

  const iconSize = sizeClasses[size];
  const spacing = spacingClasses[size];

  // Variant'lara göre container styling
  const getVariantClasses = () => {
    switch (variant) {
      case "header":
        return "flex items-center space-x-3";
      case "footer":
        return "flex items-center justify-center space-x-6";
      case "inline":
        return `flex items-center ${spacing}`;
      default:
        return `flex items-center ${spacing}`;
    }
  };

  // Sosyal medya linklerini oluştur (temizlenmiş URL'lerle)
  const socialLinks = [
    {
      url: cleanUrl(facebookUrl),
      icon: <Facebook className={`${iconSize} text-blue-600`} />,
      label: "",
      hoverClass: "hover:text-blue-700 hover:bg-blue-50",
    },
    {
      url: cleanUrl(xUrl),
      icon: <BsTwitterX className={`${iconSize} text-gray-700`} />,
      label: "",
      hoverClass: "hover:text-gray-800 hover:bg-gray-50",
    },
    {
      url: cleanUrl(instagramUrl),
      icon: <Instagram className={`${iconSize} text-pink-600`} />,
      label: "",
      hoverClass: "hover:text-pink-700 hover:bg-pink-50",
    },
    {
      url: cleanUrl(linkedinUrl),
      icon: <Linkedin className={`${iconSize} text-blue-700`} />,
      label: "",
      hoverClass: "hover:text-blue-800 hover:bg-blue-50",
    },
    {
      url: cleanUrl(youtubeUrl),
      icon: <Youtube className={`${iconSize} text-red-600`} />,
      label: "YouTube",
      hoverClass: "hover:text-red-700 hover:bg-red-50",
    },
    {
      url: cleanUrl(githubUrl),
      icon: <Github className={`${iconSize} text-gray-800`} />,
      label: "GitHub",
      hoverClass: "hover:text-gray-900 hover:bg-gray-50",
    },
  ];

  // Sadece dolu URL'leri filtrele
  const activeSocialLinks = socialLinks.filter(
    (link) => link.url && link.url.trim() !== ""
  );

  // Eğer hiç aktif link yoksa null döndür
  if (activeSocialLinks.length === 0) {
    return null;
  }

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      {activeSocialLinks.map((link, index) => (
        <a
          key={index}
          href={link.url!}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            group flex items-center justify-center
            p-2 rounded-lg transition-all duration-200
            ${link.hoverClass}
            ${variant === "header" ? "text-gray-600 hover:text-current" : ""}
            ${variant === "footer" ? "text-gray-400 hover:text-white" : ""}
          `}
          title={link.label}
          aria-label={link.label}
        >
          {link.icon}
          {variant === "inline" && (
            <span className="ml-2 text-sm font-medium group-hover:underline">
              {link.label}
            </span>
          )}
        </a>
      ))}
    </div>
  );
};

export default SocialMedia;
