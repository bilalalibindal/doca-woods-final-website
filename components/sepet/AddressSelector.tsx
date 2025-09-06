"use client";

import { useState } from "react";
import {
  MapPinIcon,
  PlusIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface Address {
  addressTitle: string;
  ulke: string;
  sehir: string;
  mahalle: string;
  sokak: string;
  no: string;
  postaKodu: string;
  tarif?: string;
  varsayilan?: boolean;
}

interface AddressSelectorProps {
  savedAddresses: Address[];
  onAddressSelect: (address: Address) => void;
  onNewAddressClick: () => void;
  isVisible: boolean;
}

const AddressSelector = ({
  savedAddresses,
  onAddressSelect,
  onNewAddressClick,
  isVisible,
}: AddressSelectorProps) => {
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<
    number | null
  >(null);

  if (!isVisible) return null;

  const handleAddressSelect = (address: Address, index: number) => {
    setSelectedAddressIndex(index);
    onAddressSelect(address);
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <MapPinIcon className="w-6 h-6 mr-3 text-blue-500" />
        Teslimat Adresi Seçin
      </h2>

      {savedAddresses.length > 0 ? (
        <div className="space-y-4 mb-6">
          {savedAddresses.map((address, index) => (
            <div
              key={index}
              onClick={() => handleAddressSelect(address, index)}
              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                selectedAddressIndex === index
                  ? "border-blue-500 bg-blue-50/50 shadow-lg"
                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {address.addressTitle}
                    </span>
                    {address.varsayilan && (
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                        Varsayılan
                      </span>
                    )}
                    {selectedAddressIndex === index && (
                      <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                    )}
                  </div>

                  <p className="text-slate-700 leading-relaxed mb-2">
                    {address.sokak} {address.no}
                  </p>

                  <p className="text-slate-600 text-sm mb-2">
                    {address.mahalle}, {address.sehir} {address.postaKodu}
                  </p>

                  <p className="text-slate-600 text-sm">{address.ulke}</p>

                  {address.tarif && (
                    <p className="text-slate-500 text-xs mt-2 italic">
                      {address.tarif}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 mb-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPinIcon className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 mb-4">
            Henüz kayıtlı adresiniz bulunmuyor.
          </p>
        </div>
      )}

      <button
        onClick={onNewAddressClick}
        className="w-full flex items-center justify-center space-x-3 py-4 px-6 border-2 border-dashed border-blue-300 rounded-2xl text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 font-medium"
      >
        <PlusIcon className="w-5 h-5" />
        <span>Yeni Adres Ekle</span>
      </button>

      {selectedAddressIndex !== null && (
        <button
          onClick={() => onAddressSelect(savedAddresses[selectedAddressIndex])}
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Bu Adresi Kullan
        </button>
      )}
    </div>
  );
};

export default AddressSelector;
