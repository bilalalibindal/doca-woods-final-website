"use client";

import { useState, useMemo } from "react";
import { Category, Product } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { default as NextImage } from "next/image";
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
} from "lucide-react";

interface ProductListProps {
  products: Product[];
  categories: Category[];
}

export default function ProductList({
  products,
  categories,
}: ProductListProps) {
  const { addItem } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{
    [key: string]: number;
  }>({});

  // Kategori bazında ürün filtreleme
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }
    return products.filter(
      (product) => product.categoryId === selectedCategory
    );
  }, [selectedCategory, products]);

  // Resim büyütme fonksiyonu
  const handleImageClick = (product: Product, imageIndex: number = 0) => {
    console.log("Tıklanan resim URL:", product.images[imageIndex]);
    setSelectedProduct(product);
    setSelectedImage(product.images[imageIndex]);
    setSelectedImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  // Kart içinde resim değiştirme
  const changeCardImage = (
    productId: string,
    direction: "prev" | "next",
    maxImages: number
  ) => {
    const currentIndex = currentImageIndexes[productId] || 0;
    let newIndex;

    if (direction === "next") {
      newIndex = currentIndex >= maxImages - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex <= 0 ? maxImages - 1 : currentIndex - 1;
    }

    setCurrentImageIndexes((prev) => ({
      ...prev,
      [productId]: newIndex,
    }));
  };

  // Modal içinde resim değiştirme
  const changeModalImage = (direction: "prev" | "next") => {
    if (!selectedProduct) return;

    const maxImages = selectedProduct.images.length;
    let newIndex;

    if (direction === "next") {
      newIndex =
        selectedImageIndex >= maxImages - 1 ? 0 : selectedImageIndex + 1;
    } else {
      newIndex =
        selectedImageIndex <= 0 ? maxImages - 1 : selectedImageIndex - 1;
    }

    setSelectedImageIndex(newIndex);
    setSelectedImage(selectedProduct.images[newIndex]);
  };

  // Debug için ürünleri kontrol et
  console.log("=== ÜRÜN VERİLERİ ===");
  console.log("Toplam ürün:", filteredProducts.length);
  filteredProducts.forEach((p, index) => {
    console.log(`${index + 1}. ${p.name}:`, {
      images: p.images,
      hasImages: p.images && p.images.length > 0,
      firstImage: p.images?.[0],
    });
  });

  return (
    <div className="flex flex-col lg:flex-row items-start gap-8">
      {/* SOL SÜTUN: KATEGORİLER */}
      <aside className="w-full lg:w-80 lg:sticky lg:top-24">
        <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-600" />
            Kategoriler
          </h3>
          <RadioGroup
            defaultValue="all"
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-amber-50 transition-colors">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="cursor-pointer font-medium">
                Tüm Ürünler ({products.length})
              </Label>
            </div>
            {categories.map((category) => {
              const categoryCount = products.filter(
                (p) => p.categoryId === category.id
              ).length;
              return (
                <div
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-amber-50 transition-colors"
                  key={category.id}
                >
                  <RadioGroupItem value={category.id} id={category.id} />
                  <Label
                    htmlFor={category.id}
                    className="cursor-pointer font-medium"
                  >
                    {category.name} ({categoryCount})
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </Card>
      </aside>

      {/* SAĞ SÜTUN: ÜRÜNLER */}
      <main className="flex-1">
        {/* Ürün Sayısı */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {selectedCategory === "all"
              ? "Tüm Ürünler"
              : categories.find((c) => c.id === selectedCategory)?.name}
          </h2>
          <p className="text-gray-600">
            {filteredProducts.length} ürün bulundu
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:-translate-y-1"
              >
                {/* Resim Bölümü */}
                <div className="relative w-full h-80 overflow-hidden bg-gray-100">
                  {product.images &&
                  product.images.length > 0 &&
                  product.images[0] ? (
                    <>
                      {/* Ana Resim */}
                      <div
                        className="w-full h-full cursor-pointer"
                        onClick={() =>
                          handleImageClick(
                            product,
                            currentImageIndexes[product.id] || 0
                          )
                        }
                      >
                        <NextImage
                          src={
                            product.images[currentImageIndexes[product.id] || 0]
                          }
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            console.error(
                              "Resim yüklenemedi:",
                              product.images[
                                currentImageIndexes[product.id] || 0
                              ]
                            );
                            e.currentTarget.style.display = "none";
                          }}
                          onLoad={() => {
                            console.log(
                              "Resim başarıyla yüklendi:",
                              product.images[
                                currentImageIndexes[product.id] || 0
                              ]
                            );
                          }}
                        />
                      </div>

                      {/* Resim Slayt Kontrolleri */}
                      {product.images.length > 1 && (
                        <>
                          {/* Sol Ok */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              changeCardImage(
                                product.id,
                                "prev",
                                product.images.length
                              );
                            }}
                          >
                            <ChevronLeft className="w-4 h-4 text-gray-700" />
                          </Button>

                          {/* Sağ Ok */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              changeCardImage(
                                product.id,
                                "next",
                                product.images.length
                              );
                            }}
                          >
                            <ChevronRight className="w-4 h-4 text-gray-700" />
                          </Button>

                          {/* Nokta İndikatörleri */}
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {product.images.map((_, index) => (
                              <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  index ===
                                  (currentImageIndexes[product.id] || 0)
                                    ? "bg-white"
                                    : "bg-white/50"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndexes((prev) => ({
                                    ...prev,
                                    [product.id]: index,
                                  }));
                                }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Package className="w-16 h-16 text-gray-400" />
                      <div className="absolute bottom-2 text-xs text-gray-500">
                        Resim bulunamadı
                      </div>
                    </div>
                  )}

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
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-10 w-10 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(
                          product,
                          currentImageIndexes[product.id] || 0
                        );
                      }}
                    >
                      <Eye className="w-4 h-4 text-amber-600" />
                    </Button>
                  </div>

                  {/* Fiyat Overlay */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                      <span className="text-2xl font-bold text-amber-600">
                        {product.price.toLocaleString("tr-TR")} ₺
                      </span>
                    </div>
                  </div>
                </div>

                {/* İçerik Bölümü */}
                <CardContent className="p-6 space-y-4">
                  {/* Başlık ve Açıklama */}
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors line-clamp-1">
                      {product.name}
                    </CardTitle>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Ürün Özellikleri */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {/* Malzeme ve Renk */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Palette className="w-4 h-4 text-amber-500" />
                      <div>
                        <div className="font-medium">{product.material}</div>
                        <div className="text-xs">{product.color}</div>
                      </div>
                    </div>

                    {/* Boyutlar */}
                    {product.sizeWidth && product.sizeHeight && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Ruler className="w-4 h-4 text-amber-500" />
                        <div>
                          <div className="font-medium">Boyut</div>
                          <div className="text-xs">
                            {product.sizeWidth}×{product.sizeHeight}
                            {product.sizeDepth && `×${product.sizeDepth}`} cm
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SKU */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Hash className="w-4 h-4 text-amber-500" />
                      <div>
                        <div className="font-medium">SKU</div>
                        <div className="text-xs">{product.sku}</div>
                      </div>
                    </div>

                    {/* Kategori */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="w-4 h-4 text-amber-500" />
                      <div>
                        <div className="font-medium">Kategori</div>
                        <div className="text-xs">{product.category.name}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="p-6 pt-0">
                  <Button
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 transition-all duration-300"
                    disabled={!product.inStock}
                    onClick={() => addItem(product)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.inStock ? "Sepete Ekle" : "Stokta Yok"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 w-full">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              Bu kategoride ürün bulunamadı
            </h3>
            <p className="text-gray-500">
              Lütfen başka bir kategori seçmeyi deneyin.
            </p>
          </div>
        )}
      </main>

      {/* Resim Büyütme Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-6xl w-full p-0 bg-transparent border-0"
          showCloseButton={false}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Ürün Resmi</DialogTitle>
          </DialogHeader>
          {selectedImage && selectedProduct && (
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
                  <h3 className="text-2xl font-bold mb-2">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-gray-300 mb-2">
                    {selectedProduct.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-amber-400">
                      {selectedProduct.price.toLocaleString("tr-TR")} ₺
                    </span>
                    <span className="text-sm text-gray-300">
                      {selectedImageIndex + 1} / {selectedProduct.images.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Slayt Kontrolleri */}
              {selectedProduct.images.length > 1 && (
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
                    {selectedProduct.images.map((image, index) => (
                      <button
                        key={index}
                        className={`w-16 h-16 rounded border-2 transition-all duration-300 overflow-hidden ${
                          index === selectedImageIndex
                            ? "border-white shadow-lg"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setSelectedImage(selectedProduct.images[index]);
                        }}
                      >
                        <NextImage
                          src={image}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          width={64}
                          height={64}
                          className="object-cover"
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
