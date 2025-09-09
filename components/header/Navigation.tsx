"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

const Navigation = ({ isMobile = false, onLinkClick }: NavigationProps) => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/urunler", label: "Ürünler" },
    { href: "/profil", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
  ];

  const baseClasses =
    "text-gray-700 hover:text-amber-600 transition-colors font-medium";
  const mobileClasses = `${baseClasses} py-2`;
  const desktopClasses = baseClasses;

  const getLinkClasses = (href: string, isMobile: boolean) => {
    const isLinkActive = isActive(href);
    if (isMobile) {
      return `${mobileClasses} ${isLinkActive ? "text-amber-600 bg-amber-50 px-3 rounded-lg" : ""}`;
    }
    return `${desktopClasses} ${isLinkActive ? "text-amber-600 border-b-2 border-amber-600" : ""}`;
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  if (isMobile) {
    return (
      <nav className="container mx-auto px-4 py-4">
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={getLinkClasses(item.href, true)}
              onClick={onLinkClick}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="hidden lg:flex items-center space-x-8">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={getLinkClasses(item.href, false)}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
