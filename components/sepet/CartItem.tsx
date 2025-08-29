"use client";

import Image from "next/image";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCartStore, CartItem as CartItemType } from "@/stores/cartStore";
import TrashButton from "../buttons/TrashButton";
import QuantityButton from "../buttons/QuantityButton";

interface CartItemProps {
  item: CartItemType;
}

const CartItemComponent = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
      {/* ANA SARMALAYICI: justify-between ile çocuklarını iki uca yaslar */}
      <div className="flex items-center justify-between space-x-4">
        {/* SOL GRUP: Resim ve Ürün Bilgisi */}
        <div className="flex items-center space-x-6">
          <div className="relative w-20 h-20 flex-shrink-0">
            {item.images && item.images.length > 0 ? (
              <Image
                src={item.images[0]}
                alt={item.name}
                fill
                className="rounded-xl object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-200 rounded-xl flex items-center justify-center">
                <span className="text-slate-500 text-xs">Resim Yok</span>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 text-lg truncate">
              {item.name}
            </h3>
            <p className="text-blue-600 font-semibold text-lg">
              {item.price.toLocaleString("tr-TR")} ₺
            </p>
            <p className="text-sm text-slate-500">
              Stok: {item.stockCount} adet
            </p>
          </div>
        </div>

        {/* SAĞ GRUP: Kontroller, Fiyat ve Silme Butonu */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Adet Kontrolleri */}
          <div className="flex items-center space-x-3">
            {/* Azaltma Butonu */}
            <QuantityButton
              variant="decrement"
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            />
            <span className="w-8 text-center font-semibold text-slate-800">
              {item.quantity}
            </span>

            {/* Artırma Butonu */}
            <QuantityButton
              variant="increment"
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              disabled={item.quantity >= item.stockCount}
            />
          </div>

          {/* Toplam Fiyat */}
          <div className="text-right w-24 hidden sm:block">
            {" "}
            {/* Mobil ekranda gizlendi */}
            <p className="font-bold text-xl text-slate-800">
              {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
            </p>
          </div>

          {/* Silme Butonu */}
          <TrashButton onClick={() => removeItem(item._id)} />
        </div>
      </div>
    </div>
  );
};

export default CartItemComponent;
