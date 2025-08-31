"use client";

import { useCartStore } from "@/stores/cartStore";
import CartItemComponent from "@/components/sepet/CartItem";
import CartSummary from "@/components/sepet/CartSummary";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const SepetSayfasi = () => {
  const router = useRouter();
  const { items, totalItems } = useCartStore();

  const handleCheckout = () => {
    // Bu fonksiyon şimdilik sadece bir uyarı verecek.
    // Backend'i kurduğunda, adres seçme/sipariş oluşturma mantığı buraya gelecek.
    alert("Ödeme adımına geçiliyor! (Backend henüz bağlı değil)");
    // Örnek: router.push('/odeme');
  };

  if (totalItems === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Sepetiniz Boş
        </h2>
        <button
          onClick={() => router.push("/urunler")}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg"
        >
          Alışverişe Başla
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-slate-200"
            >
              <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-4xl font-bold text-slate-800">Sepetim</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Sol Sütun: Sepet Ürünleri */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
          </div>

          {/* Sağ Sütun: Sipariş Özeti */}
          <div className="lg:col-span-1">
            <CartSummary onCheckout={handleCheckout} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SepetSayfasi;
