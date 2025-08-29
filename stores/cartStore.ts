import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-toastify";
import { IProduct } from "@/types/productTypes";

export interface CartItem extends IProduct {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: IProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const calculateTotals = (items: CartItem[]) => ({
  totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
});

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find((item) => item._id === product._id);
        let updatedItems = [];
        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + 1,
            product.stockCount
          );
          if (newQuantity > existingItem.quantity) {
            toast.success(`${product.name} sepete eklendi!`);
          } else {
            toast.warn(`${product.name} için maksimum stok adedine ulaşıldı.`);
          }
          updatedItems = items.map((item) =>
            item._id === product._id ? { ...item, quantity: newQuantity } : item
          );
        } else {
          updatedItems = [...items, { ...product, quantity: 1 }];
          toast.success(`${product.name} sepete eklendi!`);
        }
        set({ items: updatedItems, ...calculateTotals(updatedItems) });
      },

      removeItem: (productId) => {
        const updatedItems = get().items.filter(
          (item) => item._id !== productId
        );
        set({ items: updatedItems, ...calculateTotals(updatedItems) });
        toast.error("Ürün sepetten kaldırıldı.");
      },

      updateQuantity: (productId, quantity) => {
        const updatedItems = get()
          .items.map((item) =>
            item._id === productId
              ? {
                  ...item,
                  quantity: Math.max(0, Math.min(quantity, item.stockCount)),
                }
              : item
          )
          .filter((item) => item.quantity > 0);
        set({ items: updatedItems, ...calculateTotals(updatedItems) });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
        toast.info("Sepet temizlendi.");
      },
    }),
    {
      name: "doca-woods-cart-v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
