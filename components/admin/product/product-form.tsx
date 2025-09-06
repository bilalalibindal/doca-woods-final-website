"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createProduct, updateProduct } from "@/lib/admin-actions";
import type { Product, Category } from "@/types/admin";
import ImageUpload from "@/components/ImageUpload";
import { toastAlert } from "@/components/toastAlert";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  trigger: React.ReactNode;
}

export function ProductForm({
  product,
  categories,
  trigger,
}: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images || []);
  const isEditing = !!product;

  const handleSubmit = async (formData: FormData) => {
    // Add images to form data
    images.forEach((image) => {
      formData.append("images", image);
    });

    if (isEditing) {
      const response = await updateProduct(product.id, formData);
      toastAlert(response);
    } else {
      const response = await createProduct(formData);
      toastAlert(response);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={product?.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" defaultValue={product?.sku} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={product?.price}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select name="categoryId" defaultValue={product?.categoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stockCount">Stock Count</Label>
              <Input
                id="stockCount"
                name="stockCount"
                type="number"
                defaultValue={product?.stockCount}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="inStock"
                name="inStock"
                defaultChecked={product?.inStock}
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                name="material"
                defaultValue={product?.material}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                defaultValue={product?.color}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sizeWidth">Width (cm)</Label>
              <Input
                id="sizeWidth"
                name="sizeWidth"
                type="number"
                step="0.1"
                defaultValue={product?.sizeWidth || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sizeHeight">Height (cm)</Label>
              <Input
                id="sizeHeight"
                name="sizeHeight"
                type="number"
                step="0.1"
                defaultValue={product?.sizeHeight || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sizeDepth">Depth (cm)</Label>
              <Input
                id="sizeDepth"
                name="sizeDepth"
                type="number"
                step="0.1"
                defaultValue={product?.sizeDepth || ""}
              />
            </div>
          </div>
          {/* Product Images */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Ürün Resimleri
            </h3>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={5}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Product" : "Save Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
