"use client";

import React, { useEffect, useState } from "react";
import { categoryStore } from "@/stores/categoryStore";
import { ICategory } from "@/types/categoryTypes";

interface ProductFilterProps {
  selectedCategoryIds: string[];
  onChange: (ids: string[]) => void;
}

export default function ProductFilter({
  selectedCategoryIds,
  onChange,
}: ProductFilterProps) {
  const { categories, isLoading, error, getAllCategories } = categoryStore();
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  const toggleCategory = (id: string) => {
    const exists = selectedCategoryIds.includes(id);
    if (exists) {
      onChange(selectedCategoryIds.filter((c) => c !== id));
    } else {
      onChange([...selectedCategoryIds, id]);
    }
  };

  return (
    <aside className="rounded-xl border border-amber-200/50 bg-amber-50/50 p-4 shadow-sm">
      <button
        type="button"
        className="mb-3 w-full text-left text-sm font-semibold text-amber-900"
        onClick={() => setExpanded((p) => !p)}
      >
        Filtreler
      </button>

      {expanded && (
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-amber-800">
              Kategoriler
            </div>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 animate-pulse rounded bg-amber-100"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                Kategoriler alınamadı.
              </div>
            ) : categories.length === 0 ? (
              <div className="text-sm text-amber-800">Kategori bulunamadı.</div>
            ) : (
              <ul className="space-y-2">
                {categories.map((cat: ICategory) => {
                  const checked = selectedCategoryIds.includes(cat._id);
                  return (
                    <li key={cat._id} className="flex items-center gap-2">
                      <input
                        id={`cat-${cat._id}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-600"
                        checked={checked}
                        onChange={() => toggleCategory(cat._id)}
                      />
                      <label
                        htmlFor={`cat-${cat._id}`}
                        className="text-sm text-amber-950"
                      >
                        {cat.name}
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
