"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProductPaginationProps) {
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const goTo = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => goTo(currentPage - 1)}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-gray-700 transition ${
          canPrev
            ? "border-gray-300 bg-white hover:bg-gray-50"
            : "border-gray-200 bg-gray-100 cursor-not-allowed"
        }`}
        aria-label="Önceki sayfa"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <div className="select-none text-sm text-gray-700">
        Sayfa {currentPage} / {totalPages}
      </div>

      <button
        type="button"
        disabled={!canNext}
        onClick={() => goTo(currentPage + 1)}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-gray-700 transition ${
          canNext
            ? "border-gray-300 bg-white hover:bg-gray-50"
            : "border-gray-200 bg-gray-100 cursor-not-allowed"
        }`}
        aria-label="Sonraki sayfa"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
