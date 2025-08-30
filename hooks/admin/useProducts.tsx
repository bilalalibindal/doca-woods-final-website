"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  images: string[];
  price: number;
  inStock: boolean;
  stockCount: number;
  material: string;
  color: string;
  size?: string;
  weight?: string;
  sku: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [isLoading, setIsLoading] = useState(false);

  // Ürünleri yükle
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Ürünler yüklenemedi");
        setProducts([]);
      }
    } catch (error) {
      console.error("Ürünler yüklenemedi:", error);
      toast.error("Ürünler yüklenemedi");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Ürün sil
  const deleteProduct = async (productId: string) => {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      return false;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Ürün başarıyla silindi");
        await fetchProducts(); // Ürünleri yeniden yükle
        return true;
      } else {
        toast.error(data.message || "Ürün silinirken hata oluştu");
        return false;
      }
    } catch (error) {
      console.error("Ürün silme hatası:", error);
      toast.error("Ürün silinirken hata oluştu");
      return false;
    }
  };

  // Filtreleme
  useEffect(() => {
    let result = products;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.material.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "Tümü") {
      result = result.filter(
        (product) => product.category.name === selectedCategory
      );
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory]);

  // İlk yükleme
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    fetchProducts,
    deleteProduct,
  };
};
