import React from "react";
import { Package, Palette, Ruler, Hash, ShoppingCart } from "lucide-react";

interface LoadingProps {
  message?: string;
  className?: string;
}

export function Loading({
  message = "Ürünler yükleniyor...",
  className = "",
}: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 ${className}`}
    >
      <div className="relative">
        {/* Ana spinner - ahşap temalı */}
        <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin shadow-lg"></div>

        {/* İç spinner - daha hızlı */}
        <div
          className="absolute inset-3 w-8 h-8 border-3 border-transparent border-t-orange-400 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1s" }}
        ></div>

        {/* Ahşap texture efekti */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Package className="w-6 h-6 text-amber-700 animate-pulse" />
        </div>

        {/* Kenar efektleri */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-sm"></div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          {message}
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Lütfen bekleyin, kaliteli ürünler hazırlanıyor...
        </p>

        {/* İlerleme noktaları */}
        <div className="flex items-center justify-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.15s" }}
            ></div>
            <div
              className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.3s" }}
            ></div>
          </div>
        </div>

        {/* İkon animasyonları */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <Palette className="w-5 h-5 text-amber-500 animate-pulse" />
          <Ruler
            className="w-5 h-5 text-orange-500 animate-pulse"
            style={{ animationDelay: "0.2s" }}
          />
          <Package
            className="w-5 h-5 text-amber-600 animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
          <ShoppingCart
            className="w-5 h-5 text-orange-600 animate-pulse"
            style={{ animationDelay: "0.6s" }}
          />
        </div>
      </div>
    </div>
  );
}

// Ana sayfa için basit loading skeleton
export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-6 py-12">
        {/* Ana sayfa header skeleton */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo placeholder */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-amber-200 rounded-full mx-auto animate-pulse"></div>
          </div>

          {/* Başlık skeleton */}
          <div className="space-y-4">
            <div className="h-16 bg-gradient-to-r from-gray-300 to-gray-200 rounded-xl w-3/4 mx-auto animate-pulse"></div>
            <div className="h-8 bg-gray-300 rounded-lg w-1/2 mx-auto animate-pulse"></div>
          </div>

          {/* Açıklama skeleton */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="h-6 bg-gray-300 rounded w-full animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-4/5 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 animate-pulse"></div>
          </div>

          {/* CTA buton skeleton */}
          <div className="pt-8">
            <div className="h-14 bg-amber-300 rounded-lg w-64 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Ürünler sayfası için detaylı loading skeleton
export function ProductsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 bg-gradient-to-r from-gray-300 to-gray-200 rounded-xl w-80 mx-auto mb-4 animate-pulse shadow-sm"></div>
          <div className="h-6 bg-gray-300 rounded-lg w-96 mx-auto animate-pulse"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Sol Sütun Skeleton - Kategoriler */}
          <aside className="w-full lg:w-80 lg:sticky lg:top-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-amber-100">
              <div className="h-8 bg-gradient-to-r from-amber-200 to-amber-100 rounded-lg mb-6 animate-pulse"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    <div className="w-4 h-4 bg-amber-300 rounded-full animate-pulse"></div>
                    <div className="h-5 bg-gray-300 rounded flex-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Sağ Sütun Skeleton - Ürünler */}
          <main className="flex-1">
            <div className="mb-6">
              <div className="h-9 bg-gradient-to-r from-gray-300 to-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-300 rounded w-48 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-amber-100 animate-pulse hover:shadow-2xl transition-shadow"
                >
                  {/* Resim Skeleton */}
                  <div className="relative w-full h-80 bg-gradient-to-br from-gray-300 to-gray-200">
                    {/* Stok Badge Skeleton */}
                    <div className="absolute top-4 left-4">
                      <div className="h-6 bg-green-200 rounded-full w-20 animate-pulse"></div>
                    </div>
                    {/* Fiyat Overlay Skeleton */}
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                        <div className="h-6 bg-amber-200 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                    {/* Büyütme İkonu Skeleton */}
                    <div className="absolute top-4 right-4">
                      <div className="h-10 w-10 bg-white/80 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* İçerik Skeleton */}
                  <div className="p-6 space-y-4">
                    {/* Başlık ve Açıklama */}
                    <div className="space-y-2">
                      <div className="h-7 bg-gradient-to-r from-gray-300 to-gray-200 rounded-lg w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>

                    {/* Özellikler Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-amber-200 rounded animate-pulse"></div>
                          <div className="flex-1 space-y-1">
                            <div className="h-3 bg-gray-300 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Skeleton */}
                  <div className="p-6 pt-0">
                    <div className="h-12 bg-gradient-to-r from-amber-300 to-orange-300 rounded-lg w-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Backward compatibility için LoadingSkeleton'ı ProductsSkeleton'a yönlendir
export const LoadingSkeleton = ProductsSkeleton;

// Küçük boyutlu loading component'i
export function SmallLoading({
  message = "Yükleniyor...",
  className = "",
}: LoadingProps) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-8 h-8 border-3 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
          <div
            className="absolute inset-1 w-4 h-4 border-2 border-transparent border-t-orange-400 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
          ></div>
        </div>
        <span className="text-gray-600 font-medium">{message}</span>
      </div>
    </div>
  );
}
