"use client";

import { useState, ChangeEvent } from "react";
import { CldImage } from "next-cloudinary";
import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (newImages: string[]) => void;
  maxImages?: number;
}

const ImageUpload = ({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (images.length >= maxImages) {
      toast.warn(`En fazla ${maxImages} resim yükleyebilirsiniz.`);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Resim yüklenemedi.");
      }

      onImagesChange([...images, data.url]);
      toast.success("Resim başarıyla yüklendi.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      // Input'u sıfırla ki aynı dosya tekrar seçilebilsin
      event.target.value = "";
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const newImages = images.filter((url) => url !== urlToRemove);
    onImagesChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ürün Resimleri (En Fazla {maxImages} Adet)
      </label>

      {/* Yüklenmiş Resimleri Gösterme */}
      <div className="flex flex-wrap gap-4 mb-4">
        {images.map((url) => (
          <div
            key={url}
            className="relative w-28 h-28 rounded-lg overflow-hidden border"
          >
            <CldImage
              src={url}
              width="112"
              height="112"
              alt="Yüklenen ürün resmi"
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(url)}
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        {/* Yükleniyor durumu için bir yer tutucu */}
        {isLoading && (
          <div className="w-28 h-28 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <ArrowPathIcon className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Dosya Seçme Input'u */}
      {images.length < maxImages && (
        <div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 disabled:opacity-50"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
