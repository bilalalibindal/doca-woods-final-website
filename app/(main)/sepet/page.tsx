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
import { useSession } from "next-auth/react";
import { createOrderAction } from "@/lib/actions";
import { toast } from "sonner";
import { userStore } from "@/stores/userStore";

const SepetSayfasi = () => {
  const router = useRouter();
  const { items, totalItems, clearCart } = useCartStore();
  const { data: session, status: sessionStatus } = useSession();
  const { user, fetchGetUser } = userStore();
  const [isPaymentModalOpen, setisPaymentModalOpen] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  // Kullanıcı adreslerini dönüştür
  const userAddresses =
    user?.addresses?.map((address) => ({
      addressTitle: address.addressTitle,
      ulke: address.ulke,
      sehir: address.sehir,
      mahalle: address.mahalle,
      sokak: address.sokak,
      no: address.no,
      postaKodu: address.postaKodu,
      tarif: address.tarif,
      varsayilan: address.varsayilan,
      id: address.id, // AddressSelector için ID gerekli
    })) || [];

  const handleCheckout = () => {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (sessionStatus !== "authenticated") {
      toast.error("Sipariş verebilmek için lütfen giriş yapınız.");
      router.push("/profil");
      return;
    }

    // Kullanıcı giriş yapmışsa ödeme modalını aç
    setisPaymentModalOpen(true);
  };

  const handleOrderComplete = async () => {
    if (!selectedAddressId) {
      toast.error("Lütfen bir teslimat adresi seçiniz.");
      return;
    }

    setIsOrderLoading(true);

    try {
      // Sepet verilerini sipariş formatına dönüştür
      const orderData = {
        addressId: selectedAddressId,
        products: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        customizationImages: [], // İleride eklenebilir
      };

      const result = await createOrderAction(orderData);

      if (result.success) {
        toast.success("Siparişiniz başarıyla oluşturuldu!");
        clearCart(); // Sepeti temizle
        router.push("/profil"); // Profil sayfasına yönlendir
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Sipariş hatası:", error);
      toast.error("Sipariş oluşturulurken bir hata oluştu.");
    } finally {
      setIsOrderLoading(false);
      setisPaymentModalOpen(false);
    }
  };

  if (totalItems === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Sepetiniz Boş
        </h2>
        <button
          onClick={() => router.push("/urunler")}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 hover:shadow-lg hover:scale-105 hover:cursor-pointer"
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
                savedAddresses={userAddresses}
                onAddressSelect={(address) =>
                  setSelectedAddressId(address.id || null)
                }
                onNewAddressClick={() => {
                  // Kullanıcıyı profil sayfasına yönlendir
                  router.push("/profil");
                  toast.info(
                    "Yeni adres eklemek için profil sayfasına yönlendirildiniz."
                  );
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
                  className={`flex-1 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 ${
                    !selectedAddressId
                      ? "bg-gray-400 cursor-not-allowed opacity-60"
                      : "bg-green-600 hover:bg-green-700 hover:shadow-lg hover:scale-105"
                  }`}
                  onClick={handleOrderComplete}
                  disabled={isOrderLoading || !selectedAddressId}
                >
                  {isOrderLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sipariş Oluşturuluyor...
                    </>
                  ) : (
                    "Siparişi Tamamla"
                  )}
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
