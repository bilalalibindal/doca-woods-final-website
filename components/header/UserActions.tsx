"use client";

import Link from "next/link";
import { HiShoppingCart, HiUser, HiBars3 } from "react-icons/hi2";
import { useCartStore } from "@/stores/cartStore"; // DEĞİŞİKLİK 1: Eski context yerine yeni Zustand store'u import ediyoruz.

interface UserActionsProps {
  onMenuToggle: () => void;
}

const UserActions = ({ onMenuToggle }: UserActionsProps) => {
  // DEĞİŞİKLİK 2: useCart() yerine useCartStore() kullanıyoruz.
  // Sadece 'totalItems' state'ine abone oluyoruz. Bu, gereksiz render'ları önler.
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <div className="flex items-center space-x-4">
      {/* Cart */}
      <Link
        href="/sepet"
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors group"
      >
        <HiShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
            {totalItems}
          </span>
        )}
      </Link>

      {/* User Account */}
      <Link
        href="/hesabim"
        className="p-2 text-gray-600 hover:text-amber-600 transition-colors"
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
