"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // DEĞİŞİKLİK 1: next/image import edildi
import {
  CheckCircleIcon,
  TagIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  EyeIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import { IProduct } from "@/types/productTypes";
import AddCardButton from "@/components/buttons/AddCardButton";

interface ProductCardProps {
  product: IProduct;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function ProductCard({ product }: ProductCardProps) {
  const outOfStock = !product.inStock || product.stockCount <= 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const images = Array.isArray(product.images) ? product.images : [];
  const currentImage = images[currentImageIndex] ?? images[0];

  const handleImageNavigation = (direction: "prev" | "next") => {
    if (images.length <= 1) return;
    if (direction === "prev") {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-amber-200/60 bg-white shadow-lg transition-all hover:shadow-amber-200/50">
      <div className="relative aspect-square overflow-hidden bg-amber-50/60">
        {currentImage ? (
          // DEĞİŞİKLİK 2: Standart <img> etiketi, Next.js <Image> component'i ile değiştirildi
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="h-full w-full cursor-pointer object-cover transition-transform duration-700 group-hover:scale-105"
            onClick={() => setIsImageModalOpen(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-amber-700/60">
            Görsel Yok
          </div>
        )}
        {/* ... (diğer kısımlar aynı) ... */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsImageModalOpen(true);
            }}
            className="w-10 h-10 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <EyeIcon className="w-5 h-5 text-amber-700" />
          </button>
        </div>

        {outOfStock ? (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-red-700/95 px-2.5 py-1 text-xs font-semibold text-white shadow">
            {" "}
            <>
              {" "}
              <XCircleIcon className="h-6 w-6 text-white" />{" "}
              <span>Tükendi</span>{" "}
            </>{" "}
          </div>
        ) : (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-green-700/95 px-2.5 py-1 text-xs font-semibold text-white shadow">
            {" "}
            <>
              {" "}
              <CheckCircleIcon className="h-6 w-6 text-white" />{" "}
              <span>Stokta</span>{" "}
            </>{" "}
          </div>
        )}

        {images.length > 1 && (
          <>
            {" "}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleImageNavigation("prev");
              }}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              aria-label="Önceki görsel"
            >
              {" "}
              <ChevronLeftIcon className="h-4 w-4 text-amber-700" />{" "}
            </button>{" "}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleImageNavigation("next");
              }}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              aria-label="Sonraki görsel"
            >
              {" "}
              <ChevronRightIcon className="h-4 w-4 text-amber-700" />{" "}
            </button>{" "}
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            {" "}
            <div className="flex gap-1.5">
              {" "}
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`h-1.5 w-4 rounded-full transition ${
                    idx === currentImageIndex
                      ? "bg-amber-600"
                      : "bg-white/70 hover:bg-white"
                  }`}
                  aria-label={`Görsel ${idx + 1}`}
                />
              ))}{" "}
            </div>{" "}
          </div>
        )}
      </div>

      {/* ... (diğer kısımlar aynı) ... */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/urunler/${product._id}`}
              className="hover:text-amber-700"
            >
              <div className="inline-flex items-center gap-1 mb-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200/80 shadow-sm">
                <HashtagIcon className="h-4 w-4 shrink-0 text-white-400" />
                <span>{product.category?.name}</span>
              </div>
              <h3
                className="truncate text-sm font-semibold text-gray-900"
                title={product.name}
              >
                {product.name}
              </h3>
            </Link>
          </div>
        </div>
        <p className="mb-3 line-clamp-3 text-xs text-gray-600">
          {product.description}
        </p>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="rounded-md bg-amber-50 p-2">
            <div className="text-sm font-bold text-orange-800">Malzeme</div>
            <div className="text-xs text-amber-950">{product.material}</div>
          </div>
          <div className="rounded-md bg-orange-50 p-2">
            <div className="text-sm font-bold text-orange-800">Renk</div>
            <div className="text-xs text-amber-950">{product.color}</div>
          </div>
          {product.size && (
            <div className="rounded-md bg-amber-50 p-2">
              {" "}
              <div className="text-sm font-bold text-orange-800">
                {" "}
                Boyut (GxYxD){" "}
              </div>{" "}
              <div className="text-sm text-amber-950">
                {" "}
                {product.size.width} x {product.size.height} x{" "}
                {product.size.depth} cm{" "}
              </div>{" "}
            </div>
          )}
          {product.weight && (
            <div className="rounded-md bg-orange-50 p-2">
              {" "}
              <div className="text-sm font-bold text-orange-800">
                Ağırlık
              </div>{" "}
              <div className="text-sm text-amber-950">
                {" "}
                {product.weight.value} {product.weight.unit}{" "}
              </div>{" "}
            </div>
          )}
        </div>
        <div className="mt-auto flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-1.5 text-lg font-bold text-emerald-800">
            <TagIcon className="h-5 w-5" />
            <span>{formatPrice(product.price)}</span>
          </div>
          <div className="w-full max-w-[200px]">
            <AddCardButton product={product} fullWidth />
          </div>
        </div>
      </div>

      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative w-full max-w-5xl">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsImageModalOpen(false);
              }}
              className="absolute -top-12 right-0 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              aria-label="Kapat"
            >
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>

            {/* DEĞİŞİKLİK BURADA: Bu div'e bir en-boy oranı ekliyoruz */}
            <div className="relative overflow-hidden rounded-2xl bg-white p-2 shadow-2xl aspect-video">
              {currentImage && (
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="rounded-lg object-contain"
                  sizes="90vw"
                />
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageNavigation("prev");
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow hover:bg-white"
                    aria-label="Önceki görsel"
                  >
                    <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageNavigation("next");
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow hover:bg-white"
                    aria-label="Sonraki görsel"
                  >
                    <ChevronRightIcon className="h-6 w-6 text-gray-700" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
