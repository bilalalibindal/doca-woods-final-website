"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  ShoppingBagIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { IOrder } from "@/interfaces/orderInterface";
import { ProductStatus } from "@/Enum";
import { default as NextImage } from "next/image";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: IOrder | null;
}

const OrderDetailsModal = ({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) => {
  if (!order) return null;

  const getStatusIcon = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.PENDING:
        return <ClockIcon className="w-5 h-5 text-amber-500" />;
      case ProductStatus.APPROVED:
        return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      case ProductStatus.PREPARING:
        return <TruckIcon className="w-5 h-5 text-orange-500" />;
      case ProductStatus.SHIPPED:
        return <TruckIcon className="w-5 h-5 text-purple-500" />;
      case ProductStatus.DELIVERED:
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case ProductStatus.CANCELLED:
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.PENDING:
        return "Beklemede";
      case ProductStatus.APPROVED:
        return "Onaylandı";
      case ProductStatus.PREPARING:
        return "Hazırlanıyor";
      case ProductStatus.SHIPPED:
        return "Kargoya Verildi";
      case ProductStatus.DELIVERED:
        return "Teslim Edildi";
      case ProductStatus.CANCELLED:
        return "İptal Edildi";
      default:
        return "Bilinmeyen";
    }
  };

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.PENDING:
        return "bg-amber-100 text-amber-800 border-amber-200";
      case ProductStatus.APPROVED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ProductStatus.PREPARING:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case ProductStatus.SHIPPED:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case ProductStatus.DELIVERED:
        return "bg-green-100 text-green-800 border-green-200";
      case ProductStatus.CANCELLED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl p-8 text-left align-middle shadow-2xl transition-all border border-white/20">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <ShoppingBagIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Dialog.Title className="text-2xl font-bold text-slate-800">
                        Sipariş #{order._id.slice(-8).toUpperCase()}
                      </Dialog.Title>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString(
                            "tr-TR"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Sol taraf - Ürünler */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        Sipariş İçeriği
                      </h3>
                      <div className="space-y-4">
                        {order.products.map((productItem, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4 bg-slate-50/50 rounded-xl p-4"
                          >
                            {productItem.product.images &&
                              productItem.product.images[0] && (
                                <NextImage
                                  src={productItem.product.images[0]}
                                  alt={productItem.product.name}
                                  width={64}
                                  height={64}
                                  className="object-cover rounded-lg shadow-sm"
                                />
                              )}
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-800">
                                {productItem.product.name}
                              </h4>
                              <p className="text-sm text-slate-600 mb-2">
                                {productItem.product.description}
                              </p>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="text-slate-600">
                                  Adet: {productItem.quantity}
                                </span>
                                <span className="text-slate-600">
                                  Birim Fiyat:{" "}
                                  {productItem.product.price.toLocaleString(
                                    "tr-TR"
                                  )}{" "}
                                  ₺
                                </span>
                                <span className="text-slate-600">
                                  Materyal: {productItem.product.material}
                                </span>
                                <span className="text-slate-600">
                                  Renk: {productItem.product.color}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-slate-800">
                                {(
                                  productItem.product.price *
                                  productItem.quantity
                                ).toLocaleString("tr-TR")}{" "}
                                ₺
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Özelleştirme Resimleri */}
                    {order.customizationImage &&
                      order.customizationImage.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-4">
                            Özelleştirme Resimleri
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {order.customizationImage.map((image, index) => (
                              <div className="w-full h-32 relative">
                                <NextImage
                                  key={index}
                                  src={image}
                                  alt={`Özelleştirme ${index + 1}`}
                                  fill
                                  className="object-cover rounded-lg shadow-sm"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Sağ taraf - Özet ve Adres */}
                  <div className="space-y-6">
                    {/* Sipariş Özeti */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        Sipariş Özeti
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Ürün Sayısı:</span>
                          <span className="font-medium text-slate-800">
                            {order.products.length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Toplam Adet:</span>
                          <span className="font-medium text-slate-800">
                            {order.products.reduce(
                              (total, item) => total + item.quantity,
                              0
                            )}
                          </span>
                        </div>
                        <div className="border-t border-blue-200 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-slate-800">
                              Toplam:
                            </span>
                            <div className="flex items-center space-x-1">
                              <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                              <span className="text-xl font-bold text-slate-800">
                                {order.totalPrice.toLocaleString("tr-TR")} ₺
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Teslimat Adresi */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                      <div className="flex items-center space-x-2 mb-4">
                        <MapPinIcon className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-lg font-semibold text-slate-800">
                          Teslimat Adresi
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-slate-800">
                          {order.address.addressTitle}
                        </p>
                        <p className="text-slate-600">
                          {order.address.mahalle}, {order.address.sokak} No:{" "}
                          {order.address.no}
                        </p>
                        <p className="text-slate-600">
                          {order.address.sehir}/{order.address.ulke} -{" "}
                          {order.address.postaKodu}
                        </p>
                        {order.address.tarif && (
                          <p className="text-sm text-slate-500 mt-2 italic">
                            {order.address.tarif}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Kargo Takip */}
                    {order.shippingTrackingUrl && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                        <div className="flex items-center space-x-2 mb-4">
                          <TruckIcon className="w-5 h-5 text-purple-600" />
                          <h3 className="text-lg font-semibold text-slate-800">
                            Kargo Takip
                          </h3>
                        </div>
                        <a
                          href={order.shippingTrackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                          <TruckIcon className="w-4 h-4" />
                          <span>Kargoyu Takip Et</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={onClose}
                    className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200"
                  >
                    Kapat
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OrderDetailsModal;
