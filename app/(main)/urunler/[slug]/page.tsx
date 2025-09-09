import React, { Suspense } from "react";
import { getProducts } from "@/lib/services";
import { Loading, ProductsSkeleton } from "@/components/ui/loading";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/urunler/ProductDetail";

// Ürün detayını getiren async component
async function ProductDetailData({ slug }: { slug: string }) {
  const products = await getProducts();
  const product = products.find((p) => p.id === slug || p.sku === slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}

// Ürün detay sayfası
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductDetailData slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  try {
    const products = await getProducts();
    const product = products.find((p) => p.id === slug || p.sku === slug);

    if (!product) {
      return {
        title: "Ürün Bulunamadı | Doca Woods",
      };
    }

    return {
      title: `${product.name} | Doca Woods`,
      description: product.description,
      keywords: `${product.name}, ahşap ürün, ${product.category.name}, ${product.material}`,
    };
  } catch (error) {
    return {
      title: "Ürün Detayı | Doca Woods",
    };
  }
}
