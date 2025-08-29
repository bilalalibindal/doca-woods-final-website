"use client";

import { useCartStore } from "@/stores/cartStore";
import { ShoppingBagIcon, CreditCardIcon } from "@heroicons/react/24/outline";

interface CartSummaryProps {
  onCheckout: () => void;
}

const CartSummary = ({ onCheckout }: CartSummaryProps) => {
  const { totalItems, totalPrice } = useCartStore(); // Veriyi doğrudan store'dan al
  const isLoading = false; // Şimdilik backend olmadığı için statik

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sticky top-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Sepet Özeti</h2>
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center py-3 border-b border-slate-200">
          <span className="text-slate-600">Toplam Ürün:</span>
          <span className="font-semibold text-slate-800">
            {totalItems} adet
          </span>
        </div>
        <div className="flex justify-between items-center py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4">
          <span className="text-lg font-bold text-slate-800">
            Genel Toplam:
          </span>
          <span className="text-2xl font-bold text-blue-600">
            {totalPrice.toLocaleString("tr-TR")} ₺
          </span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        disabled={isLoading || totalItems === 0}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-3 shadow-lg"
      >
        <CreditCardIcon className="w-5 h-5" />
        <span>Siparişi Onayla</span>
      </button>
    </div>
  );
};

export default CartSummary;
