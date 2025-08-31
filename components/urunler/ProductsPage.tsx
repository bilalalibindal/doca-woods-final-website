"use client";

import React, { useEffect, useMemo, useState } from "react";
import ProductGrid from "@/components/urunler/ProductGrid";
import ProductSort from "@/components/urunler/ProductSort";
import ProductPagination from "@/components/urunler/ProductPagination";
import { productStore } from "@/stores/productStore";
import ProductFilter from "@/components/urunler/ProductFilter";
import { IProduct } from "@/types/productTypes";

export default function ProductsPage() {
  const { products, isLoading, error, getAllProducts } = productStore();

  const [sort, setSort] = useState<string>("new");
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 12;
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  const filteredProducts: IProduct[] = useMemo(() => {
    if (selectedCategoryIds.length === 0) return products;
    return products.filter((p) =>
      selectedCategoryIds.includes(p.category?.id ?? "")
    );
  }, [products, selectedCategoryIds]);

  const sortedProducts: IProduct[] = useMemo(() => {
    const cloned = [...filteredProducts];
    switch (sort) {
      case "price_asc":
        return cloned.sort((a, b) => a.price - b.price);
      case "price_desc":
        return cloned.sort((a, b) => b.price - a.price);
      case "name_asc":
        return cloned.sort((a, b) => a.name.localeCompare(b.name, "tr"));
      case "name_desc":
        return cloned.sort((a, b) => b.name.localeCompare(a.name, "tr"));
      default:
        return cloned;
    }
  }, [filteredProducts, sort]);

  const totalItems = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, page]);

  useEffect(() => {
    setPage(1);
  }, [sort, selectedCategoryIds]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Başlık ve Sıralama Alanı */}
      <header className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Ürünler</h1>
          <p className="mt-1 text-sm text-gray-600">
            {isLoading ? "Ürünler yükleniyor..." : `${totalItems} ürün bulundu`}
          </p>
        </div>
        <ProductSort value={sort} onChange={setSort} />
      </header>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 2. Ana İçerik Alanı (Filtre + Ürünler) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* SOL SÜTUN: Filtreler */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <ProductFilter
              selectedCategoryIds={selectedCategoryIds}
              onChange={setSelectedCategoryIds}
            />
          </div>
        </aside>

        {/* SAĞ SÜTUN: Ürün Listesi ve Sayfalama */}
        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-xl border border-amber-200/60 bg-amber-50/60"
                />
              ))}
            </div>
          ) : totalItems === 0 ? (
            <div className="rounded-lg border border-amber-200/60 bg-white p-10 text-center text-amber-900">
              Bu kriterlere uygun ürün bulunamadı.
            </div>
          ) : (
            <>
              <ProductGrid products={pagedProducts} />
              <div className="mt-8">
                <ProductPagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </section>
  );
}
