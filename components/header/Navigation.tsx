import Link from "next/link";

interface NavigationProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

const Navigation = ({ isMobile = false, onLinkClick }: NavigationProps) => {
  const navItems = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/urunler", label: "Ürünler" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
  ];

  const baseClasses =
    "text-gray-700 hover:text-amber-600 transition-colors font-medium";
  const mobileClasses = `${baseClasses} py-2`;
  const desktopClasses = baseClasses;

  if (isMobile) {
    return (
      <nav className="container mx-auto px-4 py-4">
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={mobileClasses}
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
        <Link key={item.href} href={item.href} className={desktopClasses}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
