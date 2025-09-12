"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Kategorileri yükle
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      console.log("CATEGORY GET DATA: ", res);
      if (res.ok) {
        const data = await res.json();
        console.log("CATEGORY GET DATA: ", data);
        setCategories(data.categories || []);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Kategoriler yüklenemedi");
        setCategories([]);
      }
    } catch (error) {
      console.error("Kategoriler yüklenemedi:", error);
      toast.error("Kategoriler yüklenemedi");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    fetchCategories,
  };
};
