import { create } from "zustand";
import { ICategory } from "@/types/categoryTypes";
import { mockCategories } from "./mockData";
import { toast } from "react-toastify";

interface CategoryState {
  categories: ICategory[];
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
      const categories: ICategory[] = Array.isArray(data) ? data : [];
      set({ categories, isLoading: false, error: null });
    } catch (error) {
      toast.error("Kategoriler alınamadı, mockCategories gösteriliyor");
      set({ categories: mockCategories, isLoading: false, error: null });
    }
  },
}));
