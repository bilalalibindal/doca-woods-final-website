import React, { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/services";
import ProductList from "@/components/urunler/productList";
import { ProductsSkeleton, Loading } from "@/components/ui/loading";

// Ürün verilerini getiren async component
async function ProductsData() {
  const products = await getProducts();
  const categories = await getCategories();

  return <ProductList products={products} categories={categories} />;
}

// Kategori verilerini getiren async component
async function CategoriesData() {
  const categories = await getCategories();
  return categories;
}

const ProductsPage = () => {
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

        {/* Ürün verilerini Suspense ile sarmalayarak loading state sağlıyoruz */}
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsData />
        </Suspense>
      </div>
    </div>
  );
};

export default ProductsPage;
