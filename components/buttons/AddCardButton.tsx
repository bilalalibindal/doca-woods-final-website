"use client";

import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Product } from "@/types";
import { useCartStore } from "@/stores/cartStore"; // DEĞİŞİKLİK 1: Eski context yerine yeni Zustand store'u import ediyoruz.

interface AddCardButtonProps {
  product: Product;
  className?: string;
  fullWidth?: boolean;
}

export default function AddCardButton({
  product,
  className,
  fullWidth = false,
}: AddCardButtonProps) {
  // DEĞİŞİKLİK 2: useCart() yerine useCartStore() kullanıyoruz.
  const { addItem } = useCartStore();

  const isOutOfStock = !product.inStock || product.stockCount <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // DEĞİŞİKLİK 3: Yeni addItem fonksiyonumuz doğrudan tüm 'product' objesini kabul ediyor.
    // Bu, kodumuzu daha temiz ve basit hale getirir.
    addItem(product);
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isOutOfStock
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-amber-600 hover:bg-amber-700 text-white focus-visible:ring-amber-600"
      } ${fullWidth ? "w-full" : ""} ${className ?? ""}`}
      aria-label={isOutOfStock ? "Tükendi" : "Sepete Ekle"}
    >
      <ShoppingCartIcon className="h-5 w-5" />
      {isOutOfStock ? "Tükendi" : "Sepete Ekle"}
    </button>
  );
}
