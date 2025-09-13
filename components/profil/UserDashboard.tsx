"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  UserIcon,
  ShoppingBagIcon,
  MapPinIcon,
  ChevronRightIcon,
  PlusIcon,
  CheckCircleIcon,
  HomeIcon,
  TrashIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { userStore } from "@/stores/userStore";
import { useSession, signOut } from "next-auth/react";
import { ProductStatus } from "@/Enum";
import LoadingScreen from "./LoadingScreen";
import { getSettings } from "@/lib/services";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  addAddressAction,
  updateAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/lib/actions";

type ActiveSection = "profile" | "orders" | "addresses";

const UserDashboard = () => {
  const { user, isLoading, error, fetchGetUser } = userStore();
  const { data: session, status: sessionStatus } = useSession();

  const [activeSection, setActiveSection] = useState<ActiveSection>("profile");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  // Adres form state'leri
  const [addressForm, setAddressForm] = useState({
    addressTitle: "",
    ulke: "Türkiye",
    sehir: "",
    mahalle: "",
    sokak: "",
    no: "",
    postaKodu: "",
    tarif: "",
    varsayilan: false,
  });

  useEffect(() => {
    if (sessionStatus === "authenticated" && !user) {
      fetchGetUser();
    }
  }, [sessionStatus, user, fetchGetUser]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsData = await getSettings();
        setSettings(settingsData);
      } catch (error) {
        console.error("Settings yüklenirken hata:", error);
      }
    };

    fetchSettings();
  }, []);

  // Adres form temizleme
  const resetAddressForm = () => {
    setAddressForm({
      addressTitle: "",
      ulke: "Türkiye",
      sehir: "",
      mahalle: "",
      sokak: "",
      no: "",
      postaKodu: "",
      tarif: "",
      varsayilan: false,
    });
    setSelectedAddress(null);
  };

  // Adres kaydetme fonksiyonu
  const handleSaveAddress = async () => {
    setIsAddressSaving(true);
    try {
      let result;

      if (selectedAddress) {
        // Adres güncelleme
        result = await updateAddressAction(selectedAddress.id, addressForm);
      } else {
        // Yeni adres ekleme
        result = await addAddressAction(addressForm);
      }

      if (result.success) {
        // Kullanıcı verilerini yeniden çek
        await fetchGetUser();

        // Modal'ı kapat ve formu temizle
        setIsAddressModalOpen(false);
        resetAddressForm();
      } else {
        console.error("Adres kaydetme hatası:", result.message);
      }
    } catch (error) {
      console.error("Adres kaydetme hatası:", error);
    } finally {
      setIsAddressSaving(false);
    }
  };

  // Dinamik hesaplamalar
  const totalUserOrdersCount = user?.orders?.length || 0;
  const pendingUserOrdersCount =
    user?.orders?.filter(
      (order) =>
        order.status === ProductStatus.PENDING ||
        order.status === ProductStatus.PREPARING ||
        order.status === ProductStatus.APPROVED
    ).length || 0;
  const addressCount = user?.addresses?.length || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case ProductStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case ProductStatus.APPROVED:
        return "bg-blue-100 text-blue-800";
      case ProductStatus.PREPARING:
        return "bg-orange-100 text-orange-800";
      case ProductStatus.SHIPPED:
        return "bg-purple-100 text-purple-800";
      case ProductStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case ProductStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case ProductStatus.PENDING:
        return "Beklemede";
      case ProductStatus.APPROVED:
        return "Onaylandı";
      case ProductStatus.PREPARING:
        return "Hazırlanıyor";
      case ProductStatus.SHIPPED:
        return "Kargoda";
      case ProductStatus.DELIVERED:
        return "Teslim Edildi";
      case ProductStatus.CANCELLED:
        return "İptal Edildi";
      default:
        return status;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">Bir hata oluştu: {error}</p>
            <Button onClick={() => fetchGetUser()}>Tekrar Dene</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-slate-600 mb-4">Lütfen giriş yapınız.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Kullanıcı Bilgileri Header */}
        <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={user.name || "Kullanıcı"}
                      width={80}
                      height={80}
                      className="rounded-full shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <UserIcon className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Hoş geldin, {user.name?.split(" ")[0]}!
                  </h1>
                  <p className="text-gray-600 text-lg">{user.email}</p>
                  <div className="flex items-center mt-3 space-x-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <ShoppingBagIcon className="w-4 h-4 mr-1" />
                      {totalUserOrdersCount} Sipariş
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {addressCount} Adres
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>Çıkış Yap</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ana Menü */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Siparişlerim Kartı */}
          <Card
            className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:-translate-y-1"
            onClick={() => setActiveSection("orders")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ShoppingBagIcon className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Siparişlerim
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Tüm siparişlerinizi görüntüleyin
              </p>
              <div className="flex justify-center space-x-2">
                <Badge className="bg-amber-100 text-amber-800">
                  {totalUserOrdersCount} Toplam
                </Badge>
                {pendingUserOrdersCount > 0 && (
                  <Badge className="bg-orange-100 text-orange-800">
                    {pendingUserOrdersCount} Bekleyen
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Adreslerim Kartı */}
          <Card
            className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:-translate-y-1"
            onClick={() => setActiveSection("addresses")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPinIcon className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Adreslerim
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Teslimat adreslerinizi yönetin
              </p>
              <div className="flex flex-col items-center mt-6 space-y-3">
                <Badge className="bg-purple-100 text-purple-800">
                  {addressCount} Adres
                </Badge>
                {activeSection === "addresses" && (
                  <Button
                    className="bg-blue-600 hover:bg-blue-900 text-white border-0"
                    size="sm"
                    onClick={() => {
                      resetAddressForm();
                      setIsAddressModalOpen(true);
                    }}
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Yeni Adres Ekle
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dinamik İçerik */}
        {activeSection === "orders" && (
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center">
                  <ShoppingBagIcon className="w-6 h-6 mr-2" />
                  Siparişlerim
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setActiveSection("profile")}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {totalUserOrdersCount === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Henüz siparişiniz bulunmuyor
                  </h3>
                  <p className="text-gray-500">
                    Alışverişe başlamak için ürünlerimizi inceleyin
                  </p>
                  <Button className="mt-4 bg-amber-600 hover:bg-amber-700">
                    Ürünleri İncele
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.orders?.map((order: any) => (
                    <div key={order.id}>
                      {/* Sipariş Kartı */}
                      <div
                        className={`border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                          order.status === ProductStatus.PENDING
                            ? "border-amber-200 bg-gradient-to-r from-amber-50/50 to-orange-50/50"
                            : "border-gray-200"
                        }`}
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsOrderModalOpen(true);
                        }}
                      >
                        {/* Bekleme durumu için özel bildirim alanı */}
                        {order.status === ProductStatus.PENDING &&
                          settings?.orderContactInfoText && (
                            <div className="bg-amber-100/80 border-b border-amber-200 rounded-t-lg p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-amber-900 font-semibold text-sm mb-1">
                                    Siparişiniz Beklemede
                                  </p>
                                  <p className="text-amber-800 text-sm leading-relaxed">
                                    {settings.orderContactInfoText}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                Sipariş #{order.id.slice(-8)}
                              </h4>
                              <p className="text-gray-600 text-sm">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "tr-TR"
                                )}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusText(order.status)}
                              </Badge>
                              <span className="font-bold text-gray-800">
                                {order.totalPrice?.toLocaleString("tr-TR")} ₺
                              </span>
                              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeSection === "addresses" && (
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center">
                  <MapPinIcon className="w-6 h-6 mr-2" />
                  Adreslerim
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => setActiveSection("profile")}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {addressCount === 0 ? (
                <div className="text-center py-12">
                  <MapPinIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Henüz adresiniz bulunmuyor
                  </h3>
                  <p className="text-gray-500 mb-4">Adres ekleyin</p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      resetAddressForm();
                      setIsAddressModalOpen(true);
                    }}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    İlk Adresimi Ekle
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.addresses?.map((address: any) => (
                    <div
                      key={address.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-800">
                              {address.addressTitle || "Adres"}
                            </h4>
                            {address.varsayilan && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircleIcon className="w-3 h-3 mr-1" />
                                Varsayılan
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!address.varsayilan && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={async () => {
                                try {
                                  const result = await setDefaultAddressAction(
                                    address.id
                                  );
                                  if (result.success) {
                                    await fetchGetUser();
                                  }
                                } catch (error) {
                                  console.error(
                                    "Varsayılan adres hatası:",
                                    error
                                  );
                                }
                              }}
                              title="Varsayılan adres yap"
                            >
                              <HomeIcon className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => {
                              setSelectedAddress(address);
                              setAddressForm({
                                addressTitle: address.addressTitle || "",
                                ulke: address.ulke || "Türkiye",
                                sehir: address.sehir || "",
                                mahalle: address.mahalle || "",
                                sokak: address.sokak || "",
                                no: address.no || "",
                                postaKodu: address.postaKodu || "",
                                tarif: address.tarif || "",
                                varsayilan: address.varsayilan || false,
                              });
                              setIsAddressModalOpen(true);
                            }}
                            title="Adresi düzenle"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={async () => {
                              if (
                                confirm(
                                  "Bu adresi silmek istediğinizden emin misiniz?"
                                )
                              ) {
                                try {
                                  const result = await deleteAddressAction(
                                    address.id
                                  );
                                  if (result.success) {
                                    await fetchGetUser();
                                  }
                                } catch (error) {
                                  console.error("Adres silme hatası:", error);
                                }
                              }
                            }}
                            title="Adresi sil"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Sipariş Detay Modal */}
        <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Sipariş Detayları
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Sipariş Numarası
                    </label>
                    <p className="text-lg font-semibold text-gray-800">
                      #{selectedOrder.id.slice(-8)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Tarih
                    </label>
                    <p className="text-lg text-gray-800">
                      {new Date(selectedOrder.createdAt).toLocaleDateString(
                        "tr-TR"
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Durum
                    </label>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {getStatusText(selectedOrder.status)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Toplam Tutar
                    </label>
                    <p className="text-lg font-bold text-gray-800">
                      {selectedOrder.totalPrice?.toLocaleString("tr-TR")} ₺
                    </p>
                  </div>
                  {/* Kargo Takip */}
                  {selectedOrder.shippingTrackingUrl && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mx-2">
                        Kargo Takip:
                      </label>
                      <a
                        href={selectedOrder.shippingTrackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1 rounded-lg transition-colors text-sm"
                      >
                        <span>Takip Et</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>

                {/* Sipariş Ürünleri */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Sipariş Ürünleri
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                          {/* Ürün Resmi */}
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {item.product?.images &&
                            item.product.images.length > 0 ? (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                width={48}
                                height={48}
                                className="object-cover"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/placeholder-product.jpg";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                <span className="text-xs text-gray-500">
                                  Resim Yok
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Ürün Bilgileri */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 truncate">
                              {item.product?.name || "Ürün Adı Yok"}
                            </h4>
                            <p className="text-sm text-gray-500">
                              SKU: {item.product?.sku || "N/A"}
                            </p>
                          </div>

                          {/* Adet */}
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Adet</p>
                            <p className="font-semibold text-gray-800">
                              {item.quantity}
                            </p>
                          </div>

                          {/* Birim Fiyat */}
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Birim Fiyat</p>
                            <p className="font-semibold text-gray-800">
                              {item.price?.toLocaleString("tr-TR")} ₺
                            </p>
                          </div>

                          {/* Toplam Fiyat */}
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Toplam</p>
                            <p className="font-bold text-gray-800">
                              {(item.price * item.quantity)?.toLocaleString(
                                "tr-TR"
                              )}{" "}
                              ₺
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <p className="text-gray-500">
                          Bu siparişte ürün bilgisi bulunamadı.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sipariş Toplam Özeti */}
                  {selectedOrder.items && selectedOrder.items.length > 0 && (
                    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">
                          Sipariş Toplamı:
                        </span>
                        <span className="text-xl font-bold text-amber-600">
                          {selectedOrder.totalPrice?.toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Adres Ekleme/Düzenleme Modal */}
        <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                {selectedAddress ? "Adres Düzenle" : "Yeni Adres Ekle"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Adres ismi */}
                <div className="md:col-span-2">
                  <Label htmlFor="addressTitle">Adres ismi *</Label>
                  <Input
                    id="addressTitle"
                    type="text"
                    placeholder="Ev, İş yeri, Anne evi, vs."
                    value={addressForm.addressTitle}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        addressTitle: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                {/* Ülke */}
                <div>
                  <Label htmlFor="ulke">Ülke *</Label>
                  <Input
                    id="ulke"
                    type="text"
                    value={addressForm.ulke}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, ulke: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                {/* Şehir */}
                <div>
                  <Label htmlFor="sehir">Şehir *</Label>
                  <Input
                    id="sehir"
                    type="text"
                    placeholder="İstanbul"
                    value={addressForm.sehir}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, sehir: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                {/* Mahalle */}
                <div>
                  <Label htmlFor="mahalle">Mahalle *</Label>
                  <Input
                    id="mahalle"
                    type="text"
                    placeholder="Kadıköy"
                    value={addressForm.mahalle}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        mahalle: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                {/* Sokak */}
                <div>
                  <Label htmlFor="sokak">Sokak *</Label>
                  <Input
                    id="sokak"
                    type="text"
                    placeholder="Bahariye Caddesi"
                    value={addressForm.sokak}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, sokak: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                {/* Kapı No */}
                <div>
                  <Label htmlFor="no">Kapı No *</Label>
                  <Input
                    id="no"
                    type="text"
                    placeholder="123/4"
                    value={addressForm.no}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, no: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                {/* Posta Kodu */}
                <div>
                  <Label htmlFor="postaKodu">Posta Kodu *</Label>
                  <Input
                    id="postaKodu"
                    type="text"
                    placeholder="34710"
                    value={addressForm.postaKodu}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        postaKodu: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                {/* Adres Tarifi */}
                <div className="md:col-span-2">
                  <Label htmlFor="tarif">Adres Tarifi</Label>
                  <Textarea
                    id="tarif"
                    placeholder="Apartman girişi sağ taraf, 3. kat..."
                    value={addressForm.tarif}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, tarif: e.target.value })
                    }
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {/* Varsayılan Adres */}
                <div className="md:col-span-2 flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="varsayilan"
                    checked={addressForm.varsayilan}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      if (isChecked) {
                        // Eğer başka varsayılan adres varsa kullanıcıya bilgi ver
                        const hasDefaultAddress = user?.addresses?.some(
                          (addr: any) =>
                            addr.varsayilan &&
                            (!selectedAddress || addr.id !== selectedAddress.id)
                        );
                        if (hasDefaultAddress) {
                          if (
                            confirm(
                              "Başka bir varsayılan adresiniz var. Bu adresi varsayılan yapmak istediğinizden emin misiniz? Önceki varsayılan adres kaldırılacak."
                            )
                          ) {
                            setAddressForm({
                              ...addressForm,
                              varsayilan: true,
                            });
                          }
                        } else {
                          setAddressForm({
                            ...addressForm,
                            varsayilan: true,
                          });
                        }
                      } else {
                        setAddressForm({
                          ...addressForm,
                          varsayilan: false,
                        });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <div>
                    <Label
                      htmlFor="varsayilan"
                      className="cursor-pointer font-medium"
                    >
                      Bu adresi varsayılan adres olarak ayarla
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Teslimat adresi olarak kullanılacak
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddressModalOpen(false);
                    resetAddressForm();
                  }}
                  disabled={isAddressSaving}
                >
                  İptal
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleSaveAddress}
                  disabled={
                    isAddressSaving ||
                    !addressForm.addressTitle ||
                    !addressForm.sehir ||
                    !addressForm.mahalle ||
                    !addressForm.sokak ||
                    !addressForm.no ||
                    !addressForm.postaKodu
                  }
                >
                  {isAddressSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Kaydediliyor...
                    </>
                  ) : selectedAddress ? (
                    "Güncelle"
                  ) : (
                    "Kaydet"
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

export default UserDashboard;
