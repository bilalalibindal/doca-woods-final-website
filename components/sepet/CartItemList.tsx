"use client";

import { useCartStore } from "@/stores/cartStore";
import CartItem from "./CartItem"; // Daha önce güncellediğimiz "düşünmeyen" component

const CartItemList = () => {
  const { items, updateQuantity, removeItem } = useCartStore();

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item} // 'item' prop'u olarak tüm objeyi geçiyoruz
        />
      ))}
    </div>
  );
};

export default CartItemList;
