"use client";

import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { IProduct } from "@/types/productTypes";
import { useCart } from "@/contexts/CartContext";

interface AddCardButtonProps {
  product: IProduct;
  className?: string;
  fullWidth?: boolean;
}

export default function AddCardButton({
  product,
  className,
  fullWidth = false,
}: AddCardButtonProps) {
  const { addItem } = useCart();

  const isOutOfStock = !product.inStock || product.stockCount <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      stockCount: product.stockCount,
    });
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
