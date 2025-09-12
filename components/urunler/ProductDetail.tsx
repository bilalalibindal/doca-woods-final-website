import React, { useState } from "react";
import { Product } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Eye,
  Ruler,
  Palette,
  Package,
  Calendar,
  Hash,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { default as NextImage } from "next/image";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCartStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Resim büyütme fonksiyonu
  const handleImageClick = (imageIndex: number = 0) => {
    setSelectedImage(product.images[imageIndex]);
    setSelectedImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  // Modal içinde resim değiştirme
  const changeModalImage = (direction: "prev" | "next") => {
    const maxImages = product.images.length;
    let newIndex;

    if (direction === "next") {
      newIndex =
        selectedImageIndex >= maxImages - 1 ? 0 : selectedImageIndex + 1;
    } else {
      newIndex =
        selectedImageIndex <= 0 ? maxImages - 1 : selectedImageIndex - 1;
    }

    setSelectedImageIndex(newIndex);
    setSelectedImage(product.images[newIndex]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Geri Dön Butonu */}
      <div className="mb-6">
        <Link href="/urunler">
          <Button
            variant="ghost"
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ürünlere Dön
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Sol Sütun - Resimler */}
        <div className="space-y-4">
          {/* Ana Resim */}
          <div className="relative w-full h-96 lg:h-[500px] overflow-hidden bg-gray-100 rounded-xl shadow-lg">
            {product.images && product.images.length > 0 ? (
              <>
                <div
                  className="w-full h-full cursor-pointer"
                  onClick={() => handleImageClick(currentImageIndex)}
                >
                  <NextImage
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* Stok Durumu */}
                <div className="absolute top-4 left-4">
                  {product.inStock ? (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white font-medium">
                      <Package className="w-3 h-3 mr-1" />
                      Stokta ({product.stockCount})
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="font-medium">
                      Tükendi
                    </Badge>
                  )}
                </div>

                {/* Büyütme İkonu */}
                <div className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-all duration-300">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg"
                    onClick={() => handleImageClick(currentImageIndex)}
                  >
                    <Eye className="w-4 h-4 text-amber-600" />
                  </Button>
                </div>

                {/* Resim Navigasyonu */}
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white shadow-lg opacity-0 hover:opacity-100 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newIndex =
                          currentImageIndex <= 0
                            ? product.images.length - 1
                            : currentImageIndex - 1;
                        setCurrentImageIndex(newIndex);
                      }}
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-700" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white shadow-lg opacity-0 hover:opacity-100 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newIndex =
                          currentImageIndex >= product.images.length - 1
                            ? 0
                            : currentImageIndex + 1;
                        setCurrentImageIndex(newIndex);
                      }}
                    >
                      <ChevronRight className="w-4 h-4 text-gray-700" />
                    </Button>

                    {/* Thumbnail İndikatörleri */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(index);
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-xl">
                <Package className="w-16 h-16 text-gray-400" />
                <div className="absolute bottom-2 text-xs text-gray-500">
                  Resim bulunamadı
                </div>
              </div>
            )}
          </div>

          {/* Küçük Resimler */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    index === currentImageIndex
                      ? "border-amber-500 shadow-lg"
                      : "border-gray-200 hover:border-amber-300"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <NextImage
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sağ Sütun - Ürün Bilgileri */}
        <div className="space-y-6">
          {/* Başlık ve Fiyat */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>
            <div className="text-4xl font-bold text-amber-600 mb-4">
              {product.price.toLocaleString("tr-TR")} ₺
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Açıklama
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Özellikler */}
          <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-600" />
                Ürün Özellikleri
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 gap-4">
                {/* Malzeme ve Renk */}
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <Palette className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="font-medium text-gray-800">
                      {product.material}
                    </div>
                    <div className="text-sm text-gray-600">{product.color}</div>
                  </div>
                </div>

                {/* Boyutlar */}
                {product.sizeWidth && product.sizeHeight && (
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                    <Ruler className="w-5 h-5 text-amber-500" />
                    <div>
                      <div className="font-medium text-gray-800">Boyut</div>
                      <div className="text-sm text-gray-600">
                        {product.sizeWidth}×{product.sizeHeight}
                        {product.sizeDepth && `×${product.sizeDepth}`} cm
                      </div>
                    </div>
                  </div>
                )}

                {/* SKU */}
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <Hash className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="font-medium text-gray-800">SKU</div>
                    <div className="text-sm text-gray-600">{product.sku}</div>
                  </div>
                </div>

                {/* Kategori */}
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <Package className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="font-medium text-gray-800">Kategori</div>
                    <div className="text-sm text-gray-600">
                      {product.category.name}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sepete Ekle Butonu */}
          <div className="pt-4">
            <Button
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={!product.inStock}
              onClick={() => addItem(product)}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.inStock ? "Sepete Ekle" : "Stokta Yok"}
            </Button>
          </div>
        </div>
      </div>

      {/* Resim Büyütme Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl w-full p-0 bg-transparent border-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Ürün Resmi</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full h-[85vh] bg-black/95 rounded-lg overflow-hidden">
              {/* Ana Resim */}
              <NextImage
                src={selectedImage}
                alt="Ürün resmi"
                fill
                className="object-contain"
              />

              {/* Ürün Bilgileri */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-300 mb-2">{product.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-amber-400">
                      {product.price.toLocaleString("tr-TR")} ₺
                    </span>
                    <span className="text-sm text-gray-300">
                      {selectedImageIndex + 1} / {product.images.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Slayt Kontrolleri */}
              {product.images.length > 1 && (
                <>
                  {/* Sol Ok */}
                  <Button
                    variant="ghost"
                    size="lg"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 p-0 rounded-full bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => changeModalImage("prev")}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  {/* Sağ Ok */}
                  <Button
                    variant="ghost"
                    size="lg"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 p-0 rounded-full bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => changeModalImage("next")}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>

                  {/* Thumbnail'lar */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 rounded-lg p-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        className={`w-16 h-16 rounded border-2 transition-all duration-300 ${
                          index === selectedImageIndex
                            ? "border-white shadow-lg"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setSelectedImage(product.images[index]);
                        }}
                      >
                        <NextImage
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Kapatma Butonu */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-white hover:bg-red-600 h-10 w-10 p-0 rounded-full"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
