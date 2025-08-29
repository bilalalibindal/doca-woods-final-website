import { create } from "zustand";
import { IProduct as UIProduct } from "@/types/productTypes";
import { toast } from "react-toastify";
import { mockProducts } from "./mockData";
interface ProductState {
  products: UIProduct[];
  isLoading: boolean;
  error: string | null;
  getAllProducts: () => Promise<void>;
}

export const productStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  getAllProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      // ürünleri giriş yapmadan da görüntüleyebilcekleri için public api'ye fetch atıyoruz
      const res = await fetch("/api/products");
      // api'den ürünler alınamadıysa mockData gösteriliyor
      if (!res.ok) {
        toast.error("Ürünler api'den alınamadı, mockData gösteriliyor");
        set({ products: mockProducts, isLoading: false, error: null });
        return;
      }
      // api'den ürünler alındıysa UIProduct'a dönüştürülüyor
      const data = await res.json();
      const products: UIProduct[] = Array.isArray(data.products)
        ? data.products
        : [];
      if (products.length === 0) {
        toast.error(
          "Api çalıştı ama henüz ürün bulunamadı, mockData gösteriliyor"
        );
        set({ products: mockProducts, isLoading: false, error: null });
        return;
      }
      // Ürünler başarıyla alındıysa
      set({ products, isLoading: false, error: null });
    } catch (error) {
      toast.error("Ürünler alınırken bir hata oluştu");
      set({ products: mockProducts, isLoading: false, error: error as string });
    }
  },
}));
