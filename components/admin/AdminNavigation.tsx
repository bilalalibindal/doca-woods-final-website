import Link from "next/link";

interface AdminNavigationProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

const AdminNavigation = ({
  isMobile = false,
  onLinkClick,
}: AdminNavigationProps) => {
  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/admin/products", label: "Ürünler" },
    { href: "/admin/orders", label: "Siparişler" },
    { href: "/admin/customers", label: "Müşteriler" },
    { href: "/admin/reports", label: "Raporlar" },
    { href: "/admin/inventory", label: "Envanter" },
    { href: "/admin/settings", label: "Ayarlar" },
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

export default AdminNavigation;
