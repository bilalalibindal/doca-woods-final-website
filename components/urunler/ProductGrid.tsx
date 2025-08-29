import React from "react";
import { IProduct } from "@/types/productTypes";
import ProductCard from "@/components/urunler/ProductCard";

interface ProductGridProps {
  products: IProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
