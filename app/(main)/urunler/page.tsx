import React from "react";
import { categoryServices, productServices } from "@/lib/services/services";
import ProductList from "@/components/urunler/productList"; // Yeni bileşenimizi import ediyoruz

// Bu bileşen bir Server Component olarak kalıyor.
const ProductsPage = async () => {
  // Veriyi sunucuda çekiyoruz
  const { getProducts } = await productServices();
  const { getCategories } = await categoryServices();
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            El İşi Ahşap Ürünler
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kaliteli malzemelerle özenle hazırladığımız el işi ahşap
            ürünlerimizi keşfedin
          </p>
        </div>

        {/* Tüm listeleme ve filtreleme işini Client Component'e devrediyoruz */}
        <ProductList products={products} categories={categories} />
      </div>
    </div>
  );
};

export default ProductsPage;
