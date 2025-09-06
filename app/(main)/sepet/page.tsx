"use client";

import { useCartStore } from "@/stores/cartStore";
import CartItemComponent from "@/components/sepet/CartItem";
import CartSummary from "@/components/sepet/CartSummary";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddressSelector from "@/components/sepet/AddressSelector";

const SepetSayfasi = () => {
  const router = useRouter();
  const { items, totalItems } = useCartStore();
  const [isPaymentModalOpen, setisPaymentModalOpen] = useState(false);

  // Mock adres verileri - gerçek uygulamada kullanıcının kayıtlı adreslerini çekeceksiniz
  const mockAddresses = [
    {
      addressTitle: "Ev",
      ulke: "Türkiye",
      sehir: "İstanbul",
      mahalle: "Kadıköy",
      sokak: "Bahariye Caddesi",
      no: "123",
      postaKodu: "34710",
      tarif: "Apartman girişi sağ taraf",
      varsayilan: true,
    },
    {
      addressTitle: "İş",
      ulke: "Türkiye",
      sehir: "İstanbul",
      mahalle: "Şişli",
      sokak: "Büyükdere Caddesi",
      no: "456",
      postaKodu: "34394",
    },
  ];

  const [selectedAddress, setSelectedAddress] = useState<{
    addressTitle: string;
    ulke: string;
    sehir: string;
    mahalle: string;
    sokak: string;
    no: string;
    postaKodu: string;
    tarif?: string;
    varsayilan?: boolean;
  } | null>(null);

  const handleCheckout = () => {
    setisPaymentModalOpen(true);
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
            <h1 className="text-4xl font-bold text-slate-800">Sepet</h1>
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
          <div className="lg:col-span-1 sticky top-8">
            <CartSummary onCheckout={handleCheckout} />
          </div>
        </div>

        {/* Ödeme Modal */}
        <Dialog open={isPaymentModalOpen} onOpenChange={setisPaymentModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-800">
                Sipariş Bilgileri
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <AddressSelector
                savedAddresses={mockAddresses}
                onAddressSelect={setSelectedAddress}
                onNewAddressClick={() => {
                  // TODO: Yeni adres ekleme modal'ını aç
                  console.log("Yeni adres ekleme modal'ı açılacak");
                }}
                isVisible={true}
              />
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setisPaymentModalOpen(false)}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    // TODO: Sipariş işlemi
                    setisPaymentModalOpen(false);
                  }}
                >
                  Siparişi Tamamla
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SepetSayfasi;
