import { create } from "zustand";
import { Category } from "@/types";
import { mockCategories } from "./mockData";
import { toast } from "sonner";

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  getAllCategories: () => Promise<void>;
}

export const categoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  getAllCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) {
        toast.error("Kategoriler alınamadı, mockCategories gösteriliyor");
        set({ categories: mockCategories, isLoading: false, error: null });
        return;
      }
      const data = await res.json();
      const categories: Category[] = Array.isArray(data) ? data : [];
      set({ categories, isLoading: false, error: null });
    } catch (error) {
      toast.error("Kategoriler alınamadı, mockCategories gösteriliyor");
      set({ categories: mockCategories, isLoading: false, error: null });
    }
  },
}));
