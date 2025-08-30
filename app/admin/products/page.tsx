import { Suspense } from "react";
import { ProductsTable } from "@/components/admin/product/products-table";
import { ProductForm } from "@/components/admin/product/product-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getProducts, getCategories } from "@/lib/data";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <ProductForm
          categories={categories}
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          }
        />
      </div>

      <Suspense fallback={<div>Loading products...</div>}>
        <ProductsTable products={products} categories={categories} />
      </Suspense>
    </div>
  );
}
